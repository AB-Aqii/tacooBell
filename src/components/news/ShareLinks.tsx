import { getShareLinks } from "@/lib/share";
import { CopyLinkButton } from "./CopyLinkButton";

type ShareLinksProps = {
  url: string;
  title: string;
};

export function ShareLinks({ url, title }: ShareLinksProps) {
  return (
    <section aria-labelledby="share-heading" className="border-t border-border pt-6">
      <h2 id="share-heading" className="text-heading-3 text-primary">
        Share this article
      </h2>
      <ul className="mt-2 flex flex-wrap items-center gap-x-6">
        {getShareLinks(url, title).map((link) => {
          const external = !link.href.startsWith("mailto:");
          return (
            <li key={link.label}>
              <a
                href={link.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
              >
                {link.label}
                {external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          );
        })}
        <li>
          <CopyLinkButton url={url} />
        </li>
      </ul>
    </section>
  );
}
