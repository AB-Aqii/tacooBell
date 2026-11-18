import { siteConfig } from "@/data/site";
import { renderOgImage } from "@/lib/og-image";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgImage({
    title: siteConfig.name,
    subtitle: "Restaurant and food brands, one group",
  });
}
