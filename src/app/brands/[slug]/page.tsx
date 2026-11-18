import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandAchievements } from "@/components/brands/BrandAchievements";
import { BrandFaq } from "@/components/brands/BrandFaq";
import { BrandHero } from "@/components/brands/BrandHero";
import { BrandNews } from "@/components/brands/BrandNews";
import { BrandOfferings } from "@/components/brands/BrandOfferings";
import { BrandOverview } from "@/components/brands/BrandOverview";
import { BrandPresence } from "@/components/brands/BrandPresence";
import { RelatedBrands } from "@/components/brands/RelatedBrands";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBrandFaqs } from "@/lib/brand-faqs";
import { getBrandBySlug, getBrandSeo, getBrands, getRelatedBrands } from "@/lib/brands";
import { getNewsByBrand } from "@/lib/news";
import { siteConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { brandPageSchema } from "@/lib/structured-data";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};

  const seo = getBrandSeo(brand);
  return buildMetadata({
    title: seo.title,
    description: seo.description,
    path: `/brands/${brand.slug}`,
    image: {
      url: `/brands/${brand.slug}/opengraph-image`,
      alt: `${brand.name}, a brand of ${siteConfig.name}`,
      width: 1200,
      height: 630,
    },
  });
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const [related, articles] = await Promise.all([
    getRelatedBrands(brand, 3),
    getNewsByBrand(brand.slug, 3),
  ]);

  const seo = getBrandSeo(brand);

  return (
    <>
      <JsonLd data={brandPageSchema(brand, seo.title, seo.description)} />
      <BrandHero brand={brand} />
      <BrandOverview brand={brand} />
      <BrandOfferings brand={brand} />
      <BrandPresence brand={brand} />
      <BrandAchievements brand={brand} />
      <BrandNews brand={brand} articles={articles} />
      <BrandFaq brand={brand} items={buildBrandFaqs(brand)} />
      <RelatedBrands brands={related} />
    </>
  );
}
