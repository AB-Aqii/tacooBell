import Link from "next/link";
import { TextBlock } from "@/components/brands/TextBlock";
import { DocumentList } from "@/components/corporate/DocumentList";
import { FinancialTable } from "@/components/corporate/FinancialTable";
import { RelatedLinks } from "@/components/corporate/RelatedLinks";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import {
  announcementGroups,
  financialOverview,
  investorsPage,
  investorsRelated,
  reportGroups,
} from "@/data/investors";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Investor Relations",
  description:
    "Investor information for Global Food Group: financial overview, annual and quarterly reports, presentations, announcements and shareholder resources.",
  path: "/investors",
});

export default function InvestorsPage() {
  return (
    <>
      <PageHeader
        path="/investors"
        title="Investors"
        intro={investorsPage.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Investors" }]}
      />
      <Section id="overview" title="Financial overview" intro={investorsPage.overviewIntro}>
        <FinancialTable rows={financialOverview} />
        <div className="mt-10 max-w-3xl">
          <TextBlock
            title="Business performance"
            text={null}
            fallback={investorsPage.performance}
          />
        </div>
      </Section>
      <Section
        id="reports"
        tone="background"
        title="Reports and presentations"
        intro="Each document shows its reporting period and publication date."
      >
        <DocumentList groups={reportGroups} />
      </Section>
      <Section id="announcements" title="Financial announcements">
        <DocumentList groups={announcementGroups} />
      </Section>
      <Section id="shareholders" tone="background" title="Shareholder information">
        <div className="grid gap-8 md:grid-cols-2">
          <TextBlock
            title="Shares and shareholders"
            text={null}
            fallback={investorsPage.shareholders}
          />
          <div className="border-t-2 border-primary pt-4">
            <h3 className="text-heading-3 text-primary">Investor inquiries</h3>
            <p className="mt-3 text-body text-foreground">{investorsPage.inquiries}</p>
            <Link
              href="/contact"
              className="mt-3 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
            >
              Go to the contact form
            </Link>
          </div>
        </div>
      </Section>
      <RelatedLinks links={investorsRelated} tone="surface" />
    </>
  );
}
