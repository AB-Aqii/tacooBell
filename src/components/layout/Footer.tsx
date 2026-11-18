import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics/CookieSettingsButton";
import { Logo } from "@/components/ui/Logo";
import { footerGroups } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { Container } from "./Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark bg-primary text-white">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-sm text-small text-white/80">{siteConfig.description}</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-small font-semibold">{group.title}</h2>
                <ul className="mt-3">
                  {group.links.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-11 items-center text-small text-white/80 hover:text-white hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-white/20 pt-6 text-small text-white/80">
          <p>
            &copy; {year} {siteConfig.name}
          </p>
          <p className="mt-1">{siteConfig.contentNotice}</p>
          <CookieSettingsButton />
        </div>
      </Container>
    </footer>
  );
}
