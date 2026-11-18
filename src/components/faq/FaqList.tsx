import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Faq } from "@/types/faq";

type FaqListProps = {
  items: Faq[];
  className?: string;
  showRelated?: boolean;
  relatedPool?: Faq[];
};

export function FaqList({ items, className, showRelated = false, relatedPool }: FaqListProps) {
  const pool = relatedPool ?? items;

  return (
    <div className={cn("border-t border-border", className)}>
      {items.map((item) => {
        const related = showRelated
          ? (item.relatedIds ?? [])
              .map((id) => pool.find((candidate) => candidate.id === id))
              .filter((candidate): candidate is Faq => Boolean(candidate))
          : [];

        return (
          <details key={item.id} id={`faq-${item.id}`} className="group border-b border-border">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-body-lg font-semibold text-primary [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown
                aria-hidden="true"
                className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <div className="pb-6 pr-9">
              <p className="text-body text-foreground">{item.answer}</p>
              {item.links && (
                <ul className="mt-2 flex flex-wrap gap-x-5">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {related.length > 0 && (
                <div className="mt-3">
                  <p className="text-small font-semibold text-foreground">Related questions</p>
                  <ul>
                    {related.map((question) => (
                      <li key={question.id}>
                        <a
                          href={`#faq-${question.id}`}
                          className="inline-flex min-h-11 items-center text-small font-medium text-primary underline underline-offset-4"
                        >
                          {question.question}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
