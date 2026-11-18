import { getPageItems } from "@/lib/pagination";
import { Button } from "./Button";

type PaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-10">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          <Button variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
            Previous<span className="sr-only"> page</span>
          </Button>
        </li>
        {getPageItems(page, pageCount).map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <Button
                variant={item === page ? "primary" : "secondary"}
                className="min-w-11"
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onChange(item)}
              >
                {item}
              </Button>
            </li>
          ) : (
            <li key={item} aria-hidden="true" className="px-1 text-muted">
              &hellip;
            </li>
          ),
        )}
        <li>
          <Button
            variant="secondary"
            disabled={page >= pageCount}
            onClick={() => onChange(page + 1)}
          >
            Next<span className="sr-only"> page</span>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
