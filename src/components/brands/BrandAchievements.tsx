import { Section } from "@/components/layout/Section";
import type { Brand } from "@/types/brand";

type BrandAchievementsProps = {
  brand: Brand;
};

export function BrandAchievements({ brand }: BrandAchievementsProps) {
  const { name, profile } = brand;

  return (
    <Section id="achievements" tone="background" size="compact" title={`${name} achievements`}>
      {profile.achievements.length > 0 ? (
        <ul className="max-w-3xl border-t border-border">
          {profile.achievements.map((item) => (
            <li key={item} className="border-b border-border py-3 text-body text-foreground">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-3xl text-body text-muted">
          Verified achievements and awards for {name} will be listed here.
        </p>
      )}
    </Section>
  );
}
