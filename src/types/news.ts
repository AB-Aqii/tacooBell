export const newsCategories = [
  "Corporate updates",
  "Brand announcements",
  "Business developments",
  "Community initiatives",
  "Press releases",
  "Media coverage",
] as const;

export type NewsCategory = (typeof newsCategories)[number];

export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  featured: boolean;
  image?: { src: string; alt: string; width: number; height: number };
  brandSlug?: string;
  sections: ArticleSection[];
  isSample: boolean;
};

export type NewsSummary = Omit<NewsArticle, "sections"> & {
  readingMinutes: number;
};
