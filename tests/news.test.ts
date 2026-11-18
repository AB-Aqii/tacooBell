import assert from "node:assert/strict";
import { test } from "node:test";
import { newsArticles } from "@/data/news";
import { brands } from "@/data/brands";
import { getNewsByBrand, getReadingMinutes, getRelatedNews, getNewsSummaries } from "@/lib/news";
import {
  categoryFromSlug,
  categorySlug,
  defaultNewsFilters,
  filterNews,
  getYears,
  hasActiveNewsFilters,
} from "@/lib/news-filters";
import { getPageItems, paginate } from "@/lib/pagination";
import { getShareLinks } from "@/lib/share";
import { newsCategories } from "@/types/news";

test("articles have unique slugs, titles and valid references", () => {
  assert.equal(new Set(newsArticles.map((a) => a.slug)).size, newsArticles.length);
  assert.equal(new Set(newsArticles.map((a) => a.title)).size, newsArticles.length);
  for (const article of newsArticles) {
    assert.match(article.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(newsCategories.includes(article.category));
    assert.match(article.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    if (article.updatedAt) assert.ok(article.updatedAt >= article.publishedAt);
    if (article.brandSlug) assert.ok(brands.some((b) => b.slug === article.brandSlug));
    const ids = article.sections.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test("exactly one article is featured", () => {
  assert.equal(newsArticles.filter((a) => a.featured).length, 1);
});

test("reading time is at least one minute and grows with length", () => {
  const base = newsArticles[0];
  assert.ok(base);
  assert.ok(getReadingMinutes(base) >= 1);
  const long = {
    ...base,
    sections: [{ id: "x", heading: "Long", paragraphs: [Array(900).fill("word").join(" ")] }],
  };
  assert.equal(getReadingMinutes(long), 5);
});

test("summaries are newest first and carry reading time", async () => {
  const summaries = await getNewsSummaries();
  const dates = summaries.map((s) => s.publishedAt);
  assert.deepEqual(dates, [...dates].sort().reverse());
  assert.ok(summaries.every((s) => s.readingMinutes >= 1 && !("sections" in s)));
});

test("brand news and related news behave", async () => {
  const harbor = await getNewsByBrand("harbor-grill", 3);
  assert.ok(harbor.length >= 1 && harbor.every((a) => a.brandSlug === "harbor-grill"));
  const article = newsArticles.find((a) => a.category === "Brand announcements");
  assert.ok(article);
  const related = await getRelatedNews(article, 3);
  assert.equal(related.length, 3);
  assert.ok(related.every((r) => r.slug !== article.slug));
  assert.equal(related[0]?.category, article.category);
});

test("category slugs round trip and match the navigation hash", () => {
  assert.equal(categorySlug("Brand announcements"), "brand-announcements");
  for (const category of newsCategories) {
    assert.equal(categoryFromSlug(categorySlug(category)), category);
  }
  assert.equal(categoryFromSlug("nope"), undefined);
});

test("news filters combine search, category and year", async () => {
  const all = await getNewsSummaries();
  assert.equal(filterNews(all, defaultNewsFilters).length, all.length);
  assert.ok(
    filterNews(all, { ...defaultNewsFilters, year: "2025" }).every((a) =>
      a.publishedAt.startsWith("2025"),
    ),
  );
  const community = filterNews(all, { ...defaultNewsFilters, category: "Community initiatives" });
  assert.ok(
    community.length >= 2 && community.every((a) => a.category === "Community initiatives"),
  );
  assert.equal(filterNews(all, { ...defaultNewsFilters, category: "Media coverage" }).length, 0);
  assert.equal(
    filterNews(all, { ...defaultNewsFilters, query: "press release" })[0]?.slug,
    "sample-press-release",
  );
  assert.equal(filterNews(all, { ...defaultNewsFilters, query: "zzzz" }).length, 0);
  assert.deepEqual(getYears(all), ["2026", "2025"]);
  assert.equal(hasActiveNewsFilters(defaultNewsFilters), false);
  assert.equal(hasActiveNewsFilters({ ...defaultNewsFilters, year: "2026" }), true);
});

test("pagination slices and clamps pages", () => {
  const items = Array.from({ length: 14 }, (_, i) => i + 1);
  const first = paginate(items, 1, 6);
  assert.deepEqual([first.items.length, first.pageCount, first.from, first.to], [6, 3, 1, 6]);
  const last = paginate(items, 99, 6);
  assert.deepEqual([last.page, last.items.length, last.from, last.to], [3, 2, 13, 14]);
  assert.deepEqual(paginate([], 1, 6), {
    items: [],
    page: 1,
    pageCount: 1,
    total: 0,
    from: 0,
    to: 0,
  });
});

test("page items show every page when few and windows when many", () => {
  assert.deepEqual(getPageItems(2, 3), [1, 2, 3]);
  assert.deepEqual(getPageItems(1, 10), [1, 2, "ellipsis-end", 10]);
  assert.deepEqual(getPageItems(5, 10), [1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 10]);
  assert.deepEqual(getPageItems(10, 10), [1, "ellipsis-start", 9, 10]);
});

test("share links encode the url and title", () => {
  const links = getShareLinks("https://example.com/news/a?b=1", "Fish & Chips");
  assert.equal(links.length, 4);
  assert.ok(links.every((l) => !l.href.includes("Fish & Chips")));
  assert.ok(links[0]?.href.includes(encodeURIComponent("https://example.com/news/a?b=1")));
  assert.ok(links[3]?.href.startsWith("mailto:"));
});
