import { siteConfig } from "@/data/site";
import { absoluteUrl } from "@/lib/seo";
import type { Brand } from "@/types/brand";
import type { Leader } from "@/types/corporate";
import type { NewsArticle } from "@/types/news";

export type JsonLdNode = Record<string, unknown>;

type CrumbInput = { label: string; href?: string };

const organizationRef = () => ({
  "@type": "Organization",
  name: siteConfig.name,
  url: absoluteUrl("/"),
});

const websiteRef = () => ({
  "@type": "WebSite",
  name: siteConfig.name,
  url: absoluteUrl("/"),
});

function toAbsolute(source: string): string {
  return /^https?:\/\//.test(source) ? source : absoluteUrl(source);
}

export function organizationSchema(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
  };
}

export function websiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    inLanguage: siteConfig.defaultLocale,
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

export function breadcrumbSchema(items: CrumbInput[], currentPath?: string): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const href = item.href ?? (index === items.length - 1 ? currentPath : undefined);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(href ? { item: absoluteUrl(href) } : {}),
      };
    }),
  };
}

type WebPageInput = {
  type?: "WebPage" | "AboutPage" | "ContactPage";
  name: string;
  description: string;
  path: string;
  about?: JsonLdNode;
};

export function webPageSchema({
  type = "WebPage",
  name,
  description,
  path,
  about,
}: WebPageInput): JsonLdNode {
  return {
    "@type": type,
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: siteConfig.defaultLocale,
    isPartOf: websiteRef(),
    ...(about ? { about } : {}),
  };
}

export function brandPageSchema(brand: Brand, title: string, description: string): JsonLdNode {
  const brandNode: JsonLdNode = {
    "@type": "Brand",
    name: brand.name,
    description: brand.shortDescription,
    ...(brand.website ? { url: brand.website } : {}),
    ...(brand.logo ? { logo: toAbsolute(brand.logo.src) } : {}),
  };
  return webPageSchema({
    name: title,
    description,
    path: `/brands/${brand.slug}`,
    about: brandNode,
  });
}

export function newsArticleSchema(article: NewsArticle): JsonLdNode {
  const url = absoluteUrl(`/news/${article.slug}`);
  return {
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: article.publishedAt,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    author: { "@type": "Organization", name: article.author },
    publisher: organizationRef(),
    articleSection: article.category,
    inLanguage: siteConfig.defaultLocale,
    ...(article.image ? { image: [toAbsolute(article.image.src)] } : {}),
  };
}

export function personSchema(leader: Leader): JsonLdNode {
  return {
    "@type": "Person",
    name: leader.name,
    jobTitle: leader.title,
    description: leader.biography,
    ...(leader.photo ? { image: toAbsolute(leader.photo.src) } : {}),
    ...(leader.profileLinks && leader.profileLinks.length > 0
      ? { sameAs: leader.profileLinks.map((link) => link.href) }
      : {}),
    worksFor: organizationRef(),
  };
}

export function toJsonLd(data: JsonLdNode | JsonLdNode[]): string {
  const document = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...data };

  return JSON.stringify(document)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
