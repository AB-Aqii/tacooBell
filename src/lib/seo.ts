import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { getAlternateLanguages } from "@/lib/i18n";

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  image?: { url: string; alt: string; width?: number; height?: number };
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

export const defaultImage = {
  url: "/opengraph-image",
  alt: siteConfig.name,
  width: 1200,
  height: 630,
};

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
}: BuildMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const images = [image ?? defaultImage];
  const languages = getAlternateLanguages(path);
  const shared = {
    title: fullTitle,
    description,
    url: path,
    siteName: siteConfig.name,
    images,
  };

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path, ...(languages ? { languages } : {}) },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph:
      type === "article"
        ? { ...shared, type: "article", publishedTime, modifiedTime, authors }
        : { ...shared, type: "website" },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images,
    },
  };
}
