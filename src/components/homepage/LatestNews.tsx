import { Section } from "@/components/layout/Section";
import { NewsCard } from "@/components/news/NewsCard";
import { ButtonLink } from "@/components/ui/Button";
import { SampleNotice } from "@/components/ui/SampleNotice";
import { getLatestNews } from "@/lib/news";

export async function LatestNews() {
  const articles = await getLatestNews(3);

  return (
    <Section
      id="news"
      title="Latest company news"
      intro="Corporate updates, brand announcements and press releases."
    >
      <ul className="grid gap-8 md:grid-cols-3">
        {articles.map((article) => (
          <li key={article.slug}>
            <NewsCard article={article} />
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ButtonLink href="/news" variant="secondary">
          Read all news
        </ButtonLink>
        <SampleNotice show={articles.some((article) => article.isSample)} />
      </div>
    </Section>
  );
}
