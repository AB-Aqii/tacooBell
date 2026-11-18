import { siteConfig } from "@/data/site";
import type { Leader, RelatedLink } from "@/types/corporate";

export const leadershipPage = {
  intro: `The executives who lead ${siteConfig.name}, with their roles, responsibilities and short biographies.`,
  emptyTitle: "Leadership profiles are not published yet",
  emptyBody:
    "Each profile will list an executive's role, responsibilities and a short biography once the details are confirmed.",
};

export const leaders: Leader[] = [];

export const leadershipRelated: RelatedLink[] = [
  {
    title: "Company history",
    description: "Read how the group began and the milestones it has reached.",
    href: "/about#history",
  },
  {
    title: "Our brands",
    description: "Browse the brands the leadership team oversees.",
    href: "/brands",
  },
  {
    title: "Contact the group",
    description: "Send a general, media, investor or partnership inquiry.",
    href: "/contact",
  },
];
