import { formatDate } from "@/lib/format";
import type { DocumentGroup } from "@/types/corporate";

type DocumentListProps = {
  groups: DocumentGroup[];
  emptyText?: string;
};

export function DocumentList({
  groups,
  emptyText = "No documents have been published here yet.",
}: DocumentListProps) {
  return (
    <div className="max-w-3xl space-y-10">
      {groups.map((group) => (
        <div key={group.id}>
          <h3 className="text-heading-3 text-primary">{group.title}</h3>
          {group.description && <p className="mt-1 text-body text-muted">{group.description}</p>}
          {group.documents.length > 0 ? (
            <ul className="mt-4 border-t border-border">
              {group.documents.map((doc) => (
                <li
                  key={doc.title}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-4"
                >
                  <div>
                    <p className="font-semibold text-foreground">{doc.title}</p>
                    <p className="text-small text-muted">
                      {doc.period}
                      {doc.publishedAt && `, published ${formatDate(doc.publishedAt)}`}
                    </p>
                  </div>
                  {doc.url ? (
                    <a
                      href={doc.url}
                      data-track-event="investor_resource_click"
                      data-track-label={doc.title}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                    >
                      View document
                      <span className="sr-only">: {doc.title} (opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="text-small font-medium text-muted">Document unavailable</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-md border border-dashed border-border bg-surface p-5 text-body text-muted">
              {emptyText}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
