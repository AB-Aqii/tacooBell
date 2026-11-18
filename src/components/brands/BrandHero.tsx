import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { SampleNotice } from "@/components/ui/SampleNotice";
import type { Brand } from "@/types/brand";
import { breadcrumbSchema } from "@/lib/structured-data";
import { BrandMark } from "./BrandMark";

type BrandHeroProps = {
  brand: Brand;
};

export function BrandHero({ brand }: BrandHeroProps) {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Our Brands", href: "/brands" },
    { label: brand.name },
  ];
  const descriptor = brand.region ? `${brand.category}, ${brand.region}` : brand.category;

  return (
    <section aria-labelledby="brand-heading" className="surface-dark bg-primary text-white">
      <Container className="py-10 lg:py-14">
        <JsonLd data={breadcrumbSchema(crumbs, `/brands/${brand.slug}`)} />
        <Breadcrumbs tone="dark" items={crumbs} />
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <BrandMark brand={brand} variant="hero" />
          <div>
            <h1 id="brand-heading" className="text-heading-1">
              {brand.name}
            </h1>
            <p className="mt-2 text-body-lg font-medium text-white/80">{descriptor}</p>
            <p className="mt-4 max-w-2xl text-body-lg text-white/85">{brand.shortDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {brand.website && (
                <ButtonLink
                  href={brand.website}
                  variant="accent"
                  data-track-event="brand_website_click"
                  data-track-label={brand.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit the {brand.name} website
                  <span className="sr-only">(opens in a new tab)</span>
                </ButtonLink>
              )}
              <ButtonLink href="/brands" variant="inverse">
                All brands
              </ButtonLink>
            </div>
            <SampleNotice show={brand.isSample} className="mt-4 text-white/70" />
          </div>
        </div>
      </Container>
    </section>
  );
}
