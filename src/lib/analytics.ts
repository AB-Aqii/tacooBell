export const CONSENT_KEY = "gfg-analytics-consent";
export const OPEN_CONSENT_EVENT = "gfg:open-consent";

export function parseMeasurementId(raw: string | undefined): string {
  return /^G-[A-Z0-9]{4,}$/.test(raw ?? "") ? (raw as string) : "";
}

export type ConsentState = "granted" | "denied";

export const analyticsEvents = [
  "brand_website_click",
  "site_search",
  "faq_expand",
  "contact_form_submit",
  "investor_resource_click",
  "career_link_click",
] as const;

export type AnalyticsEvent = (typeof analyticsEvents)[number];

export type EventParams = Record<string, string | number>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function isAnalyticsEvent(value: string | undefined): value is AnalyticsEvent {
  return analyticsEvents.some((event) => event === value);
}

export function readConsent(): ConsentState | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(state: ConsentState): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, state);
  } catch {
    return;
  }
}

export function trackEvent(name: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  if (readConsent() !== "granted") return;
  window.gtag?.("event", name, params);
}
