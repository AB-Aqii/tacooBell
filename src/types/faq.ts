import type { NavLink } from "./navigation";

export const faqCategories = [
  "Company",
  "Brands",
  "News",
  "Investors",
  "Careers",
  "Contact",
] as const;

export type FaqCategory = (typeof faqCategories)[number];

export type Faq = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  links?: NavLink[];
  relatedIds?: string[];
  homepage?: boolean;
};
