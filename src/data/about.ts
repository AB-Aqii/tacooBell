import { siteConfig } from "@/data/site";
import type { Pillar } from "@/types/company";
import type { TimelineEntry } from "@/types/corporate";

export const aboutPage = {
  title: `About ${siteConfig.name}`,
  intro:
    "Who the group is, how it is organized and where to find more about its brands, history and responsibilities.",
  overview: [
    `${siteConfig.name} is a multi-brand restaurant and food business. It is the parent company of independent brands that the group owns, manages or operates.`,
    "Company facts are added to this site only after they are verified, so some sections show placeholders for now.",
  ],
  businessModel:
    "The group is the parent company of independent brands. Each brand keeps its own identity, menu and customers. The group is where company-level information is published, including news, investor resources and careers.",
  businessOperations:
    "How the group owns, manages or operates each brand will be described here once the details are confirmed.",
};

export const timeline: TimelineEntry[] = [
  {
    period: "Year to be confirmed",
    title: "Founding story",
    description: "How and when the group began will be added once it is confirmed.",
    isPlaceholder: true,
  },
  {
    period: "Year to be confirmed",
    title: "Early milestones",
    description: "Key milestones in the group's growth will be added once they are verified.",
    isPlaceholder: true,
  },
  {
    period: "Year to be confirmed",
    title: "Recent developments",
    description: "Recent company milestones will be added once they are verified.",
    isPlaceholder: true,
  },
];

export const foundations: Pillar[] = [
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
    title: "Corporate values",
    body: "The company's values will appear here once they are confirmed.",
    pending: true,
  },
];

export const moreAboutGroup: Pillar[] = [
  {
    title: "Leadership",
    body: "Meet the executives who lead the group. Profiles are added once they are confirmed.",
    link: { label: "Meet the leadership", href: "/leadership" },
  },
  {
    title: "Global presence",
    body: "Each brand page lists where that brand operates. A group-level overview will appear once it is verified.",
    link: { label: "See all brands", href: "/brands" },
  },
  {
    title: "Social responsibility",
    body: "Read about environmental responsibility, community development and employee welfare. Only verified initiatives are published.",
    link: { label: "Read about sustainability", href: "/sustainability" },
  },
];
