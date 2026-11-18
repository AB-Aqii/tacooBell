import Link from "next/link";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/cn";

type LogoProps = {
  tone?: "dark" | "light";
  className?: string;
};

export function Logo({ tone = "dark", className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex min-h-11 items-center gap-3 rounded-sm",
        tone === "dark" ? "text-primary" : "text-white",
        className,
      )}
    >
      <svg aria-hidden="true" focusable="false" viewBox="0 0 32 32" className="h-8 w-8 shrink-0">
        <circle cx="11" cy="11" r="8" fill="currentColor" />
        <circle cx="21" cy="11" r="8" fill="rgb(var(--color-accent))" />
        <circle cx="16" cy="21" r="8" fill="currentColor" fillOpacity="0.45" />
      </svg>
      <span className="text-lg font-bold tracking-tight">{siteConfig.name}</span>
    </Link>
  );
}
