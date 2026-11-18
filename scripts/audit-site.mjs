import { gzipSync } from "node:zlib";
import { JSDOM, VirtualConsole } from "jsdom";
import axe from "axe-core";

const args = process.argv.slice(2);
const base = (args.find((arg) => arg.startsWith("http")) ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
const axeAll = args.includes("--axe=all");

const failures = [];
const warnings = [];
const fail = (page, message) => failures.push(`${page}  ${message}`);
const warn = (page, message) => warnings.push(`${page}  ${message}`);

const cache = new Map();

async function get(path) {
  if (cache.has(path)) return cache.get(path);
  const response = await fetch(base + path, { redirect: "manual" });
  const bytes = Buffer.from(await response.arrayBuffer());
  const entry = {
    status: response.status,
    type: response.headers.get("content-type") ?? "",
    bytes,
    headers: response.headers,
  };
  cache.set(path, entry);
  return entry;
}

const gzSize = (bytes) => gzipSync(bytes).length;
const kb = (bytes) => (bytes / 1024).toFixed(1);

function normalizePath(href, from) {
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return null;
  let url;
  try {
    url = new URL(href, base + from);
  } catch {
    return null;
  }
  if (url.origin !== new URL(base).origin) return null;
  let path = url.pathname;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (path.startsWith("/_next/") || path.startsWith("/api/")) return null;
  return path;
}

function parse(html) {
  return new JSDOM(html, {
    runScripts: "outside-only",
    virtualConsole: new VirtualConsole(),
  });
}

const sitemap = await get("/sitemap.xml");
const robots = await get("/robots.txt");
if (sitemap.status !== 200) fail("/sitemap.xml", `status ${sitemap.status}`);
if (robots.status !== 200) fail("/robots.txt", `status ${robots.status}`);

const sitemapPaths = [...sitemap.bytes.toString().matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
  const path = new URL(match[1]).pathname;
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
});
if (new Set(sitemapPaths).size !== sitemapPaths.length)
  fail("/sitemap.xml", "contains duplicate URLs");

const reached = new Set();
const linkedFrom = new Map();
const queue = ["/"];
const pages = new Map();

while (queue.length > 0) {
  const path = queue.shift();
  if (reached.has(path)) continue;
  reached.add(path);
  const entry = await get(path);
  if (entry.status !== 200) {
    fail(
      path,
      `status ${entry.status} (linked from ${[...(linkedFrom.get(path) ?? [])].slice(0, 3).join(", ")})`,
    );
    continue;
  }
  if (!entry.type.includes("text/html")) continue;
  const dom = parse(entry.bytes.toString());
  pages.set(path, dom);
  for (const anchor of dom.window.document.querySelectorAll("a[href]")) {
    const target = normalizePath(anchor.getAttribute("href"), path);
    if (!target) continue;
    if (!linkedFrom.has(target)) linkedFrom.set(target, new Set());
    linkedFrom.get(target).add(path);
    if (!reached.has(target)) queue.push(target);
  }
}

const titles = new Map();
const descriptions = new Map();
const rows = [];
const axeGroups = new Set();

const groupOf = (path) => path.replace(/^\/(brands|news)\/.+$/, "/$1/[slug]");

for (const path of sitemapPaths) {
  const dom = pages.get(path);
  if (!dom) {
    fail(
      path,
      "in the sitemap but not reachable by following links from the homepage (orphan or error)",
    );
    continue;
  }
  const doc = dom.window.document;
  const meta = (selector) => doc.querySelector(selector)?.getAttribute("content")?.trim() ?? "";

  const title = doc.querySelector("title")?.textContent?.trim() ?? "";
  const description = meta('meta[name="description"]');
  if (!title) fail(path, "missing <title>");
  if (!description) fail(path, "missing meta description");
  if (title) titles.set(title, [...(titles.get(title) ?? []), path]);
  if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), path]);

  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
  if (!canonical) fail(path, "missing canonical");
  else {
    const canonicalPath = new URL(canonical, base).pathname.replace(/(.)\/$/, "$1");
    if (canonicalPath !== path) fail(path, `canonical points to ${canonicalPath}`);
  }

  const h1Count = doc.querySelectorAll("h1").length;
  if (h1Count !== 1) fail(path, `${h1Count} h1 elements`);
  if (!doc.documentElement.getAttribute("lang")) fail(path, "missing html lang");

  for (const property of ["og:title", "og:description", "og:image", "og:url"]) {
    if (!meta(`meta[property="${property}"]`)) fail(path, `missing ${property}`);
  }
  if (!meta('meta[name="twitter:card"]')) fail(path, "missing twitter:card");
  if (!meta('meta[name="twitter:image"]')) fail(path, "missing twitter:image");

  for (const [index, script] of [
    ...doc.querySelectorAll('script[type="application/ld+json"]'),
  ].entries()) {
    try {
      const data = JSON.parse(script.textContent);
      if (data["@context"] !== "https://schema.org")
        fail(path, `JSON-LD #${index + 1} has no schema.org context`);
      if (!data["@type"] && !data["@graph"]) fail(path, `JSON-LD #${index + 1} has no @type`);
    } catch {
      fail(path, `JSON-LD #${index + 1} is not valid JSON`);
    }
  }

  const noAlt = [...doc.querySelectorAll("img")].filter((img) => !img.hasAttribute("alt")).length;
  if (noAlt) fail(path, `${noAlt} image(s) without alt`);
  const hashLinks = doc.querySelectorAll('a[href="#"]').length;
  if (hashLinks) fail(path, `${hashLinks} placeholder href="#" link(s)`);

  const ids = [...doc.querySelectorAll("[id]")].map((el) => el.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) fail(path, `duplicate ids: ${[...new Set(duplicateIds)].join(", ")}`);

  let previous = 0;
  for (const heading of doc.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    const level = Number(heading.tagName[1]);
    if (previous && level > previous + 1) {
      warn(
        path,
        `heading level jumps from h${previous} to h${level} ("${heading.textContent.trim().slice(0, 40)}")`,
      );
    }
    previous = level;
  }

  const robotsMeta = meta('meta[name="robots"]');
  rows.push({ path, robots: robotsMeta || "(default)" });

  const group = groupOf(path);
  if (axeAll || !axeGroups.has(group)) {
    axeGroups.add(group);
    dom.window.eval(axe.source);
    const result = await dom.window.axe.run(doc, {
      rules: { "color-contrast": { enabled: false } },
    });
    for (const violation of result.violations) {
      fail(
        path,
        `axe ${violation.id} (${violation.impact}): ${violation.help} [${violation.nodes.length}]`,
      );
    }
  }
}

