import assert from "node:assert/strict";
import { test } from "node:test";
import { getHighlightSegments } from "@/lib/search/highlight";
import { buildSearchIndex } from "@/lib/search/build-index";
import { searchDocuments } from "@/lib/search/search";

const top = async (query: string) => {
  const index = await buildSearchIndex();
  return searchDocuments(index, query, 5);
};

test("index ids are unique and urls are internal", async () => {
  const index = await buildSearchIndex();
  const ids = new Set(index.map((doc) => doc.id));
  assert.equal(ids.size, index.length);
  for (const doc of index) assert.match(doc.url, /^\//);
});

test("empty and whitespace queries return nothing", async () => {
  assert.deepEqual(await top(""), []);
  assert.deepEqual(await top("   "), []);
});

test("annual report finds investor pages before the FAQ", async () => {
  const results = await top("annual report");
  assert.ok(results[0]?.url.startsWith("/investors"));
  const investors = results.findIndex((r) => r.url === "/investors");
  const faq = results.findIndex((r) => r.url.startsWith("/faq"));
  assert.ok(investors !== -1 && (faq === -1 || investors < faq));
});

test("a brand name finds the brand page first", async () => {
  assert.equal((await top("harbor grill"))[0]?.url, "/brands/harbor-grill");
  assert.equal((await top("harb"))[0]?.url, "/brands/harbor-grill");
});

test("brand products and services are searchable", async () => {
  assert.equal((await top("seafood"))[0]?.url, "/brands/harbor-grill");
  assert.ok((await top("noodle bowls")).some((r) => r.url === "/brands/noodle-lane"));
});

test("search ignores accents and case", async () => {
  assert.ok((await top("CAFE")).some((r) => r.url === "/brands/crumb-and-kettle"));
});

test("every term must match", async () => {
  assert.deepEqual(await top("harbor zzzzz"), []);
});

test("questions about ownership reach the FAQ entry", async () => {
  const results = await top("who owns");
  assert.ok(results.some((r) => r.url === "/faq#faq-who-owns-the-group"));
});

test("news articles are searchable by title", async () => {
  assert.equal((await top("community partnership"))[0]?.url, "/news/sample-community-partnership");
});

test("careers query finds the careers page first", async () => {
  assert.equal((await top("careers"))[0]?.url, "/careers");
});

test("limit is respected", async () => {
  const index = await buildSearchIndex();
  assert.ok(searchDocuments(index, "a", 3).length <= 3);
});

test("highlight marks every matching term", () => {
  assert.deepEqual(getHighlightSegments("Annual report summary", ["annual", "summ"]), [
    { text: "Annual", match: true },
    { text: " report ", match: false },
    { text: "summ", match: true },
    { text: "ary", match: false },
  ]);
});

test("highlight ignores accents and keeps the original text", () => {
  const segments = getHighlightSegments("Bakery and café", ["cafe"]);
  assert.deepEqual(segments, [
    { text: "Bakery and ", match: false },
    { text: "café", match: true },
  ]);
  assert.equal(segments.map((s) => s.text).join(""), "Bakery and café");
});

test("highlight merges overlapping matches and handles no match", () => {
  assert.deepEqual(getHighlightSegments("grill", ["gri", "rill"]), [
    { text: "grill", match: true },
  ]);
  assert.deepEqual(getHighlightSegments("Harbor", ["xyz"]), [{ text: "Harbor", match: false }]);
  assert.deepEqual(getHighlightSegments("Harbor", []), [{ text: "Harbor", match: false }]);
});
