import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Pillar } from "@/types/company";

type PillarGridProps = {
  items: Pillar[];
  className?: string;
};

export function PillarGrid({ items, className }: PillarGridProps) {
  return (
    <ul className={cn("grid gap-8", className)}>
      {items.map((item) => (
        <li key={item.title} className="border-t-2 border-primary pt-5">
          <h3 className="text-heading-3 text-primary">{item.title}</h3>
          <p className={cn("mt-3 text-body", item.pending ? "text-muted" : "text-foreground")}>
            {item.body}
          </p>
          {item.link && (
            <Link
              href={item.link.href}
              className="mt-3 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
            >
              {item.link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
