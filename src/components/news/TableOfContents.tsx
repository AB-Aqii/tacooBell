import type { ArticleSection } from "@/types/news";

type TableOfContentsProps = {
  sections: ArticleSection[];
};

export function TableOfContents({ sections }: TableOfContentsProps) {
  return (
    <nav aria-labelledby="toc-heading" className="border-t-2 border-primary pt-4">
      <h2 id="toc-heading" className="text-small font-semibold text-primary">
        On this page
      </h2>
      <ol className="mt-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="inline-flex min-h-8 items-center text-small text-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
