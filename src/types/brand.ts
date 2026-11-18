import type { KeyFigure } from "./company";

export type BrandLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type BrandSummary = {
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  region?: string;
  website?: string;
  logo?: BrandLogo;
  featured: boolean;
  isSample: boolean;
};

export type BrandProfile = {
  overview: string[];
  history: string | null;
  positioning: string | null;
  productsAndServices: string[];
  targetAudience: string | null;
  marketPresence: string | null;
  statistics: KeyFigure[];
  achievements: string[];
};

export type Brand = BrandSummary & {
  profile: BrandProfile;
  seo?: { title?: string; description?: string };
};
