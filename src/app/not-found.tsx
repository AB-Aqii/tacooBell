import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { primaryNav } from "@/data/navigation";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="py-16 lg:py-24">
      <h1 className="text-heading-1 text-primary">Page not found</h1>
      <p className="mt-4 max-w-prose text-body-lg text-muted">
        The page may have moved, or the address may be wrong. Go back to the homepage or choose a
        section below.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Go to homepage</ButtonLink>
        <ButtonLink href="/brands" variant="secondary">
          Browse our brands
        </ButtonLink>
      </div>
      <ul className="mt-10 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {primaryNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
