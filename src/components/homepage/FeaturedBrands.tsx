import { BrandCard } from "@/components/brands/BrandCard";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SampleNotice } from "@/components/ui/SampleNotice";
import { getFeaturedBrands } from "@/lib/brands";

export async function FeaturedBrands() {
  const brands = await getFeaturedBrands();

  return (
    <Section
      id="brands"
      tone="background"
      title="Our brands"
      intro="Each brand has its own page with an overview, products and services, and the regions where it operates."
    >
      <ul className="grid gap-6 md:grid-cols-3">
        {brands.map((brand) => (
          <li key={brand.slug}>
            <BrandCard brand={brand} />
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ButtonLink href="/brands" variant="secondary">
          View all brands
        </ButtonLink>
        <SampleNotice show={brands.some((brand) => brand.isSample)} />
      </div>
    </Section>
  );
}
