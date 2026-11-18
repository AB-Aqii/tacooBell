import { Section } from "@/components/layout/Section";
import type { Brand } from "@/types/brand";
import { TextBlock } from "./TextBlock";

type BrandSectionProps = {
  brand: Brand;
};

export function BrandOverview({ brand }: BrandSectionProps) {
  const { name, profile } = brand;

  return (
    <Section id="overview" size="compact" title={`About ${name}`}>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="max-w-prose space-y-4">
          {profile.overview.map((paragraph) => (
            <p key={paragraph} className="text-body-lg text-foreground">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="space-y-8">
          <TextBlock
            title="History"
            text={profile.history}
            fallback={`The history of ${name} will be added once it is verified.`}
          />
          <TextBlock
            title="Mission and positioning"
            text={profile.positioning}
            fallback={`The mission and positioning of ${name} will be added once they are confirmed.`}
          />
        </div>
      </div>
    </Section>
  );
}
