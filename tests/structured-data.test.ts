import assert from "node:assert/strict";
import { test } from "node:test";
import { brands } from "@/data/brands";
import { newsArticles } from "@/data/news";
import { siteConfig } from "@/data/site";
import { getBrandSeo } from "@/lib/brands";
import {
  breadcrumbSchema,
  brandPageSchema,
  newsArticleSchema,
  organizationSchema,
  personSchema,
  toJsonLd,
  webPageSchema,
  websiteSchema,
} from "@/lib/structured-data";

function visit(value: unknown, path: string, fn: (value: unknown, path: string) => void) {
  fn(value, path);
  if (Array.isArray(value)) value.forEach((item, i) => visit(item, `${path}[${i}]`, fn));
  else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) visit(child, `${path}.${key}`, fn);
  }
}

const urlKeys = new Set(["url", "item", "@id", "image", "logo", "sameAs"]);

function assertClean(node: unknown) {
  visit(node, "$", (value, path) => {
    assert.notEqual(value, undefined, `${path} is undefined`);
    assert.notEqual(value, null, `${path} is null`);
    if (typeof value === "string") assert.notEqual(value.trim(), "", `${path} is empty`);
    const key =
      path
        .split(".")
        .pop()
        ?.replace(/\[\d+\]$/, "") ?? "";
    if (urlKeys.has(key) && typeof value === "string") {
      assert.match(value, /^https?:\/\//, `${path} is not an absolute URL`);
    }
  });
}

test("organization and website nodes only carry verified facts", () => {
  const org = organizationSchema();
  assert.equal(org["@type"], "Organization");
  assert.equal(org.name, siteConfig.name);
  for (const forbidden of [
    "address",
    "founder",
    "foundingDate",
    "telephone",
    "aggregateRating",
    "logo",
  ]) {
    assert.equal(forbidden in org, false, forbidden);
  }
  assertClean(org);
  assertClean(websiteSchema());
});

test("breadcrumbs are numbered, absolute, and end on the current page", () => {
  const schema = breadcrumbSchema(
    [
      { label: "Home", href: "/" },
      { label: "Our Brands", href: "/brands" },
      { label: "Harbor Grill" },
    ],
    "/brands/harbor-grill",
  ) as { itemListElement: { position: number; name: string; item?: string }[] };
  assert.deepEqual(
    schema.itemListElement.map((i) => i.position),
    [1, 2, 3],
  );
  assert.equal(schema.itemListElement[2]?.item, `${siteConfig.url}/brands/harbor-grill`);
  assertClean(schema);
  const noPath = breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Here" }]) as {
    itemListElement: { item?: string }[];
  };
  assert.equal("item" in (noPath.itemListElement[1] ?? {}), false);
});

test("news articles produce NewsArticle markup from visible fields", () => {
  for (const article of newsArticles) {
    const schema = newsArticleSchema(article);
    assert.equal(schema["@type"], "NewsArticle");
    assert.equal(schema.headline, article.title);
    assert.equal(schema.datePublished, article.publishedAt);
    assert.equal("dateModified" in schema, Boolean(article.updatedAt));
    assert.equal(schema.url, `${siteConfig.url}/news/${article.slug}`);
    assert.equal("image" in schema, Boolean(article.image));
    assertClean(schema);
  }
});

test("brand pages describe the page and the brand without invented properties", () => {
  for (const brand of brands) {
    const seo = getBrandSeo(brand);
    const schema = brandPageSchema(brand, seo.title, seo.description) as {
      about: Record<string, unknown>;
    };
    assert.equal(schema.about["@type"], "Brand");
    assert.equal(schema.about.name, brand.name);
    for (const forbidden of ["aggregateRating", "review", "address", "founder"]) {
      assert.equal(forbidden in schema.about, false);
    }
    assert.equal("url" in schema.about, Boolean(brand.website));
    assertClean(schema);
  }
});

test("person markup includes profile links only when they exist", () => {
  const person = personSchema({
    slug: "a",
    name: "Ada Example",
    title: "Chief Example Officer",
    responsibilities: "x",
    biography: "Short biography.",
    profileLinks: [{ label: "Profile", href: "https://example.com/ada" }],
  });
  assert.deepEqual(person.sameAs, ["https://example.com/ada"]);
  assert.equal("image" in person, false);
  assertClean(person);
  assert.equal(
    "sameAs" in
      personSchema({ slug: "b", name: "B", title: "T", responsibilities: "x", biography: "y" }),
    false,
  );
});

test("page types are passed through", () => {
  assert.equal(
    webPageSchema({ type: "ContactPage", name: "n", description: "d", path: "/contact" })["@type"],
    "ContactPage",
  );
  assert.equal(webPageSchema({ name: "n", description: "d", path: "/x" })["@type"], "WebPage");
});

test("serialized JSON-LD parses and cannot break out of a script tag", () => {
  const hostile = webPageSchema({
    name: "</script><script>alert(1)</script>",
    description: "line\u2028break",
    path: "/x",
  });
  const text = toJsonLd(hostile);
  assert.equal(text.includes("</script>"), false);
  assert.equal(text.includes("<"), false);
  const parsed = JSON.parse(text);
  assert.equal(parsed["@context"], "https://schema.org");
  assert.equal(parsed.name, "</script><script>alert(1)</script>");
  const graph = JSON.parse(toJsonLd([organizationSchema(), websiteSchema()]));
  assert.equal(graph["@graph"].length, 2);
});
