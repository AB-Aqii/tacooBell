import { FaqList } from "@/components/faq/FaqList";
import { Section } from "@/components/layout/Section";
import type { Brand } from "@/types/brand";
import type { Faq } from "@/types/faq";

type BrandFaqProps = {
  brand: Brand;
  items: Faq[];
};

export function BrandFaq({ brand, items }: BrandFaqProps) {
  return (
    <Section
      id="faq"
      tone="background"
      size="compact"
      title={`${brand.name} frequently asked questions`}
    >
      <FaqList items={items} className="max-w-3xl" />
    </Section>
  );
}
