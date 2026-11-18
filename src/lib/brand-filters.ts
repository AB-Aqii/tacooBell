import type { BrandSummary } from "@/types/brand";
import { normalizeText, tokenize } from "./text";

export const ALL = "all";

export type SortOrder = "name-asc" | "name-desc";

export type BrandFilters = {
  query: string;
  category: string;
  region: string;
  sort: SortOrder;
};

export const defaultFilters: BrandFilters = {
  query: "",
  category: ALL,
  region: ALL,
  sort: "name-asc",
};

export function filterBrands(brands: BrandSummary[], filters: BrandFilters): BrandSummary[] {
  const terms = tokenize(filters.query);
  const direction = filters.sort === "name-asc" ? 1 : -1;

  return brands
    .filter((brand) => {
      if (filters.category !== ALL && brand.category !== filters.category) return false;
      if (filters.region !== ALL && brand.region !== filters.region) return false;
      if (terms.length === 0) return true;
      const haystack = normalizeText(
        [brand.name, brand.shortDescription, brand.category, brand.region ?? ""].join(" "),
      );
      return terms.every((term) => haystack.includes(term));
    })
    .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }) * direction);
}

export function getFilterOptions(brands: BrandSummary[]) {
  const unique = (values: (string | undefined)[]) =>
    [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" }),
    );

  return {
    categories: unique(brands.map((brand) => brand.category)),
    regions: unique(brands.map((brand) => brand.region)),
  };
}

export function hasActiveFilters(filters: BrandFilters): boolean {
  return filters.query.trim() !== "" || filters.category !== ALL || filters.region !== ALL;
}
