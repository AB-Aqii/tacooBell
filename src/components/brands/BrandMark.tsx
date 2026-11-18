import Image from "next/image";
import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/format";
import type { BrandSummary } from "@/types/brand";

type BrandMarkProps = {
  brand: Pick<BrandSummary, "name" | "logo">;
  variant?: "card" | "hero";
};

export function BrandMark({ brand, variant = "card" }: BrandMarkProps) {
  const hero = variant === "hero";

  if (brand.logo) {
    return (
      <div className={cn("self-start", hero && "rounded-md bg-white p-3")}>
        <Image
          src={brand.logo.src}
          alt={brand.logo.alt}
          width={brand.logo.width}
          height={brand.logo.height}
          priority={hero}
          className={cn("w-auto", hero ? "h-20" : "h-14")}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md",
        hero
          ? "h-24 w-24 bg-white text-heading-2 text-primary"
          : "h-14 w-14 bg-primary text-heading-3 text-white",
      )}
    >
      {getInitials(brand.name)}
    </div>
  );
}
