import { RelatedLinks } from "@/components/corporate/RelatedLinks";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { PillarGrid } from "@/components/ui/PillarGrid";
import { careersPage, careersRelated, positions, workingHere } from "@/data/careers";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Careers",
  description:
    "Learn about working at Global Food Group and its brands, and find official links to open positions.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <PageHeader
        path="/careers"
        title="Careers"
        intro={careersPage.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
      />
      <Section id="working-here" title="Working at the group">
        <PillarGrid items={workingHere} className="md:grid-cols-3" />
      </Section>
      <Section id="positions" tone="background" title="Available positions">
        {positions.length > 0 ? (
          <ul className="max-w-3xl border-t border-border">
            {positions.map((job) => (
              <li
                key={job.url}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-4"
              >
                <div>
                  <p className="font-semibold text-foreground">{job.title}</p>
                  <p className="text-small text-muted">
                    {[job.brand, job.location].filter(Boolean).join(", ")}
                  </p>
                </div>
                <a
                  href={job.url}
                  data-track-event="career_link_click"
                  data-track-label={job.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                >
                  Apply on the official site
                  <span className="sr-only">: {job.title} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="max-w-3xl rounded-md border border-dashed border-border bg-surface p-8">
            <p className="text-body text-foreground">{careersPage.emptyPositions}</p>
            {careersPage.applicationUrl ? (
              <ButtonLink
                href={careersPage.applicationUrl}
                data-track-event="career_link_click"
                data-track-label="official-listings"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5"
              >
                View official job listings
                <span className="sr-only">(opens in a new tab)</span>
              </ButtonLink>
            ) : (
              <p className="mt-2 text-body text-muted">{careersPage.noApplicationLink}</p>
            )}
          </div>
        )}
      </Section>
      <RelatedLinks links={careersRelated} tone="surface" />
    </>
  );
}
