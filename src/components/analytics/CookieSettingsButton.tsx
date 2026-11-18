"use client";

import { siteConfig } from "@/data/site";
import { OPEN_CONSENT_EVENT } from "@/lib/analytics";

export function CookieSettingsButton() {
  if (!siteConfig.gaMeasurementId) return null;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="mt-1 inline-flex min-h-11 items-center text-small text-white/80 underline underline-offset-4 hover:text-white"
    >
      Cookie settings
    </button>
  );
}
