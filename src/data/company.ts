import type { NavLink } from "@/types/navigation";
import type { ExplorePanel, KeyFigure, Pillar } from "@/types/company";

export const hero = {
  headline: "One group behind many restaurant and food brands",
  intro:
    "Global Food Group is a multi-brand restaurant and food business. Explore the brands it owns and operates, read company news, find careers and open investor information.",
  primaryCta: { label: "Explore our brands", href: "/brands" } satisfies NavLink,
  secondaryCta: { label: "About the company", href: "/about" } satisfies NavLink,
};

export const introduction = {
  title: "What the group is and does",
  paragraphs: [
    "Global Food Group is a multi-brand restaurant and food business. It is the parent company of independent brands, each with its own identity, menu and customers.",
    "This website is the central place for information about the group and its brands. Start with the brand directory, read the latest company news, or learn how the group is organized.",
  ],
  links: [
    { label: "Read about the company", href: "/about" },
    { label: "Meet the leadership", href: "/leadership" },
  ] satisfies NavLink[],
};

export const presence = {
  intro:
    "Each brand page lists the countries and regions where that brand operates. A group-level overview appears here once the details are verified.",
  note: "Figures appear with their reporting period and source. Until then, each one shows as to be confirmed.",
};

export const keyFigures: KeyFigure[] = [
  { label: "Brands in the portfolio", value: null },
  { label: "Countries and regions", value: null },
  { label: "Restaurant locations", value: null },
  { label: "Team members", value: null },
];

export const pillars: Pillar[] = [
  {
    title: "Mission",
    body: "The company's mission statement will appear here once it is confirmed.",
    pending: true,
  },
  {
    title: "Vision",
    body: "The company's vision statement will appear here once it is confirmed.",
    pending: true,
  },
  {
    title: "Business model",
    body: "The group is the parent company of independent brands. Each brand keeps its own identity and customers. The About page will explain how the group is organized.",
  },
];

export const explorePanels: ExplorePanel[] = [
  {
    title: "Sustainability and community",
    body: "Learn how the group approaches environmental responsibility, community development and employee welfare. Only verified initiatives and results are published.",
    link: { label: "Read about sustainability", href: "/sustainability" },
  },
  {
    title: "Careers",
    body: "Find out about working at the group and follow official links to apply for open positions.",
    link: { label: "See careers at the group", href: "/careers" },
  },
  {
    title: "Investors",
    body: "Find financial information, reports and shareholder resources. Every figure shows its reporting period, currency and source.",
    link: { label: "Open investor information", href: "/investors" },
  },
];
