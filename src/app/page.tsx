import { CompanyIntro } from "@/components/homepage/CompanyIntro";
import { ExploreGroup } from "@/components/homepage/ExploreGroup";
import { FeaturedBrands } from "@/components/homepage/FeaturedBrands";
import { GroupAtAGlance } from "@/components/homepage/GroupAtAGlance";
import { HomeFaq } from "@/components/homepage/HomeFaq";
import { Hero } from "@/components/homepage/Hero";
import { LatestNews } from "@/components/homepage/LatestNews";
import { MissionVision } from "@/components/homepage/MissionVision";
import { siteConfig } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: `${siteConfig.name} | Our Brands, Business and Company`,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Hero />
      <CompanyIntro />
      <FeaturedBrands />
      <GroupAtAGlance />
      <MissionVision />
      <LatestNews />
      <ExploreGroup />
      <HomeFaq />
    </>
  );
}
