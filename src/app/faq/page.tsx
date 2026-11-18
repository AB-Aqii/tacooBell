import { FaqDirectory } from "@/components/faq/FaqDirectory";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getFaqs } from "@/lib/faqs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Global Food Group, its brands, news, investor information, careers and how to get in touch.",
  path: "/faq",
});

export default async function FaqPage() {
  const items = await getFaqs();

  return (
    <>
      <PageHeader
        path="/faq"
        title="Frequently asked questions"
        intro="Search common questions about the company, its brands, news, investor information and careers. Where the answer has not been published yet, the page says so and points you to the right place."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <section aria-label="Questions" className="py-10 lg:py-14">
        <Container>
          <FaqDirectory items={items} />
        </Container>
      </section>
    </>
  );
}
