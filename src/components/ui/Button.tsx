import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "inverse";
type Size = "md" | "lg";

type StyleProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-soft",
  secondary: "border border-primary text-primary hover:bg-primary hover:text-white",
  ghost: "text-primary hover:bg-background",
  accent: "bg-accent text-primary hover:bg-accent/85",
  inverse: "border border-white text-white hover:bg-white hover:text-primary",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-small",
  lg: "min-h-12 px-6 text-body",
};

export function buttonStyles({ variant = "primary", size = "md", className }: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = StyleProps & Omit<ComponentPropsWithoutRef<"button">, "className">;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = StyleProps & Omit<ComponentPropsWithoutRef<typeof Link>, "className">;

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
