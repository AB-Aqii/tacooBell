"use client";

import { useEffect } from "react";
import { isAnalyticsEvent, trackEvent } from "@/lib/analytics";

export function EventTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-track-event]");
      if (!target) return;
      const name = target.dataset.trackEvent;
      if (!isAnalyticsEvent(name)) return;
      const label = target.dataset.trackLabel;
      trackEvent(name, label ? { label } : {});
    };

    const onToggle = (event: Event) => {
      const element = event.target as HTMLElement | null;
      if (element?.tagName !== "DETAILS" || !element.hasAttribute("open")) return;
      if (!element.id.startsWith("faq-")) return;
      trackEvent("faq_expand", { question_id: element.id.slice(4) });
    };

    document.addEventListener("click", onClick);
    document.addEventListener("toggle", onToggle, true);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("toggle", onToggle, true);
    };
  }, []);

  return null;
}
