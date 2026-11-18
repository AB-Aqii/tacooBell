import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { introduction } from "@/data/company";

export function CompanyIntro() {
  const [lead, ...rest] = introduction.paragraphs;

  return (
    <Section id="company" title={introduction.title} intro={lead}>
      <div className="max-w-3xl">
        {rest.map((paragraph) => (
          <p key={paragraph} className="text-body text-foreground">
            {paragraph}
          </p>
        ))}
        <ul className="mt-4 flex flex-wrap gap-x-6">
          {introduction.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
