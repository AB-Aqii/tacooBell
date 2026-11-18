"use client";

import { Container } from "@/components/layout/Container";
import { Button, ButtonLink } from "@/components/ui/Button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <Container className="py-16 lg:py-24">
      <h1 className="text-heading-1 text-primary">Something went wrong</h1>
      <p className="mt-4 max-w-prose text-body-lg text-muted">
        This page could not load. Try again, or return to the homepage.
      </p>
      {error.digest && <p className="mt-2 text-small text-muted">Reference: {error.digest}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="secondary">
          Go to homepage
        </ButtonLink>
      </div>
    </Container>
  );
}
