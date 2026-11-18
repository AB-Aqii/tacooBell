import { ALL } from "@/lib/brand-filters";
import { normalizeText, tokenize } from "@/lib/text";
import { newsCategories, type NewsCategory, type NewsSummary } from "@/types/news";

export type NewsFilters = {
  query: string;
  category: string;
  year: string;
};

export const defaultNewsFilters: NewsFilters = { query: "", category: ALL, year: ALL };

export function categorySlug(category: string): string {
  return normalizeText(category).replace(/[^a-z0-9]+/g, "-");
}

export function categoryFromSlug(slug: string): NewsCategory | undefined {
  return newsCategories.find((category) => categorySlug(category) === slug);
}

export function getYears(articles: NewsSummary[]): string[] {
  return [...new Set(articles.map((article) => article.publishedAt.slice(0, 4)))].sort((a, b) =>
    b.localeCompare(a),
  );
}

export function hasActiveNewsFilters(filters: NewsFilters): boolean {
  return filters.query.trim() !== "" || filters.category !== ALL || filters.year !== ALL;
}

export function filterNews(articles: NewsSummary[], filters: NewsFilters): NewsSummary[] {
  const terms = tokenize(filters.query);

  return articles
    .filter((article) => {
      if (filters.category !== ALL && article.category !== filters.category) return false;
      if (filters.year !== ALL && !article.publishedAt.startsWith(filters.year)) return false;
      if (terms.length === 0) return true;
      const haystack = normalizeText(
        [article.title, article.excerpt, article.category, article.author].join(" "),
      );
      return terms.every((term) => haystack.includes(term));
    })
    .sort(
      (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title, "en"),
    );
}
