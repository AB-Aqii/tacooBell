import { BrandDirectory } from "@/components/brands/BrandDirectory";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getBrands } from "@/lib/brands";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our Brands",
  description:
    "Browse every brand in the Global Food Group portfolio. Search by name, filter by category and open each brand's overview, products and news.",
  path: "/brands",
});

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <>
      <PageHeader
        path="/brands"
        title="Our brands"
        intro="Global Food Group is the parent company of independent restaurant and food brands. Search the directory, filter by category, and open a brand to read its overview, products and latest news."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Our Brands" }]}
      />
      <section aria-label="Brand directory" className="py-10 lg:py-14">
        <Container>
          <BrandDirectory brands={brands} />
        </Container>
      </section>
    </>
  );
}
