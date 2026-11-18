import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BrandSummary } from "@/types/brand";
import { BrandMark } from "./BrandMark";

type BrandCardProps = {
  brand: BrandSummary;
};

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <article className="flex h-full flex-col rounded-md border border-border bg-surface p-6">
      <BrandMark brand={brand} />
      <h3 className="mt-5 text-heading-3 text-primary">{brand.name}</h3>
      <p className="mt-1 text-small font-medium text-muted">{brand.category}</p>
      {brand.region && <p className="text-small text-muted">{brand.region}</p>}
      <p className="mt-3 flex-1 text-body text-foreground">{brand.shortDescription}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5">
        <Link
          href={`/brands/${brand.slug}`}
          className="inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline"
        >
          Explore {brand.name}
        </Link>
        {brand.website && (
          <a
            href={brand.website}
            data-track-event="brand_website_click"
            data-track-label={brand.slug}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1 font-medium text-muted underline-offset-4 hover:text-primary hover:underline"
          >
            Official website
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
