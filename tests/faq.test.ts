import assert from "node:assert/strict";
import { test } from "node:test";
import { faqs } from "@/data/faqs";
import { defaultFaqFilters, filterFaqs, hasActiveFaqFilters } from "@/lib/faq-filters";
import { faqCategories } from "@/types/faq";

test("FAQ ids are unique, categories valid and related ids exist", () => {
  const ids = new Set(faqs.map((f) => f.id));
  assert.equal(ids.size, faqs.length);
  for (const faq of faqs) {
    assert.ok(faqCategories.includes(faq.category));
    for (const related of faq.relatedIds ?? []) {
      assert.ok(ids.has(related), `${faq.id} -> ${related}`);
      assert.notEqual(related, faq.id);
    }
  }
});

test("answers about ownership, finance and franchise do not invent facts", () => {
  for (const id of [
    "who-owns-the-group",
    "how-the-group-makes-money",
    "franchise-opportunities",
    "when-established",
    "headquarters",
  ]) {
    const faq = faqs.find((f) => f.id === id);
    assert.ok(faq, id);
    assert.match(faq.answer, /not been published|will appear/);
    assert.equal(/\d/.test(faq.answer), false, `${id} contains a figure`);
  }
});

test("FAQ filters search question and answer text and filter by category", () => {
  assert.equal(filterFaqs(faqs, defaultFaqFilters).length, faqs.length);
  assert.ok(
    filterFaqs(faqs, { query: "owns", category: "all" }).some((f) => f.id === "who-owns-the-group"),
  );
  assert.ok(
    filterFaqs(faqs, { query: "", category: "Careers" }).every((f) => f.category === "Careers"),
  );
  assert.equal(filterFaqs(faqs, { query: "zzzz", category: "all" }).length, 0);
  assert.equal(hasActiveFaqFilters(defaultFaqFilters), false);
  assert.equal(hasActiveFaqFilters({ query: "a", category: "all" }), true);
});
