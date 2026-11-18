import { newsArticles } from "@/data/news";
import { getNewsBySlug } from "@/lib/news";
import { renderOgImage } from "@/lib/og-image";

export const alt = "News article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const dynamicParams = false;

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

type ImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsOpenGraphImage({ params }: ImageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  return renderOgImage({
    title: article?.title ?? "News and media",
    subtitle: article?.category,
  });
}
