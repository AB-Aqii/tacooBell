import type { SearchDocument } from "@/lib/search/types";

type SearchablePage = Pick<SearchDocument, "title" | "description" | "url" | "keywords">;

export const searchablePages: SearchablePage[] = [
  {
    title: "About Us",
    description:
      "Company overview, history, mission, business model and how the group is organized.",
    url: "/about",
    keywords: ["company", "who we are", "what is global food group", "overview"],
  },
  {
    title: "Company history and milestones",
    description: "The company timeline, founding story and key milestones.",
    url: "/about#history",
    keywords: ["history", "founded", "established", "timeline", "founding story"],
  },
  {
    title: "Mission, vision and values",
    description: "The company's mission, vision and corporate values.",
    url: "/about#mission",
    keywords: ["mission", "vision", "values", "purpose"],
  },
  {
    title: "Business model",
    description: "How the group is organized and how it owns, manages or operates its brands.",
    url: "/about#business-model",
    keywords: ["business model", "operations", "parent company", "how it works"],
  },
  {
    title: "Our Brands",
    description: "Directory of every brand in the group. Search by name and filter by category.",
    url: "/brands",
    keywords: ["brands", "restaurants", "portfolio", "directory", "brand list"],
  },
  {
    title: "Leadership",
    description: "The executive team, with roles, responsibilities and short biographies.",
    url: "/leadership",
    keywords: ["executives", "management", "team", "ceo", "board", "leaders"],
  },
  {
    title: "Investors",
    description:
      "Financial overview, annual reports, quarterly reports, investor presentations, announcements and shareholder information.",
    url: "/investors",
    keywords: [
      "annual report",
      "quarterly report",
      "financial",
      "revenue",
      "shareholders",
      "investor relations",
      "presentations",
      "earnings",
    ],
  },
  {
    title: "Reports and presentations",
    description: "Annual reports, quarterly reports and investor presentations.",
    url: "/investors#reports",
    keywords: ["annual report", "quarterly report", "presentation", "documents"],
  },
  {
    title: "Shareholder information",
    description: "Share listing details and shareholder contacts.",
    url: "/investors#shareholders",
    keywords: ["shares", "stock", "shareholder", "ownership", "dividends"],
  },
  {
    title: "News and Media",
    description: "Corporate updates, brand announcements, press releases and community news.",
    url: "/news",
    keywords: ["news", "press", "announcements", "media", "latest"],
  },
  {
    title: "Sustainability and Social Responsibility",
    description:
      "Environmental responsibility, community development, food sourcing, employee welfare and charitable initiatives.",
    url: "/sustainability",
    keywords: ["environment", "community", "sourcing", "charity", "impact", "responsibility"],
  },
  {
    title: "Careers",
    description: "Working at the group, employee development, culture and official job openings.",
    url: "/careers",
    keywords: ["jobs", "apply", "vacancies", "positions", "work", "employment", "hiring"],
  },
  {
    title: "Contact Us",
    description:
      "Send a general, media, investor or partnership inquiry and find corporate contact details.",
    url: "/contact",
    keywords: ["contact", "email", "address", "media inquiries", "partnership", "get in touch"],
  },
  {
    title: "Frequently asked questions",
    description: "Answers about the company, its brands, news, investors and careers.",
    url: "/faq",
    keywords: ["faq", "questions", "help", "answers"],
  },
];

export const searchSuggestions = [
  "Brands",
  "Annual report",
  "Careers",
  "Contact",
  "Sustainability",
  "News",
];
