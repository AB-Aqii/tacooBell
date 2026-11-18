"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ALL } from "@/lib/brand-filters";
import {
  defaultFaqFilters,
  filterFaqs,
  hasActiveFaqFilters,
  type FaqFilters,
} from "@/lib/faq-filters";
import { faqCategories, type Faq } from "@/types/faq";
import { FaqList } from "./FaqList";

type FaqDirectoryProps = {
  items: Faq[];
};

export function FaqDirectory({ items }: FaqDirectoryProps) {
  const baseId = useId();
  const [filters, setFilters] = useState<FaqFilters>(defaultFaqFilters);
  const [targetId, setTargetId] = useState<string | null>(null);

  const results = useMemo(() => filterFaqs(items, filters), [items, filters]);
  const filtersActive = hasActiveFaqFilters(filters);

  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.slice(1);
      if (!id.startsWith("faq-")) return;
      setFilters((current) =>
        filterFaqs(items, current).some((item) => `faq-${item.id}` === id)
          ? current
          : defaultFaqFilters,
      );
      setTargetId(id);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [items]);

  useEffect(() => {
    if (!targetId) return;
    const element = document.getElementById(targetId);
    if (element?.tagName !== "DETAILS") return;
    element.setAttribute("open", "");
    element.scrollIntoView?.();
    element.querySelector("summary")?.focus();
    setTargetId(null);
  }, [targetId, results]);

  const status =
    results.length === 0
      ? "No questions found."
      : `Showing ${results.length} of ${items.length} questions.`;

  return (
    <div>
      <form
        role="search"
        aria-label="Search frequently asked questions"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor={`${baseId}-search`} className="mb-1 block text-small font-semibold">
          Search questions
        </label>
        <input
          id={`${baseId}-search`}
          type="search"
          autoComplete="off"
          value={filters.query}
          onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
          className="min-h-11 w-full max-w-xl rounded-md border border-border bg-surface px-3 text-body text-foreground"
        />
      </form>

      <div role="group" aria-label="Filter by category" className="mt-5 flex flex-wrap gap-2">
        {[ALL, ...faqCategories].map((category) => {
          const active = filters.category === category;
          return (
            <Button
              key={category}
              variant={active ? "primary" : "secondary"}
              aria-pressed={active}
              onClick={() => setFilters((current) => ({ ...current, category }))}
            >
              {category === ALL ? "All" : category}
            </Button>
          );
        })}
      </div>

      <div className="mt-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-small text-muted">
          {status}
        </p>
        {filtersActive && (
          <Button variant="ghost" onClick={() => setFilters(defaultFaqFilters)}>
            Clear filters
          </Button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="mt-4 max-w-3xl rounded-md border border-border bg-surface p-8">
          <h2 className="text-heading-3 text-primary">No questions match your search</h2>
          <p className="mt-2 text-body text-muted">
            Check the spelling, try fewer words, or choose another category. You can also send us
            your question.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6">
            <Button variant="secondary" onClick={() => setFilters(defaultFaqFilters)}>
              Clear filters
            </Button>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
            >
              Contact us
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h2 className="sr-only">Questions and answers</h2>
          <FaqList items={results} showRelated relatedPool={items} className="mt-4 max-w-3xl" />
        </>
      )}
    </div>
  );
}
