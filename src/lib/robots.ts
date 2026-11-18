export type RobotsRules = {
  rules: { userAgent: string; allow?: string; disallow: string | string[] }[];
  sitemap?: string;
};

export function getRobotsRules(allowIndexing: boolean, sitemapUrl: string): RobotsRules {
  if (!allowIndexing) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: sitemapUrl,
  };
}
