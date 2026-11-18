"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { NavItem, NavLink } from "@/types/navigation";

type DesktopNavProps = {
  items: NavItem[];
  cta: NavLink;
};

function isItemActive(pathname: string, item: NavItem) {
  const paths = [item.href, ...(item.children ?? []).map((child) => child.href)];
  return paths.some((href) => {
    const path = href.split("#")[0] ?? href;
    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

const itemClass = (active: boolean) =>
  cn(
    "inline-flex min-h-11 items-center gap-1 border-b-2 px-2.5 text-small font-medium transition-colors motion-reduce:transition-none hover:text-primary",
    active ? "border-primary text-primary" : "border-transparent text-foreground",
  );

export function DesktopNav({ items, cta }: DesktopNavProps) {
  const pathname = usePathname();
  const baseId = useId();
  const navRef = useRef<HTMLElement>(null);
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  const close = useCallback(() => setOpenLabel(null), []);

  useEffect(() => {
    if (openLabel === null) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openLabel, close]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape" || openLabel === null) return;
    const index = items.findIndex((item) => item.label === openLabel);
    close();
    document.getElementById(`${baseId}-trigger-${index}`)?.focus();
  };

  const handleBlur = (event: FocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && !event.currentTarget.contains(next)) close();
  };

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      onKeyDown={handleKeyDown}
      className="hidden xl:flex xl:flex-1 xl:items-center xl:justify-between xl:pl-10"
    >
      <ul className="flex items-center gap-0.5">
        {items.map((item, index) => {
          const active = isItemActive(pathname, item);

          if (!item.children) {
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={itemClass(active)}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const isOpen = openLabel === item.label;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <li key={item.label} className="relative" onBlur={handleBlur}>
              <button
                type="button"
                id={`${baseId}-trigger-${index}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenLabel(isOpen ? null : item.label)}
                className={itemClass(active)}
              >
                {item.label}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "h-4 w-4 transition-transform motion-reduce:transition-none",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              <div
                id={panelId}
                className={cn(
                  "absolute left-0 top-full z-50 mt-1 w-80 rounded-md border border-border bg-surface p-2 shadow-lg transition duration-150 motion-reduce:transition-none",
                  isOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-1 opacity-0",
                )}
              >
                <ul>
                  {item.children.map((child) => (
                    <li key={`${child.label}-${child.href}`}>
                      <Link
                        href={child.href}
                        onClick={close}
                        className="block rounded-md px-3 py-2.5 hover:bg-background"
                      >
                        <span className="block text-small font-semibold text-foreground">
                          {child.label}
                        </span>
                        {child.description && (
                          <span className="block text-small text-muted">{child.description}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
      <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
    </nav>
  );
}
