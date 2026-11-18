import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { FigureList } from "@/components/ui/FigureList";
import { keyFigures, presence } from "@/data/company";

export function GroupAtAGlance() {
  return (
    <Section id="presence" title="Presence and key figures" intro={presence.intro}>
      <FigureList figures={keyFigures} className="lg:grid-cols-4" />
      <p className="mt-8 max-w-3xl text-body text-muted">{presence.note}</p>
      <div className="mt-6">
        <ButtonLink href="/brands" variant="secondary">
          See where each brand operates
        </ButtonLink>
      </div>
    </Section>
  );
}
