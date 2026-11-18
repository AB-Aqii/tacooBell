import { brands } from "@/data/brands";
import { newsArticles } from "@/data/news";
import { staticRoutes } from "@/data/routes";
import { absoluteUrl } from "@/lib/seo";

export type SitemapEntry = {
  url: string;
  lastModified?: string;
};

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const newestNews = newsArticles
    .map((article) => article.updatedAt ?? article.publishedAt)
    .sort()
    .at(-1);

  const pages: SitemapEntry[] = staticRoutes.map((path) => ({
    url: absoluteUrl(path),
    ...(path === "/news" && newestNews ? { lastModified: newestNews } : {}),
  }));

  const brandPages: SitemapEntry[] = brands.map((brand) => ({
    url: absoluteUrl(`/brands/${brand.slug}`),
  }));

  const articlePages: SitemapEntry[] = newsArticles.map((article) => ({
    url: absoluteUrl(`/news/${article.slug}`),
    lastModified: article.updatedAt ?? article.publishedAt,
  }));

  return [...pages, ...brandPages, ...articlePages];
}
