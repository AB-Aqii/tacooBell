"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { NavItem, NavLink } from "@/types/navigation";

type MobileNavProps = {
  items: NavItem[];
  cta: NavLink;
};

const iconButton =
  "inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-primary hover:bg-background";

export function MobileNav({ items, cta }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const baseId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const open = () => {
    dialogRef.current?.showModal();
    setIsOpen(true);
  };

  const close = () => dialogRef.current?.close();

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1280px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) dialogRef.current?.close();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label="Open menu"
        className={iconButton}
      >
        <Menu aria-hidden="true" className="h-6 w-6" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => {
          setIsOpen(false);
          setExpanded(null);
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-surface p-0 text-foreground backdrop:bg-black/40"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6">
            <span id={titleId} className="text-lg font-bold text-primary">
              Menu
            </span>
            <button type="button" onClick={close} aria-label="Close menu" className={iconButton}>
              <X aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-2 sm:px-6">
            <ul className="divide-y divide-border">
              {items.map((item, index) => {
                if (!item.children) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className="flex min-h-12 items-center py-3 text-lg font-semibold"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                const isExpanded = expanded === item.label;
                const panelId = `${baseId}-panel-${index}`;

                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => setExpanded(isExpanded ? null : item.label)}
                      className="flex min-h-12 w-full items-center justify-between py-3 text-left text-lg font-semibold"
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "h-5 w-5 transition-transform motion-reduce:transition-none",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                    <ul id={panelId} hidden={!isExpanded} className="pb-3 pl-3">
                      {item.children.map((child) => (
                        <li key={`${child.label}-${child.href}`}>
                          <Link
                            href={child.href}
                            onClick={close}
                            className="flex min-h-11 items-center py-2 text-body text-muted hover:text-primary"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-border p-4 sm:p-6">
            <ButtonLink href={cta.href} onClick={close} size="lg" className="w-full">
              {cta.label}
            </ButtonLink>
          </div>
        </div>
      </dialog>
    </div>
  );
}
