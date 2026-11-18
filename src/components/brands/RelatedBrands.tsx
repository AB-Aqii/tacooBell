import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import type { BrandSummary } from "@/types/brand";
import { BrandCard } from "./BrandCard";

type RelatedBrandsProps = {
  brands: BrandSummary[];
};

export function RelatedBrands({ brands }: RelatedBrandsProps) {
  if (brands.length === 0) return null;

  return (
    <Section id="related-brands" size="compact" title="Related brands">
      <ul className="grid gap-6 md:grid-cols-3">
        {brands.map((brand) => (
          <li key={brand.slug}>
            <BrandCard brand={brand} />
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <ButtonLink href="/brands" variant="secondary">
          View all brands
        </ButtonLink>
      </div>
    </Section>
  );
}
