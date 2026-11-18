export type SearchDocType = "page" | "brand" | "news" | "faq" | "leadership" | "investor";

export type SearchDocument = {
  id: string;
  type: SearchDocType;
  title: string;
  description: string;
  url: string;
  keywords: string[];
};

export type SearchResult = SearchDocument & { score: number };

export const searchTypeLabels: Record<SearchDocType, string> = {
  page: "Page",
  brand: "Brand",
  news: "News",
  faq: "FAQ",
  leadership: "Leadership",
  investor: "Investor resource",
};

export type SearchProvider = {
  search(query: string, limit: number): Promise<SearchResult[]>;
};
