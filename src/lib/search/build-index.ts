import { brands } from "@/data/brands";
import { faqs } from "@/data/faqs";
import { announcementGroups, reportGroups } from "@/data/investors";
import { leaders } from "@/data/leadership";
import { newsArticles } from "@/data/news";
import { searchablePages } from "@/data/search";
import type { SearchDocument } from "./types";

export async function buildSearchIndex(): Promise<SearchDocument[]> {
  const pages: SearchDocument[] = searchablePages.map((page) => ({
    ...page,
    id: `page:${page.url}`,
    type: "page",
  }));

  const brandDocuments: SearchDocument[] = brands.map((brand) => {
    const offerings = brand.profile.productsAndServices;
    const offered = offerings.length > 0 ? ` Products and services: ${offerings.join(", ")}.` : "";
    return {
      id: `brand:${brand.slug}`,
      type: "brand",
      title: brand.name,
      description: `${brand.shortDescription}${offered}`,
      url: `/brands/${brand.slug}`,
      keywords: [brand.category, ...(brand.region ? [brand.region] : []), ...offerings],
    };
  });

  const newsDocuments: SearchDocument[] = newsArticles.map((article) => ({
    id: `news:${article.slug}`,
    type: "news",
    title: article.title,
    description: article.excerpt,
    url: `/news/${article.slug}`,
    keywords: [article.category, ...article.sections.map((section) => section.heading)],
  }));

  const faqDocuments: SearchDocument[] = faqs.map((faq) => ({
    id: `faq:${faq.id}`,
    type: "faq",
    title: faq.question,
    description: faq.answer,
    url: `/faq#faq-${faq.id}`,
    keywords: [faq.category],
  }));

  const leaderDocuments: SearchDocument[] = leaders.map((leader) => ({
    id: `leadership:${leader.slug}`,
    type: "leadership",
    title: leader.name,
    description: `${leader.title}. ${leader.biography}`,
    url: "/leadership",
    keywords: [leader.title],
  }));

  const investorDocuments: SearchDocument[] = [...reportGroups, ...announcementGroups].flatMap(
    (group) =>
      group.documents.map((document) => ({
        id: `investor:${group.id}:${document.title}`,
        type: "investor" as const,
        title: document.title,
        description: `${group.title}, ${document.period}`,
        url:
          group.id === "financial-announcements"
            ? "/investors#announcements"
            : "/investors#reports",
        keywords: [group.title],
      })),
  );

  return [
    ...pages,
    ...brandDocuments,
    ...newsDocuments,
    ...faqDocuments,
    ...leaderDocuments,
    ...investorDocuments,
  ];
}
