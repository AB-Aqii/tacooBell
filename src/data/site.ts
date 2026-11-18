import { parseMeasurementId } from "@/lib/analytics";

export const siteConfig = {
  name: "Global Food Group",
  description:
    "Corporate website of Global Food Group, a multi-brand restaurant and food business. Explore the company, its brands, news, careers and investor information.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  defaultLocale: "en",
  locales: ["en"] as string[],
  themeColor: "#14213D",
  gaMeasurementId: parseMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  searchConsoleToken: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  contentNotice:
    "Company details, figures and brand information on this site are sample content until verified.",
} as const;
