import { cn } from "@/lib/cn";
import type { KeyFigure } from "@/types/company";

type FigureListProps = {
  figures: KeyFigure[];
  className?: string;
};

export function FigureList({ figures, className }: FigureListProps) {
  return (
    <dl className={cn("grid gap-8 sm:grid-cols-2", className)}>
      {figures.map((figure) => {
        const context = [figure.period, figure.source].filter(Boolean).join(", ");
        return (
          <div key={figure.label} className="border-t-2 border-primary pt-4">
            <dt className="text-small font-medium text-muted">{figure.label}</dt>
            <dd className="mt-2">
              {figure.value ? (
                <>
                  <span className="text-heading-2 text-primary">{figure.value}</span>
                  {context && <span className="mt-1 block text-small text-muted">{context}</span>}
                </>
              ) : (
                <span className="text-heading-3 text-muted">To be confirmed</span>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
