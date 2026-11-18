import type { NextConfig } from "next";
import { parseMeasurementId } from "./src/lib/analytics";
import { redirects } from "./src/data/redirects";
import { buildSecurityHeaders } from "./src/lib/security";

const securityHeaders = buildSecurityHeaders({
  isDevelopment: process.env.NODE_ENV !== "production",
  analyticsEnabled: parseMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) !== "",
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT,
  enforceCsp: process.env.CSP_ENFORCE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return redirects.map((rule) => ({ ...rule, permanent: true }));
  },
};

export default nextConfig;
