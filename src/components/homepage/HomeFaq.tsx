import { FaqList } from "@/components/faq/FaqList";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { getFaqs } from "@/lib/faqs";

export async function HomeFaq() {
  const items = await getFaqs({ homepageOnly: true });

  return (
    <Section
      id="faq"
      title="Frequently asked questions"
      intro="Quick answers about the company, its brands, news, careers and investor information."
    >
      <FaqList items={items} className="max-w-3xl" />
      <div className="mt-8">
        <ButtonLink href="/faq" variant="secondary">
          See all questions
        </ButtonLink>
      </div>
    </Section>
  );
}
