import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@/components/analytics/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { siteConfig } from "@/data/site";
import "@/styles/globals.css";

const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} | Our Brands, Business and Company`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  verification: siteConfig.searchConsoleToken
    ? { google: siteConfig.searchConsoleToken }
    : undefined,
  robots: siteConfig.allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.defaultLocale} className={inter.variable}>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        {siteConfig.gaMeasurementId && <Analytics measurementId={siteConfig.gaMeasurementId} />}
        <SpeedInsights />
      </body>
    </html>
  );
}
