"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import type { ConsentState } from "@/lib/analytics";

type ConsentBannerProps = {
  onDecide: (state: ConsentState) => void;
  focusOnMount?: boolean;
};

export function ConsentBanner({ onDecide, focusOnMount = false }: ConsentBannerProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusOnMount) headingRef.current?.focus();
  }, [focusOnMount]);

  return (
    <section
      aria-labelledby="consent-heading"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface p-4 shadow-lg sm:p-6"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <h2
            id="consent-heading"
            ref={headingRef}
            tabIndex={-1}
            className="text-body font-semibold text-primary outline-none"
          >
            Analytics cookies
          </h2>
          <p className="mt-1 text-small text-foreground">
            We would like to use analytics cookies to see which pages are useful and to improve this
            site. We do not use advertising cookies. You can change your choice at any time from
            Cookie settings in the footer.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button variant="secondary" onClick={() => onDecide("granted")}>
            Accept analytics
          </Button>
          <Button variant="secondary" onClick={() => onDecide("denied")}>
            Decline
          </Button>
        </div>
      </div>
    </section>
  );
}
