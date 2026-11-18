import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getRobotsRules } from "@/lib/robots";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return getRobotsRules(siteConfig.allowIndexing, absoluteUrl("/sitemap.xml"));
}
