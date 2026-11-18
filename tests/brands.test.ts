import assert from "node:assert/strict";
import { test } from "node:test";
import { brands } from "@/data/brands";
import { buildBrandFaqs } from "@/lib/brand-faqs";
import { getBrandBySlug, getBrandSeo, getBrands, getRelatedBrands } from "@/lib/brands";

test("every brand has a unique slug, title and description", () => {
  const slugs = new Set(brands.map((b) => b.slug));
  const titles = new Set(brands.map((b) => getBrandSeo(b).title));
  const descriptions = new Set(brands.map((b) => getBrandSeo(b).description));
  assert.equal(slugs.size, brands.length);
  assert.equal(titles.size, brands.length);
  assert.equal(descriptions.size, brands.length);
});

test("slugs are lowercase and URL safe", () => {
  for (const brand of brands) assert.match(brand.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test("unknown slug returns undefined", async () => {
  assert.equal(await getBrandBySlug("does-not-exist"), undefined);
});

test("summaries do not carry profile data", async () => {
  const [first] = await getBrands();
  assert.ok(first);
  assert.equal("profile" in first, false);
});

test("related brands exclude the brand itself and respect the count", async () => {
  const brand = brands[0];
  assert.ok(brand);
  const related = await getRelatedBrands(brand, 3);
  assert.equal(related.length, 3);
  assert.equal(
    related.some((r) => r.slug === brand.slug),
    false,
  );
});

test("brand FAQs never answer ownership or franchise questions", () => {
  for (const brand of brands) {
    const text = buildBrandFaqs(brand)
      .map((f) => `${f.question} ${f.answer}`)
      .join(" ")
      .toLowerCase();
    assert.equal(text.includes("franchise"), false);
    assert.equal(text.includes("who owns"), false);
  }
});

test("website FAQs adapt to a missing or present website", () => {
  const brand = brands[0];
  assert.ok(brand);
  const without = buildBrandFaqs(brand).find((f) => f.id === "official-website");
  assert.match(without?.answer ?? "", /not been added/);
  const withSite = buildBrandFaqs({ ...brand, website: "https://www.example.com/path" }).find(
    (f) => f.id === "official-website",
  );
  assert.match(withSite?.answer ?? "", /example\.com/);
});
