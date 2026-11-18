import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
  tone?: "light" | "dark";
};

export function Breadcrumbs({ items, tone = "light" }: BreadcrumbsProps) {
  const dark = tone === "dark";

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1 text-small">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight
                aria-hidden="true"
                className={cn("h-4 w-4", dark ? "text-white/60" : "text-muted")}
              />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "inline-flex min-h-8 items-center underline-offset-4 hover:underline",
                  dark ? "text-white/80 hover:text-white" : "text-muted hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={dark ? "text-white" : "text-foreground"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
