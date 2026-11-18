import { ALL } from "@/lib/brand-filters";
import { normalizeText, tokenize } from "@/lib/text";
import type { Faq } from "@/types/faq";

export type FaqFilters = {
  query: string;
  category: string;
};

export const defaultFaqFilters: FaqFilters = { query: "", category: ALL };

export function hasActiveFaqFilters(filters: FaqFilters): boolean {
  return filters.query.trim() !== "" || filters.category !== ALL;
}

export function filterFaqs(items: Faq[], filters: FaqFilters): Faq[] {
  const terms = tokenize(filters.query);

  return items.filter((item) => {
    if (filters.category !== ALL && item.category !== filters.category) return false;
    if (terms.length === 0) return true;
    const haystack = normalizeText(`${item.question} ${item.answer} ${item.category}`);
    return terms.every((term) => haystack.includes(term));
  });
}
