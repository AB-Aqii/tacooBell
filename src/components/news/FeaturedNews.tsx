import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { NewsSummary } from "@/types/news";

type FeaturedNewsProps = {
  article: NewsSummary;
};

export function FeaturedNews({ article }: FeaturedNewsProps) {
  return (
    <article className="grid gap-6 rounded-md border border-border bg-surface p-6 lg:grid-cols-[1fr_1.2fr] lg:p-10">
      {article.image && (
        <Image
          src={article.image.src}
          alt={article.image.alt}
          width={article.image.width}
          height={article.image.height}
          className="h-auto w-full rounded-md"
        />
      )}
      <div className={article.image ? undefined : "lg:col-span-2 lg:max-w-3xl"}>
        <p className="text-small font-semibold text-primary">Featured article</p>
        <h3 className="mt-3 text-heading-2 text-primary">
          <Link href={`/news/${article.slug}`} className="underline-offset-4 hover:underline">
            {article.title}
          </Link>
        </h3>
        <p className="mt-4 text-body-lg text-foreground">{article.excerpt}</p>
        <p className="mt-4 text-small text-muted">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>,{" "}
          {article.category}, {article.readingMinutes} min read
        </p>
        <Link
          href={`/news/${article.slug}`}
          className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
        >
          Read the article
          <span className="sr-only">: {article.title}</span>
        </Link>
      </div>
    </article>
  );
}
