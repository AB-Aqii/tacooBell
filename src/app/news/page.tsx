import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { NewsDirectory } from "@/components/news/NewsDirectory";
import { getNewsSummaries } from "@/lib/news";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Latest Company News and Announcements",
  description:
    "Read the latest corporate updates, brand announcements, press releases and community news from Global Food Group.",
  path: "/news",
  absoluteTitle: false,
});

export default async function NewsPage() {
  const articles = await getNewsSummaries();

  return (
    <>
      <PageHeader
        path="/news"
        title="News and media"
        intro="Corporate updates, brand announcements, business developments, community initiatives and press releases from the group."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News & Media" }]}
      />
      <section aria-label="News directory" className="py-10 lg:py-14">
        <Container>
          <NewsDirectory articles={articles} />
        </Container>
      </section>
    </>
  );
}
