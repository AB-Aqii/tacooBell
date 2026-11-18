import { siteConfig } from "@/data/site";
import type { DocumentGroup, FinancialFigure, RelatedLink } from "@/types/corporate";

export const investorsPage = {
  intro: `Financial information, reports and shareholder resources for ${siteConfig.name}. Every figure shows its reporting period, currency, units and source.`,
  overviewIntro:
    "Figures appear here once they are verified. None of the rows below are real results yet.",
  performance:
    "A summary of business performance will appear here once verified results are published.",
  shareholders:
    "Share listing details and shareholder contacts will be added once they are confirmed.",
  inquiries: "For investor questions, use the contact form and choose Investor inquiries.",
};

export const financialOverview: FinancialFigure[] = [
  { label: "Revenue", value: null },
  { label: "Operating profit", value: null },
  { label: "Net income", value: null },
];

export const reportGroups: DocumentGroup[] = [
  { id: "annual-reports", title: "Annual reports", documents: [] },
  { id: "quarterly-reports", title: "Quarterly reports", documents: [] },
  { id: "presentations", title: "Investor presentations", documents: [] },
];

export const announcementGroups: DocumentGroup[] = [
  { id: "financial-announcements", title: "Financial announcements", documents: [] },
];

export const investorsRelated: RelatedLink[] = [
  {
    title: "Company news",
    description: "Read corporate updates and press releases.",
    href: "/news",
  },
  {
    title: "About the group",
    description: "Understand the business model and how the group is organized.",
    href: "/about#business-model",
  },
  {
    title: "Contact investor relations",
    description: "Send an investor inquiry through the contact form.",
    href: "/contact",
  },
];
