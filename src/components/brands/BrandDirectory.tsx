"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SampleNotice } from "@/components/ui/SampleNotice";
import {
  ALL,
  defaultFilters,
  filterBrands,
  getFilterOptions,
  hasActiveFilters,
  type BrandFilters,
  type SortOrder,
} from "@/lib/brand-filters";
import type { BrandSummary } from "@/types/brand";
import { BrandCard } from "./BrandCard";

const PAGE_SIZE = 12;

const fieldClass =
  "min-h-11 w-full rounded-md border border-border bg-surface px-3 text-body text-foreground";

type BrandDirectoryProps = {
  brands: BrandSummary[];
};

export function BrandDirectory({ brands }: BrandDirectoryProps) {
  const baseId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const focusIndex = useRef<number | null>(null);
  const [filters, setFilters] = useState<BrandFilters>(defaultFilters);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const options = useMemo(() => getFilterOptions(brands), [brands]);
  const results = useMemo(() => filterBrands(brands, filters), [brands, filters]);
  const shown = results.slice(0, visible);
  const remaining = results.length - shown.length;
  const filtersActive = hasActiveFilters(filters);

  const update = (patch: Partial<BrandFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setVisible(PAGE_SIZE);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setVisible(PAGE_SIZE);
  };

  const showMore = () => {
    focusIndex.current = shown.length;
    setVisible((current) => current + PAGE_SIZE);
  };

  useEffect(() => {
    if (focusIndex.current === null) return;
    listRef.current?.children[focusIndex.current]?.querySelector("a")?.focus();
    focusIndex.current = null;
  }, [visible]);

  if (brands.length === 0) {
    return (
      <p className="rounded-md border border-border bg-surface p-6 text-body text-muted">
        No brands have been added yet. Check back soon.
      </p>
    );
  }

  const status =
    results.length === 0
      ? "No brands found."
      : `Showing ${shown.length} of ${results.length} ${results.length === 1 ? "brand" : "brands"}.`;

  return (
    <div>
      <form
        role="search"
        aria-label="Search and filter brands"
        onSubmit={(event) => event.preventDefault()}
        className="flex flex-col gap-4 lg:flex-row"
      >
        <div className="lg:flex-[2]">
          <label htmlFor={`${baseId}-search`} className="mb-1 block text-small font-semibold">
            Search brands
          </label>
          <input
            id={`${baseId}-search`}
            type="search"
            autoComplete="off"
            value={filters.query}
            onChange={(event) => update({ query: event.target.value })}
            className={fieldClass}
          />
        </div>
        <div className="lg:flex-1">
          <label htmlFor={`${baseId}-category`} className="mb-1 block text-small font-semibold">
            Category
          </label>
          <select
            id={`${baseId}-category`}
            value={filters.category}
            onChange={(event) => update({ category: event.target.value })}
            className={fieldClass}
          >
            <option value={ALL}>All categories</option>
            {options.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {options.regions.length > 0 && (
          <div className="lg:flex-1">
            <label htmlFor={`${baseId}-region`} className="mb-1 block text-small font-semibold">
              Country or region
            </label>
            <select
              id={`${baseId}-region`}
              value={filters.region}
              onChange={(event) => update({ region: event.target.value })}
              className={fieldClass}
            >
              <option value={ALL}>All regions</option>
              {options.regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="lg:flex-1">
          <label htmlFor={`${baseId}-sort`} className="mb-1 block text-small font-semibold">
            Sort by
          </label>
          <select
            id={`${baseId}-sort`}
            value={filters.sort}
            onChange={(event) => update({ sort: event.target.value as SortOrder })}
            className={fieldClass}
          >
            <option value="name-asc">Name, A to Z</option>
            <option value="name-desc">Name, Z to A</option>
          </select>
        </div>
      </form>

      <div className="mt-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-small text-muted">
          {status}
        </p>
        {filtersActive && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="mt-4 rounded-md border border-border bg-surface p-8">
          <h2 className="text-heading-3 text-primary">No brands match your search</h2>
          <p className="mt-2 max-w-prose text-body text-muted">
            Check the spelling, try fewer words, or remove a filter to see more brands.
          </p>
          <Button variant="secondary" onClick={clearFilters} className="mt-5">
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <h2 className="sr-only">Brand list</h2>
          <ul ref={listRef} className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((brand) => (
              <li key={brand.slug}>
                <BrandCard brand={brand} />
              </li>
            ))}
          </ul>
          {remaining > 0 && (
            <div className="mt-8">
              <Button variant="secondary" onClick={showMore}>
                Show {Math.min(PAGE_SIZE, remaining)} more brands
              </Button>
            </div>
          )}
        </>
      )}

      <SampleNotice show={brands.some((brand) => brand.isSample)} className="mt-8" />
    </div>
  );
}
