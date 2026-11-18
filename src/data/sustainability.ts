import type { Pillar } from "@/types/company";
import type { DocumentGroup, RelatedLink } from "@/types/corporate";
import type { KeyFigure } from "@/types/company";

export const sustainabilityPage = {
  intro:
    "How the group approaches environmental responsibility, community development and employee welfare. Only verified initiatives and results are published here.",
  indicatorsNote:
    "Indicators appear with their reporting period and source once they are verified.",
};

export const focusAreas: Pillar[] = [
  {
    title: "Environmental responsibility",
    body: "Verified environmental initiatives and results will be listed here.",
    pending: true,
  },
  {
    title: "Community development",
    body: "Verified community programs and results will be listed here.",
    pending: true,
  },
  {
    title: "Food quality and sourcing",
    body: "Verified information on food quality and sourcing will be listed here.",
    pending: true,
  },
  {
    title: "Employee welfare",
    body: "Verified employee welfare programs will be listed here.",
    pending: true,
  },
  {
    title: "Charitable initiatives",
    body: "Verified charitable initiatives will be listed here.",
    pending: true,
  },
];

export const impactIndicators: KeyFigure[] = [
  { label: "Energy use", value: null },
  { label: "Waste reduction", value: null },
  { label: "Community investment", value: null },
];

export const reportGroups: DocumentGroup[] = [
  { id: "sustainability-reports", title: "Sustainability reports", documents: [] },
];

export const sustainabilityRelated: RelatedLink[] = [
  {
    title: "About the group",
    description: "Read about the mission, values and business model.",
    href: "/about#mission",
  },
  {
    title: "Company news",
    description: "Follow community initiatives and corporate updates.",
    href: "/news",
  },
  {
    title: "Careers",
    description: "Learn about working at the group and its brands.",
    href: "/careers",
  },
];
