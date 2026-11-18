import { siteConfig } from "@/data/site";

export function localizedPath(
  locale: string,
  path: string,
  defaultLocale: string = siteConfig.defaultLocale,
): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

export function getAlternateLanguages(
  path: string,
  locales: string[] = siteConfig.locales,
  defaultLocale: string = siteConfig.defaultLocale,
): Record<string, string> | undefined {
  if (locales.length < 2) return undefined;

  const entries = locales.map((locale) => [locale, localizedPath(locale, path, defaultLocale)]);
  return Object.fromEntries([
    ...entries,
    ["x-default", localizedPath(defaultLocale, path, defaultLocale)],
  ]);
}
