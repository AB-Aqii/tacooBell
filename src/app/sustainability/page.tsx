import { DocumentList } from "@/components/corporate/DocumentList";
import { RelatedLinks } from "@/components/corporate/RelatedLinks";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { FigureList } from "@/components/ui/FigureList";
import { PillarGrid } from "@/components/ui/PillarGrid";
import {
  focusAreas,
  impactIndicators,
  reportGroups,
  sustainabilityPage,
  sustainabilityRelated,
} from "@/data/sustainability";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sustainability and Social Responsibility",
  description:
    "How Global Food Group approaches environmental responsibility, community development, food sourcing and employee welfare, with verified results only.",
  path: "/sustainability",
});

export default function SustainabilityPage() {
  return (
    <>
      <PageHeader
        path="/sustainability"
        title="Sustainability and social responsibility"
        intro={sustainabilityPage.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sustainability" }]}
      />
      <Section id="focus-areas" title="Focus areas">
        <PillarGrid items={focusAreas} className="md:grid-cols-2 lg:grid-cols-3" />
      </Section>
      <Section
        id="impact"
        tone="background"
        title="Measurable impact"
        intro={sustainabilityPage.indicatorsNote}
      >
        <FigureList figures={impactIndicators} className="lg:grid-cols-3" />
      </Section>
      <Section id="reports" title="Sustainability reports">
        <DocumentList groups={reportGroups} />
      </Section>
      <RelatedLinks links={sustainabilityRelated} />
    </>
  );
}
