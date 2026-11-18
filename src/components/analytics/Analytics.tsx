"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { OPEN_CONSENT_EVENT, readConsent, writeConsent, type ConsentState } from "@/lib/analytics";
import { ConsentBanner } from "./ConsentBanner";
import { EventTracker } from "./EventTracker";

type AnalyticsProps = {
  measurementId: string;
};

export function Analytics({ measurementId }: AnalyticsProps) {
  const [consent, setConsent] = useState<ConsentState | null | undefined>(undefined);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    const reopen = () => setReopened(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const decide = (state: ConsentState) => {
    writeConsent(state);
    setConsent(state);
    setReopened(false);
    if (state === "denied") window.gtag?.("consent", "update", { analytics_storage: "denied" });
  };

  const showBanner = consent === null || reopened;

  return (
    <>
      {consent === "granted" && (
        <>
          <Script id="analytics-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config','${measurementId}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
            strategy="afterInteractive"
          />
          <EventTracker />
        </>
      )}
      {showBanner && <ConsentBanner onDecide={decide} focusOnMount={reopened} />}
    </>
  );
}
