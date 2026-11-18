import { cn } from "@/lib/cn";
import type { TimelineEntry } from "@/types/corporate";

type TimelineProps = {
  entries: TimelineEntry[];
};

export function Timeline({ entries }: TimelineProps) {
  return (
    <ol className="max-w-3xl border-l-2 border-border">
      {entries.map((entry) => (
        <li key={`${entry.period}-${entry.title}`} className="relative pb-10 pl-8 last:pb-0">
          <span
            aria-hidden="true"
            className={cn(
              "absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 bg-surface",
              entry.isPlaceholder ? "border-muted" : "border-primary bg-primary",
            )}
          />
          <p className="text-small font-semibold text-primary">{entry.period}</p>
          <h3 className="mt-1 text-heading-3 text-foreground">{entry.title}</h3>
          <p
            className={cn("mt-2 text-body", entry.isPlaceholder ? "text-muted" : "text-foreground")}
          >
            {entry.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
