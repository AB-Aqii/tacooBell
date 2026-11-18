import type { Faq } from "@/types/faq";

export const faqs: Faq[] = [
  {
    id: "what-is-the-group",
    category: "Company",
    question: "What is Global Food Group?",
    answer:
      "Global Food Group is a multi-brand restaurant and food business. It is the parent company of the brands listed on this website.",
    links: [{ label: "About the company", href: "/about" }],
    relatedIds: ["what-does-the-group-do", "who-owns-the-group"],
    homepage: true,
  },
  {
    id: "what-does-the-group-do",
    category: "Company",
    question: "What does Global Food Group do?",
    answer:
      "The group owns, manages or operates restaurant and food brands. Each brand has its own identity and customers, and this website presents the group and its brands in one place.",
    links: [{ label: "Our brands", href: "/brands" }],
    relatedIds: ["what-is-the-group", "business-model"],
    homepage: true,
  },
  {
    id: "find-all-brands",
    category: "Brands",
    question: "Where can I see all of the group's brands?",
    answer:
      "The Our Brands directory lists every brand in the group. Each brand has its own page with an overview, products and services, and the regions where it operates.",
    links: [{ label: "Brand directory", href: "/brands" }],
    relatedIds: ["countries-of-operation"],
    homepage: true,
  },
  {
    id: "find-company-news",
    category: "News",
    question: "Where can I find official company news?",
    answer:
      "The News & Media section carries corporate updates, brand announcements and press releases published by the group.",
    links: [{ label: "News & Media", href: "/news" }],
    homepage: true,
  },
  {
    id: "find-investor-information",
    category: "Investors",
    question: "Where can I find annual reports and investor information?",
    answer:
      "Reports, presentations and shareholder information are on the Investors page. Each financial figure shows its reporting period, currency and source.",
    links: [{ label: "Investor information", href: "/investors" }],
    relatedIds: ["how-the-group-makes-money", "who-owns-the-group"],
    homepage: true,
  },
  {
    id: "apply-for-a-job",
    category: "Careers",
    question: "How can I apply for a job?",
    answer:
      "Open positions and official application links are on the Careers page. Apply only through those official links.",
    links: [{ label: "Careers", href: "/careers" }],
    homepage: true,
  },
  {
    id: "contact-the-group",
    category: "Contact",
    question: "How can I contact the company?",
    answer:
      "Use the contact form and choose the department that fits your message: general, media, investor or partnership inquiries.",
    links: [{ label: "Contact us", href: "/contact" }],
    homepage: true,
  },
  {
    id: "who-owns-the-group",
    category: "Company",
    question: "Who owns Global Food Group?",
    answer:
      "Ownership information has not been published on this site yet. It will appear in the shareholder information on the Investors page once it is confirmed.",
    links: [{ label: "Shareholder information", href: "/investors#shareholders" }],
    relatedIds: ["find-investor-information"],
  },
  {
    id: "when-established",
    category: "Company",
    question: "When was Global Food Group established?",
    answer:
      "The founding date has not been published on this site yet. The company history on the About page will show it once it is verified.",
    links: [{ label: "Company history", href: "/about#history" }],
    relatedIds: ["what-is-the-group"],
  },
  {
    id: "headquarters",
    category: "Company",
    question: "Where is Global Food Group headquartered?",
    answer:
      "The headquarters address has not been published on this site yet. Corporate details will appear on the Contact page once they are confirmed.",
    links: [{ label: "Contact us", href: "/contact" }],
  },
  {
    id: "countries-of-operation",
    category: "Brands",
    question: "Which countries does Global Food Group operate in?",
    answer:
      "Each brand page lists the countries and regions where that brand operates. A group-level overview will appear once the details are verified.",
    links: [{ label: "Brand directory", href: "/brands" }],
    relatedIds: ["find-all-brands"],
  },
  {
    id: "business-model",
    category: "Company",
    question: "What is the group's business model?",
    answer:
      "The group is the parent company of independent brands, and each brand keeps its own identity and customers. The About page describes the business model as it is confirmed.",
    links: [{ label: "Business model", href: "/about#business-model" }],
    relatedIds: ["what-does-the-group-do"],
  },
  {
    id: "how-the-group-makes-money",
    category: "Investors",
    question: "How does Global Food Group make money?",
    answer:
      "Financial results have not been published on this site yet. Revenue and other figures will appear on the Investors page with their reporting period, currency and source.",
    links: [{ label: "Financial overview", href: "/investors" }],
    relatedIds: ["find-investor-information"],
  },
  {
    id: "franchise-opportunities",
    category: "Contact",
    question: "Does Global Food Group offer franchise opportunities?",
    answer:
      "Information about franchise opportunities has not been published on this site yet. To ask, use the contact form and choose Partnership inquiries.",
    links: [{ label: "Contact us", href: "/contact" }],
  },
  {
    id: "company-mission",
    category: "Company",
    question: "What is the company's mission?",
    answer:
      "The mission statement has not been published on this site yet. It will appear on the About page once it is confirmed.",
    links: [{ label: "Mission and values", href: "/about#mission" }],
  },
];
