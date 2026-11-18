import { BrandsLink } from "@/components/corporate/BrandsLink";
import { Timeline } from "@/components/corporate/Timeline";
import { TextBlock } from "@/components/brands/TextBlock";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { PillarGrid } from "@/components/ui/PillarGrid";
import { aboutPage, foundations, moreAboutGroup, timeline } from "@/data/about";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema } from "@/lib/structured-data";

const description =
  "Learn who Global Food Group is, how the group is organized and where to find its history, mission, business model and brands.";

export const metadata = buildMetadata({ title: "About Us", description, path: "/about" });

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: "AboutPage",
          name: aboutPage.title,
          description,
          path: "/about",
        })}
      />
      <PageHeader
        path="/about"
        title={aboutPage.title}
        intro={aboutPage.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />
      <Section id="overview" title="Company overview">
        <div className="max-w-3xl space-y-4">
          {aboutPage.overview.map((paragraph) => (
            <p key={paragraph} className="text-body-lg text-foreground">
              {paragraph}
            </p>
          ))}
          <BrandsLink />
        </div>
      </Section>
      <Section
        id="history"
        tone="background"
        title="History and milestones"
        intro="The company timeline appears here in date order once the facts are verified."
      >
        <Timeline entries={timeline} />
      </Section>
      <Section id="mission" title="Mission, vision and values">
        <PillarGrid items={foundations} className="md:grid-cols-3" />
      </Section>
      <Section id="business-model" tone="background" title="Business model and operations">
        <div className="grid gap-8 md:grid-cols-2">
          <TextBlock
            title="Business model"
            text={aboutPage.businessModel}
            fallback="The business model will be described here once it is confirmed."
          />
          <TextBlock
            title="Business operations"
            text={null}
            fallback={aboutPage.businessOperations}
          />
        </div>
      </Section>
      <Section id="more" title="More about the group">
        <PillarGrid items={moreAboutGroup} className="md:grid-cols-3" />
      </Section>
    </>
  );
}
