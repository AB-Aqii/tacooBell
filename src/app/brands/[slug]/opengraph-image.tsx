import { getBrandBySlug, getBrands } from "@/lib/brands";
import { renderOgImage } from "@/lib/og-image";

export const alt = "Brand overview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const dynamicParams = false;

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

type ImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BrandOpenGraphImage({ params }: ImageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  return renderOgImage({
    title: brand?.name ?? "Our brands",
    subtitle: brand?.category,
  });
}
