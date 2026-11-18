import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { pillars } from "@/data/company";

export function MissionVision() {
  return (
    <Section id="mission-vision" tone="background" title="Mission, vision and business model">
      <dl className="grid gap-8 md:grid-cols-3">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="border-t-2 border-primary pt-5">
            <dt className="text-heading-3 text-primary">{pillar.title}</dt>
            <dd className="mt-3 text-body text-foreground">{pillar.body}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8">
        <Link
          href="/about"
          className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
        >
          Read the full company overview
        </Link>
      </p>
    </Section>
  );
}
