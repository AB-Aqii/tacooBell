import { LeaderCard } from "@/components/corporate/LeaderCard";
import { RelatedLinks } from "@/components/corporate/RelatedLinks";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { leaders, leadershipPage, leadershipRelated } from "@/data/leadership";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { personSchema } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Leadership Team",
  description:
    "The leadership team of Global Food Group: executive roles, responsibilities and short biographies.",
  path: "/leadership",
});

export default function LeadershipPage() {
  return (
    <>
      {leaders.length > 0 && <JsonLd data={leaders.map(personSchema)} />}
      <PageHeader
        path="/leadership"
        title="Leadership"
        intro={leadershipPage.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Leadership" }]}
      />
      <Section id="team" title="Executive team">
        {leaders.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader) => (
              <li key={leader.slug}>
                <LeaderCard leader={leader} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="max-w-3xl rounded-md border border-dashed border-border bg-background p-8">
            <h3 className="text-heading-3 text-primary">{leadershipPage.emptyTitle}</h3>
            <p className="mt-2 text-body text-muted">{leadershipPage.emptyBody}</p>
          </div>
        )}
      </Section>
      <RelatedLinks links={leadershipRelated} />
    </>
  );
}
