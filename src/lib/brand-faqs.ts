import { siteConfig } from "@/data/site";
import { getHostname } from "@/lib/format";
import type { Brand } from "@/types/brand";
import type { Faq } from "@/types/faq";

const listFormat = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

export function buildBrandFaqs(brand: Brand): Faq[] {
  const { name, website, profile } = brand;
  const offerings = profile.productsAndServices.map((item) => item.toLowerCase());

  return [
    {
      id: "what-is-the-brand",
      category: "Brands",
      question: `What is ${name}?`,
      answer: `${name} is a brand in the ${siteConfig.name} portfolio, in the ${brand.category.toLowerCase()} category. ${brand.shortDescription}`,
      links: [{ label: "All brands", href: "/brands" }],
    },
    {
      id: "products-and-services",
      category: "Brands",
      question: `What products or services does ${name} offer?`,
      answer:
        offerings.length > 0
          ? `${name} offers ${listFormat.format(offerings)}.`
          : "The list of products and services will be added once it is verified.",
    },
    {
      id: "locations",
      category: "Brands",
      question: `Where can I find ${name} locations?`,
      answer: website
        ? `Use the official ${name} website to find locations.`
        : "Location information will be added once it is verified.",
      links: website ? [{ label: `Visit the ${name} website`, href: website }] : undefined,
    },
    {
      id: "official-website",
      category: "Brands",
      question: `What is the official ${name} website?`,
      answer: website
        ? `The official ${name} website is ${getHostname(website)}.`
        : "The official website link has not been added yet.",
      links: website ? [{ label: `Visit the ${name} website`, href: website }] : undefined,
    },
    {
      id: "latest-news",
      category: "News",
      question: `Where can I find the latest ${name} news?`,
      answer: "Brand announcements are published in the News & Media section.",
      links: [{ label: "News & Media", href: "/news" }],
    },
    {
      id: "jobs",
      category: "Careers",
      question: `How can I find job opportunities at ${name}?`,
      answer: "Open positions and official application links are on the Careers page.",
      links: [{ label: "Careers", href: "/careers" }],
    },
  ];
}
