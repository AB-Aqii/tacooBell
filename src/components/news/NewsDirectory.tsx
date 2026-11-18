"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { SampleNotice } from "@/components/ui/SampleNotice";
import { ALL } from "@/lib/brand-filters";
import {
  categoryFromSlug,
  defaultNewsFilters,
  filterNews,
  getYears,
  hasActiveNewsFilters,
  type NewsFilters,
} from "@/lib/news-filters";
import { paginate } from "@/lib/pagination";
import { newsCategories, type NewsSummary } from "@/types/news";
import { FeaturedNews } from "./FeaturedNews";
import { NewsCard } from "./NewsCard";

const PAGE_SIZE = 6;

const fieldClass =
  "min-h-11 w-full rounded-md border border-border bg-surface px-3 text-body text-foreground";

type NewsDirectoryProps = {
  articles: NewsSummary[];
};

export function NewsDirectory({ articles }: NewsDirectoryProps) {
  const baseId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusResults = useRef(false);
  const [filters, setFilters] = useState<NewsFilters>(defaultNewsFilters);
  const [page, setPage] = useState(1);

  const years = useMemo(() => getYears(articles), [articles]);
  const featured = useMemo(() => articles.find((article) => article.featured), [articles]);
  const filtersActive = hasActiveNewsFilters(filters);
  const results = useMemo(() => filterNews(articles, filters), [articles, filters]);
  const separateFeatured = Boolean(featured) && !filtersActive;
  const list = useMemo(
    () =>
      separateFeatured ? results.filter((article) => article.slug !== featured?.slug) : results,
    [results, separateFeatured, featured],
  );
  const paged = paginate(list, page, PAGE_SIZE);

  const update = (patch: Partial<NewsFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(defaultNewsFilters);
    setPage(1);
  };

  const changePage = (next: number) => {
    focusResults.current = true;
    setPage(next);
  };

  useEffect(() => {
    const applyHash = () => {
      const category = categoryFromSlug(window.location.hash.slice(1));
      if (!category) return;
      setFilters({ ...defaultNewsFilters, category });
      setPage(1);
      headingRef.current?.scrollIntoView?.();
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    if (!focusResults.current) return;
    focusResults.current = false;
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView?.();
  }, [paged.page]);

  const onlyCategoryChosen =
    filters.category !== ALL && filters.query.trim() === "" && filters.year === ALL;
  const status =
    paged.total === 0
      ? "No articles found."
      : `Showing ${paged.from} to ${paged.to} of ${paged.total} ${paged.total === 1 ? "article" : "articles"}.`;
  const heading = separateFeatured ? "More news" : filtersActive ? "Search results" : "Latest news";

  return (
    <div>
      <form
        role="search"
        aria-label="Search and filter news"
        onSubmit={(event) => event.preventDefault()}
        className="flex flex-col gap-4 lg:flex-row"
      >
        <div className="lg:flex-[2]">
          <label htmlFor={`${baseId}-search`} className="mb-1 block text-small font-semibold">
            Search articles
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
            {newsCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="lg:flex-1">
          <label htmlFor={`${baseId}-year`} className="mb-1 block text-small font-semibold">
            Publication year
          </label>
          <select
            id={`${baseId}-year`}
            value={filters.year}
            onChange={(event) => update({ year: event.target.value })}
            className={fieldClass}
          >
            <option value={ALL}>Any year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
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

      {separateFeatured && featured && paged.page === 1 && (
        <section aria-labelledby={`${baseId}-featured`} className="mt-4">
          <h2 id={`${baseId}-featured`} className="sr-only">
            Featured article
          </h2>
          <FeaturedNews article={featured} />
        </section>
      )}

      <h2
        id="news-results"
        ref={headingRef}
        tabIndex={-1}
        className="mt-10 text-heading-2 text-primary outline-none"
      >
        {heading}
      </h2>

      {paged.total === 0 ? (
        <div className="mt-4 rounded-md border border-border bg-surface p-8">
          <h3 className="text-heading-3 text-primary">
            {onlyCategoryChosen
              ? `There are no articles in ${filters.category} yet`
              : "No articles match your search"}
          </h3>
          <p className="mt-2 max-w-prose text-body text-muted">
            {onlyCategoryChosen
              ? "Articles will appear here when they are published. You can look at another category."
              : "Check the spelling, try fewer words, or remove a filter to see more articles."}
          </p>
          <Button variant="secondary" onClick={clearFilters} className="mt-5">
            Clear filters
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paged.items.map((article) => (
            <li key={article.slug}>
              <NewsCard article={article} />
            </li>
          ))}
        </ul>
      )}

      <Pagination page={paged.page} pageCount={paged.pageCount} onChange={changePage} />

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ButtonLink href="/contact" variant="ghost">
          Media inquiries
        </ButtonLink>
        <SampleNotice show={articles.some((article) => article.isSample)} />
      </div>
    </div>
  );
}