for (const [title, paths] of titles)
  if (paths.length > 1) fail(paths.join(", "), `duplicate title "${title}"`);
for (const [text, paths] of descriptions) {
  if (paths.length > 1) fail(paths.join(", "), `duplicate description "${text.slice(0, 50)}..."`);
}

const robotsValues = new Set(rows.map((row) => row.robots));
const robotsText = robots.bytes.toString();
const blocksAll = /Disallow:\s*\/\s*$/m.test(robotsText);
if (blocksAll && ![...robotsValues].every((value) => value.includes("noindex"))) {
  fail("/robots.txt", "blocks all crawlers but some pages lack noindex");
}
if (!blocksAll && !/Sitemap:/i.test(robotsText))
  fail("/robots.txt", "allows crawling but lists no sitemap");

const missing = await get("/this-page-does-not-exist-xyz");
if (missing.status !== 404)
  fail("/this-page-does-not-exist-xyz", `expected 404, got ${missing.status}`);

const home = await get("/");
const requiredHeaders = [
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
];
for (const header of requiredHeaders)
  if (!home.headers.get(header)) fail("/", `missing ${header} header`);
if (
  !home.headers.get("content-security-policy") &&
  !home.headers.get("content-security-policy-report-only")
) {
  warn("/", "no Content-Security-Policy header (expected in production builds)");
}

const perf = [];
for (const [path, dom] of pages) {
  if (!sitemapPaths.includes(path)) continue;
  const doc = dom.window.document;
  const html = gzSize((await get(path)).bytes);
  const rawAsset = async (selector, attribute) => {
    let total = 0;
    const seen = new Set();
    for (const element of doc.querySelectorAll(selector)) {
      const href = element.getAttribute(attribute);
      if (!href || seen.has(href)) continue;
      seen.add(href);
      const response = await get(new URL(href, base).pathname);
      if (response.status === 200) total += gzSize(response.bytes);
    }
    return total;
  };
  const css = await rawAsset('link[rel="stylesheet"]', "href");
  const js = await rawAsset("script[src]:not([nomodule])", "src");
  const font = await rawAsset('link[rel="preload"][as="font"]', "href");
  perf.push({ path, html, css, js, font, total: html + css + js + font });
}

const pad = (value, width) => String(value).padEnd(width);
console.log(
  `\nAudit of ${base}: ${sitemapPaths.length} sitemap URLs, ${reached.size} pages crawled\n`,
);
console.log("Initial transfer per page (gzip, kB) - HTML, CSS, JS, font, total");
const sorted = [...perf].sort((a, b) => b.total - a.total);
for (const row of sorted.slice(0, 6)) {
  console.log(
    `  ${pad(row.path, 52)} ${pad(kb(row.html), 6)} ${pad(kb(row.css), 6)} ${pad(kb(row.js), 7)} ${pad(kb(row.font), 6)} ${kb(row.total)}`,
  );
}
const median =
  [...perf].map((row) => row.total).sort((a, b) => a - b)[Math.floor(perf.length / 2)] ?? 0;
console.log(
  `  median page: ${kb(median)} kB, heaviest: ${sorted[0]?.path} (${kb(sorted[0]?.total ?? 0)} kB)`,
);
for (const row of perf)
  if (row.js > 150 * 1024) warn(row.path, `initial JS is ${kb(row.js)} kB gzip`);

console.log(`\nRobots meta values seen: ${[...robotsValues].join(" | ")}`);
console.log(`\nWarnings (${warnings.length})`);
for (const line of warnings) console.log(`  - ${line}`);
console.log(`\nFailures (${failures.length})`);
for (const line of failures) console.log(`  x ${line}`);
process.exit(failures.length > 0 ? 1 : 0);
