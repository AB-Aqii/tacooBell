import type { NavLink } from "./navigation";
import type { DepartmentValue } from "@/lib/contact-schema";

export type TimelineEntry = {
  period: string;
  title: string;
  description: string;
  isPlaceholder: boolean;
};

export type Leader = {
  slug: string;
  name: string;
  title: string;
  responsibilities: string;
  biography: string;
  photo?: { src: string; alt: string; width: number; height: number };
  profileLinks?: NavLink[];
};

export type FinancialFigure = {
  label: string;
  value: string | null;
  period?: string;
  currency?: string;
  units?: string;
  source?: string;
};

export type InvestorDocument = {
  title: string;
  period: string;
  publishedAt?: string;
  url?: string;
};

export type DocumentGroup = {
  id: string;
  title: string;
  description?: string;
  documents: InvestorDocument[];
};

export type JobPosting = {
  title: string;
  location: string;
  url: string;
  brand?: string;
};

export type Department = {
  value: DepartmentValue;
  label: string;
  description: string;
};

export type ContactDetail = {
  label: string;
  value: string | null;
};

export type RelatedLink = {
  title: string;
  description: string;
  href: string;
};
