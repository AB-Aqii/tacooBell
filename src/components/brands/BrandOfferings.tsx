import { Section } from "@/components/layout/Section";
import type { Brand } from "@/types/brand";
import { TextBlock } from "./TextBlock";

type BrandOfferingsProps = {
  brand: Brand;
};

export function BrandOfferings({ brand }: BrandOfferingsProps) {
  const { name, profile } = brand;

  return (
    <Section
      id="offerings"
      tone="background"
      size="compact"
      title={`${name} products and services`}
    >
      <div className="grid gap-10 lg:grid-cols-2">
        {profile.productsAndServices.length > 0 ? (
          <ul className="border-t border-border">
            {profile.productsAndServices.map((item) => (
              <li key={item} className="border-b border-border py-3 text-body text-foreground">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body text-muted">
            The products and services of {name} will be added once they are verified.
          </p>
        )}
        <TextBlock
          title={`Who ${name} is for`}
          text={profile.targetAudience}
          fallback={`The target audience of ${name} will be added once it is confirmed.`}
        />
      </div>
    </Section>
  );
}
