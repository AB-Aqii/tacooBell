import { siteConfig } from "@/data/site";
import type { ContactDetail, Department, RelatedLink } from "@/types/corporate";

export const contactPage = {
  intro: `Send a message to ${siteConfig.name}. Choose the department that fits your question.`,
};

export const departments: Department[] = [
  {
    value: "general",
    label: "General questions",
    description: "Questions about the company or this website.",
  },
  {
    value: "media",
    label: "Media inquiries",
    description: "Press and media requests.",
  },
  {
    value: "investor",
    label: "Investor inquiries",
    description: "Questions about reports and shareholder information.",
  },
  {
    value: "partnership",
    label: "Partnership inquiries",
    description: "Business partnership proposals.",
  },
];

export const corporateDetails: ContactDetail[] = [
  { label: "Office address", value: null },
  { label: "Corporate phone", value: null },
];

export const contactRelated: RelatedLink[] = [
  {
    title: "Frequently asked questions",
    description: "Find quick answers about the company, its brands and careers.",
    href: "/#faq",
  },
  {
    title: "Investor information",
    description: "Reports and shareholder resources.",
    href: "/investors",
  },
  {
    title: "Careers",
    description: "Official job openings and application links.",
    href: "/careers",
  },
];
