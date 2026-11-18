import Link from "next/link";
import { Section } from "@/components/layout/Section";
import type { RelatedLink } from "@/types/corporate";

type RelatedLinksProps = {
  links: RelatedLink[];
  tone?: "surface" | "background";
};

export function RelatedLinks({ links, tone = "background" }: RelatedLinksProps) {
  return (
    <Section id="related" tone={tone} size="compact" title="Continue exploring">
      <ul className="grid gap-6 md:grid-cols-3">
        {links.map((link) => (
          <li key={link.href} className="rounded-md border border-border bg-surface p-6">
            <h3 className="text-heading-3">
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline"
              >
                {link.title}
              </Link>
            </h3>
            <p className="mt-1 text-body text-muted">{link.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
