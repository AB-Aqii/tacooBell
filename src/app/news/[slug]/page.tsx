import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { NewsCard } from "@/components/news/NewsCard";
import { ShareLinks } from "@/components/news/ShareLinks";
import { TableOfContents } from "@/components/news/TableOfContents";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SampleNotice } from "@/components/ui/SampleNotice";
import { formatDate } from "@/lib/format";
import { getBrandBySlug } from "@/lib/brands";
import { getNewsBySlug, getReadingMinutes, getRelatedNews } from "@/lib/news";
import { categorySlug } from "@/lib/news-filters";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { newsArticles } from "@/data/news";
import { breadcrumbSchema, newsArticleSchema } from "@/lib/structured-data";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author],
    image: article.image
      ? {
          url: article.image.src,
          alt: article.image.alt,
          width: article.image.width,
          height: article.image.height,
        }
      : {
          url: `/news/${article.slug}/opengraph-image`,
          alt: article.title,
          width: 1200,
          height: 630,
        },
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const [related, brand] = await Promise.all([
    getRelatedNews(article, 3),
    article.brandSlug ? getBrandBySlug(article.brandSlug) : Promise.resolve(undefined),
  ]);
  const minutes = getReadingMinutes(article);
  const url = absoluteUrl(`/news/${article.slug}`);
  const showContents = article.sections.length >= 3;
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "News & Media", href: "/news" },
    { label: article.title },
  ];

  return (
    <>
      <div className="border-b border-border bg-surface">
        <Container className="py-10 lg:py-14">
          <JsonLd
            data={[newsArticleSchema(article), breadcrumbSchema(crumbs, `/news/${article.slug}`)]}
          />
          <Breadcrumbs items={crumbs} />
          <p className="mt-6">
            <Link
              href={`/news#${categorySlug(article.category)}`}
              className="inline-flex min-h-8 items-center text-small font-semibold text-primary underline underline-offset-4"
            >
              {article.category}
            </Link>
          </p>
          <h1 className="mt-2 max-w-3xl text-heading-1 text-primary">{article.title}</h1>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-small text-muted">
            <li>
              Published{" "}
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </li>
            {article.updatedAt && (
              <li>
                Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
              </li>
            )}
            <li>By {article.author}</li>
            <li>{minutes} min read</li>
          </ul>
          <SampleNotice show={article.isSample} className="mt-3" />
        </Container>
      </div>

      <section aria-label="Article" className="bg-surface py-12 lg:py-16">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="max-w-prose">
            {article.image && (
              <Image
                src={article.image.src}
                alt={article.image.alt}
                width={article.image.width}
                height={article.image.height}
                priority
                className="mb-8 h-auto w-full rounded-md"
              />
            )}
            <p className="text-body-lg text-foreground">{article.excerpt}</p>
            {article.sections.map((section) => (
              <section key={section.id} className="mt-10">
                <h2 id={section.id} className="text-heading-2 text-primary">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-body-lg text-foreground">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
            <div className="mt-12">
              <ShareLinks url={url} title={article.title} />
            </div>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            {showContents && <TableOfContents sections={article.sections} />}
            {brand && (
              <section
                aria-labelledby="related-brand-heading"
                className="border-t-2 border-primary pt-4"
              >
                <h2 id="related-brand-heading" className="text-small font-semibold text-primary">
                  Related brand
                </h2>
                <p className="mt-2 text-body text-foreground">{brand.shortDescription}</p>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                >
                  Learn about {brand.name}
                </Link>
              </section>
            )}
          </aside>
        </Container>
      </section>

      {related.length > 0 && (
        <Section id="related-stories" tone="background" size="compact" title="Related stories">
          <ul className="grid gap-8 md:grid-cols-3">
            {related.map((story) => (
              <li key={story.slug}>
                <NewsCard article={story} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
