import type { Pillar } from "@/types/company";
import type { JobPosting, RelatedLink } from "@/types/corporate";

export const careersPage = {
  intro:
    "Information about working at the group and its brands, and where to find official job openings.",
  emptyPositions: "No open positions are listed on this site right now.",
  noApplicationLink:
    "The official job application link will be added once it is confirmed. Apply only through official links.",
  applicationUrl: undefined as string | undefined,
};

export const workingHere: Pillar[] = [
  {
    title: "Working at the group",
    body: "What it is like to work at the group and its brands will be described here once it is confirmed.",
    pending: true,
  },
  {
    title: "Employee development",
    body: "Training and development programs will be listed here once they are verified.",
    pending: true,
  },
  {
    title: "Company culture",
    body: "The company's culture and values will be described here once they are confirmed.",
    pending: true,
  },
];

export const positions: JobPosting[] = [];

export const careersRelated: RelatedLink[] = [
  {
    title: "Our brands",
    description: "Explore the brands you could work for.",
    href: "/brands",
  },
  {
    title: "About the group",
    description: "Read the mission, values and history.",
    href: "/about",
  },
  {
    title: "Contact the group",
    description: "Ask a general question about working here.",
    href: "/contact",
  },
];
