import type { FooterGroup, NavItem, NavLink } from "@/types/navigation";

export const primaryNav: NavItem[] = [
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "Company overview", href: "/about", description: "Who we are and what we do" },
      { label: "Our history", href: "/about#history", description: "Milestones and timeline" },
      { label: "Mission and values", href: "/about#mission", description: "What guides the group" },
      {
        label: "Business model",
        href: "/about#business-model",
        description: "How the group operates",
      },
    ],
  },
  {
    label: "Our Brands",
    href: "/brands",
    children: [
      { label: "Brand directory", href: "/brands", description: "Search and filter every brand" },
      {
        label: "Brand news",
        href: "/news#brand-announcements",
        description: "Announcements from our brands",
      },
    ],
  },
  { label: "Leadership", href: "/leadership" },
  {
    label: "Investors",
    href: "/investors",
    children: [
      {
        label: "Investor overview",
        href: "/investors",
        description: "Financial overview and resources",
      },
      {
        label: "Reports and presentations",
        href: "/investors#reports",
        description: "Annual and quarterly reports",
      },
      {
        label: "Shareholder information",
        href: "/investors#shareholders",
        description: "Information for shareholders",
      },
    ],
  },
  { label: "News & Media", href: "/news" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Careers", href: "/careers" },
];

export const headerCta: NavLink = { label: "Contact us", href: "/contact" };

export const footerGroups: FooterGroup[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Leadership", href: "/leadership" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Frequently asked questions", href: "/faq" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Our Brands", href: "/brands" },
      { label: "News & Media", href: "/news" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Stakeholders",
    links: [
      { label: "Investors", href: "/investors" },
      { label: "Media inquiries", href: "/contact" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];
