import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { brands } from "@/data/brands";
import { newsArticles } from "@/data/news";
import { redirects } from "@/data/redirects";
import { staticRoutes } from "@/data/routes";
import { siteConfig } from "@/data/site";
import { getAlternateLanguages, localizedPath } from "@/lib/i18n";
import { getRobotsRules } from "@/lib/robots";
import { getSitemapEntries } from "@/lib/sitemap";

test("sitemap lists every route, brand and article exactly once with absolute URLs", async () => {
  const entries = await getSitemapEntries();
  const urls = entries.map((entry) => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(urls.length, staticRoutes.length + brands.length + newsArticles.length);
  for (const url of urls) {
    assert.ok(url.startsWith(siteConfig.url), url);
    assert.equal(/[?#]|\/api\//.test(url), false, url);
  }
  for (const brand of brands) assert.ok(urls.includes(`${siteConfig.url}/brands/${brand.slug}`));
  for (const article of newsArticles) {
    assert.ok(urls.includes(`${siteConfig.url}/news/${article.slug}`));
  }
});

test("sitemap dates come from the data and never from the clock", async () => {
  const entries = await getSitemapEntries();
  for (const article of newsArticles) {
    const entry = entries.find((e) => e.url.endsWith(`/news/${article.slug}`));
    assert.equal(entry?.lastModified, article.updatedAt ?? article.publishedAt);
  }
  const news = entries.find((e) => e.url === `${siteConfig.url}/news`);
  assert.equal(news?.lastModified, "2026-11-10");
  assert.equal(entries.find((e) => e.url.endsWith("/about"))?.lastModified, undefined);
  assert.equal(
    entries.find((e) => e.url.endsWith("/brands/harbor-grill"))?.lastModified,
    undefined,
  );
});

test("every static route has a page file", () => {
  for (const route of staticRoutes) {
    const file = route === "/" ? "src/app/page.tsx" : `src/app${route}/page.tsx`;
    assert.ok(existsSync(join(process.cwd(), file)), file);
  }
});

test("robots blocks everything until indexing is allowed, then blocks only the API", () => {
  assert.deepEqual(getRobotsRules(false, "https://x.test/sitemap.xml"), {
    rules: [{ userAgent: "*", disallow: "/" }],
  });
  const live = getRobotsRules(true, "https://x.test/sitemap.xml");
  assert.equal(live.sitemap, "https://x.test/sitemap.xml");
  assert.deepEqual(live.rules[0]?.disallow, ["/api/"]);
  assert.equal(live.rules[0]?.allow, "/");
});

test("default configuration does not allow indexing", () => {
  assert.equal(siteConfig.allowIndexing, process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true");
});

test("hreflang is not generated for a single language", () => {
  assert.equal(getAlternateLanguages("/about", ["en"], "en"), undefined);
});

test("hreflang maps each locale and x-default when several exist", () => {
  assert.deepEqual(getAlternateLanguages("/about", ["en", "fr"], "en"), {
    en: "/about",
    fr: "/fr/about",
    "x-default": "/about",
  });
  assert.equal(localizedPath("fr", "/", "en"), "/fr");
  assert.equal(localizedPath("en", "/", "en"), "/");
});

test("redirect rules are well formed and cannot loop", () => {
  const sources = new Set(redirects.map((r) => r.source));
  assert.equal(sources.size, redirects.length);
  for (const rule of redirects) {
    assert.ok(rule.source.startsWith("/") && rule.destination.startsWith("/"));
    assert.notEqual(rule.source, rule.destination);
    assert.equal(sources.has(rule.destination), false, `${rule.source} chains to another redirect`);
  }
});

test("every page gets an Open Graph image and a matching Twitter image", async () => {
  const { buildMetadata } = await import("@/lib/seo");
  const fallback = buildMetadata({ title: "T", description: "D", path: "/x" });
  const og = fallback.openGraph?.images as { url: string }[];
  const tw = fallback.twitter?.images as { url: string }[];
  assert.equal(og[0]?.url, "/opengraph-image");
  assert.equal(tw[0]?.url, "/opengraph-image");
  assert.equal(
    fallback.twitter && "card" in fallback.twitter ? fallback.twitter.card : "",
    "summary_large_image",
  );

  const custom = buildMetadata({
    title: "T",
    description: "D",
    path: "/brands/x",
    image: { url: "/brands/x/opengraph-image", alt: "a", width: 1200, height: 630 },
  });
  assert.equal(
    (custom.openGraph?.images as { url: string }[])[0]?.url,
    "/brands/x/opengraph-image",
  );
});

test("article metadata carries publication details", async () => {
  const { buildMetadata } = await import("@/lib/seo");
  const meta = buildMetadata({
    title: "T",
    description: "D",
    path: "/news/x",
    type: "article",
    publishedTime: "2026-01-02",
    modifiedTime: "2026-02-03",
    authors: ["Editorial team"],
  });
  const og = meta.openGraph as {
    type: string;
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
  };
  assert.equal(og.type, "article");
  assert.equal(og.publishedTime, "2026-01-02");
  assert.equal(og.modifiedTime, "2026-02-03");
  assert.deepEqual(og.authors, ["Editorial team"]);
});
