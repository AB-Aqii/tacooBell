import { brands } from "@/data/brands";
import { siteConfig } from "@/data/site";
import type { Brand, BrandSummary } from "@/types/brand";

function toSummary(brand: Brand): BrandSummary {
  return {
    slug: brand.slug,
    name: brand.name,
    shortDescription: brand.shortDescription,
    category: brand.category,
    region: brand.region,
    website: brand.website,
    logo: brand.logo,
    featured: brand.featured,
    isSample: brand.isSample,
  };
}

const byName = (a: Brand, b: Brand) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });

export async function getBrands(): Promise<BrandSummary[]> {
  return brands.map(toSummary);
}

export async function getFeaturedBrands(): Promise<BrandSummary[]> {
  return brands.filter((brand) => brand.featured).map(toSummary);
}

export async function getBrandBySlug(slug: string): Promise<Brand | undefined> {
  return brands.find((brand) => brand.slug === slug);
}

export async function getRelatedBrands(brand: Brand, count: number): Promise<BrandSummary[]> {
  const others = brands.filter((candidate) => candidate.slug !== brand.slug);
  const sameCategory = others.filter((candidate) => candidate.category === brand.category);
  const rest = others.filter((candidate) => candidate.category !== brand.category).sort(byName);
  return [...sameCategory, ...rest].slice(0, count).map(toSummary);
}

export function getBrandSeo(brand: Brand) {
  return {
    title: brand.seo?.title ?? `${brand.name} \u2013 Brand Overview and Products`,
    description:
      brand.seo?.description ??
      `${brand.shortDescription} Read the ${brand.name} overview, products and services, and latest news from ${siteConfig.name}.`,
  };
}
