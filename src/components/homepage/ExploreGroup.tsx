import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { explorePanels } from "@/data/company";

export function ExploreGroup() {
  return (
    <Section id="explore" tone="background" title="More about the group">
      <ul className="grid gap-6 md:grid-cols-3">
        {explorePanels.map((panel) => (
          <li
            key={panel.title}
            className="flex flex-col rounded-md border border-border bg-surface p-6"
          >
            <h3 className="text-heading-3 text-primary">{panel.title}</h3>
            <p className="mt-3 flex-1 text-body text-foreground">{panel.body}</p>
            <Link
              href={panel.link.href}
              className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
            >
              {panel.link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
