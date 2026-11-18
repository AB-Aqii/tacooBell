"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import "@/styles/globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <main className="mx-auto max-w-3xl px-4 py-24">
          <h1 className="text-heading-1 text-primary">Something went wrong</h1>
          <p className="mt-4 text-body-lg text-muted">
            The site could not load. Try again, or return to the homepage.
          </p>
          {error.digest && <p className="mt-2 text-small text-muted">Reference: {error.digest}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={reset}>Try again</Button>
            <ButtonLink href="/" variant="secondary">
              Go to homepage
            </ButtonLink>
          </div>
        </main>
      </body>
    </html>
  );
}
