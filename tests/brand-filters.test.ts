import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ALL,
  defaultFilters,
  filterBrands,
  getFilterOptions,
  hasActiveFilters,
} from "@/lib/brand-filters";
import type { BrandSummary } from "@/types/brand";

const make = (name: string, category: string, region?: string): BrandSummary => ({
  slug: name.toLowerCase().replace(/\W+/g, "-"),
  name,
  shortDescription: `${name} description`,
  category,
  region,
  featured: false,
  isSample: true,
});

const brands = [
  make("Zeta Café", "Bakery", "Europe"),
  make("Alpha Grill", "Casual dining", "Asia"),
  make("Mid Pizza", "Pizza", "Europe"),
];

test("sorts A to Z by default and Z to A on request", () => {
  assert.deepEqual(
    filterBrands(brands, defaultFilters).map((b) => b.name),
    ["Alpha Grill", "Mid Pizza", "Zeta Café"],
  );
  assert.deepEqual(
    filterBrands(brands, { ...defaultFilters, sort: "name-desc" }).map((b) => b.name),
    ["Zeta Café", "Mid Pizza", "Alpha Grill"],
  );
});

test("search ignores case and accents", () => {
  const result = filterBrands(brands, { ...defaultFilters, query: "  CAFE " });
  assert.deepEqual(
    result.map((b) => b.name),
    ["Zeta Café"],
  );
});

test("search requires every term to match", () => {
  assert.equal(filterBrands(brands, { ...defaultFilters, query: "alpha pizza" }).length, 0);
  assert.equal(filterBrands(brands, { ...defaultFilters, query: "alpha grill" }).length, 1);
});

test("category and region filters combine", () => {
  assert.deepEqual(
    filterBrands(brands, { ...defaultFilters, region: "Europe" }).map((b) => b.name),
    ["Mid Pizza", "Zeta Café"],
  );
  assert.deepEqual(
    filterBrands(brands, { ...defaultFilters, region: "Europe", category: "Pizza" }).map(
      (b) => b.name,
    ),
    ["Mid Pizza"],
  );
  assert.equal(
    filterBrands(brands, { ...defaultFilters, category: "Pizza", region: "Asia" }).length,
    0,
  );
});

test("returns an empty list when nothing matches", () => {
  assert.deepEqual(filterBrands(brands, { ...defaultFilters, query: "zzz" }), []);
});

test("does not mutate the input list", () => {
  const before = brands.map((b) => b.name);
  filterBrands(brands, { ...defaultFilters, sort: "name-desc" });
  assert.deepEqual(
    brands.map((b) => b.name),
    before,
  );
});

test("builds unique sorted filter options and skips missing regions", () => {
  const options = getFilterOptions([...brands, make("No Region", "Pizza")]);
  assert.deepEqual(options.categories, ["Bakery", "Casual dining", "Pizza"]);
  assert.deepEqual(options.regions, ["Asia", "Europe"]);
});

test("detects active filters", () => {
  assert.equal(hasActiveFilters(defaultFilters), false);
  assert.equal(hasActiveFilters({ ...defaultFilters, query: " " }), false);
  assert.equal(hasActiveFilters({ ...defaultFilters, query: "a" }), true);
  assert.equal(hasActiveFilters({ ...defaultFilters, category: "Pizza" }), true);
  assert.equal(hasActiveFilters({ ...defaultFilters, region: ALL, sort: "name-desc" }), false);
});
