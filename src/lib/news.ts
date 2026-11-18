import { newsArticles } from "@/data/news";
import type { NewsArticle, NewsSummary } from "@/types/news";

const WORDS_PER_MINUTE = 200;

const newestFirst = (a: NewsArticle, b: NewsArticle) => b.publishedAt.localeCompare(a.publishedAt);

export function getReadingMinutes(article: NewsArticle): number {
  const text = [
    article.title,
    article.excerpt,
    ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function toNewsSummary(article: NewsArticle): NewsSummary {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    author: article.author,
    featured: article.featured,
    image: article.image,
    brandSlug: article.brandSlug,
    isSample: article.isSample,
    readingMinutes: getReadingMinutes(article),
  };
}

export async function getNewsSummaries(): Promise<NewsSummary[]> {
  return [...newsArticles].sort(newestFirst).map(toNewsSummary);
}

export async function getLatestNews(count: number): Promise<NewsSummary[]> {
  return [...newsArticles].sort(newestFirst).slice(0, count).map(toNewsSummary);
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | undefined> {
  return newsArticles.find((article) => article.slug === slug);
}

export async function getNewsByBrand(brandSlug: string, count: number): Promise<NewsSummary[]> {
  return newsArticles
    .filter((article) => article.brandSlug === brandSlug)
    .sort(newestFirst)
    .slice(0, count)
    .map(toNewsSummary);
}

export async function getRelatedNews(article: NewsArticle, count: number): Promise<NewsSummary[]> {
  const others = [...newsArticles].filter((candidate) => candidate.slug !== article.slug);
  const sameCategory = others.filter((candidate) => candidate.category === article.category);
  const rest = others.filter((candidate) => candidate.category !== article.category);
  return [...sameCategory.sort(newestFirst), ...rest.sort(newestFirst)]
    .slice(0, count)
    .map(toNewsSummary);
}
