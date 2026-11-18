import { Section } from "@/components/layout/Section";
import { NewsCard } from "@/components/news/NewsCard";
import { ButtonLink } from "@/components/ui/Button";
import type { Brand } from "@/types/brand";
import type { NewsSummary } from "@/types/news";

type BrandNewsProps = {
  brand: Brand;
  articles: NewsSummary[];
};

export function BrandNews({ brand, articles }: BrandNewsProps) {
  return (
    <Section id="news" size="compact" title={`Latest ${brand.name} news`}>
      {articles.length > 0 ? (
        <ul className="grid gap-8 md:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <NewsCard article={article} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-3xl text-body text-muted">
          There are no news articles for {brand.name} yet.
        </p>
      )}
      <div className="mt-8">
        <ButtonLink href="/news" variant="secondary">
          Read all company news
        </ButtonLink>
      </div>
    </Section>
  );
}
