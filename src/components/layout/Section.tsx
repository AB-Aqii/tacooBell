import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  id: string;
  title: string;
  intro?: string;
  tone?: "surface" | "background";
  size?: "default" | "compact";
  children: ReactNode;
};

export function Section({
  id,
  title,
  intro,
  tone = "surface",
  size = "default",
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        size === "default" ? "py-16 lg:py-24" : "py-12 lg:py-16",
        tone === "surface" ? "bg-surface" : "bg-background",
      )}
    >
      <Container>
        <div className="max-w-3xl">
          <h2 id={headingId} className="text-heading-2 text-primary">
            {title}
          </h2>
          {intro && <p className="mt-4 text-body-lg text-muted">{intro}</p>}
        </div>
        <div className={size === "default" ? "mt-10 lg:mt-12" : "mt-8 lg:mt-10"}>{children}</div>
      </Container>
    </section>
  );
}
