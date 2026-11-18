import { Section } from "@/components/layout/Section";
import { FigureList } from "@/components/ui/FigureList";
import { getHostname } from "@/lib/format";
import type { Brand } from "@/types/brand";

type BrandPresenceProps = {
  brand: Brand;
};

export function BrandPresence({ brand }: BrandPresenceProps) {
  const { name, website, profile } = brand;

  return (
    <Section id="presence" size="compact" title={`Where ${name} operates`}>
      <p
        className={
          profile.marketPresence
            ? "max-w-3xl text-body-lg text-foreground"
            : "max-w-3xl text-body text-muted"
        }
      >
        {profile.marketPresence ??
          `The market presence of ${name} will be added once it is verified.`}
      </p>
      <FigureList figures={profile.statistics} className="mt-8 lg:grid-cols-3" />
      <p className="mt-4 max-w-3xl text-small text-muted">
        Figures appear with their reporting period and source once they are verified.
      </p>
      <p className="mt-8 text-body">
        <span className="font-semibold text-primary">Official website: </span>
        {website ? (
          <a
            href={website}
            data-track-event="brand_website_click"
            data-track-label={brand.slug}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4"
          >
            {getHostname(website)}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <span className="text-muted">The link will be added once it is verified.</span>
        )}
      </p>
    </Section>
  );
}
