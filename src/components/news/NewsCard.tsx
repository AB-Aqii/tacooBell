import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { NewsSummary } from "@/types/news";

type NewsCardProps = {
  article: NewsSummary;
};

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="flex h-full flex-col border-t-2 border-primary pt-5">
      <p className="text-small text-muted">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      </p>
      <h3 className="mt-2 text-heading-3 text-primary">
        <Link href={`/news/${article.slug}`} className="underline-offset-4 hover:underline">
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-body text-foreground">{article.excerpt}</p>
      <p className="mt-4 text-small text-muted">
        {article.category}, {article.readingMinutes} min read
      </p>
    </article>
  );
}
