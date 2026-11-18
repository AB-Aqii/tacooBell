import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Logo } from "@/components/ui/Logo";
import { headerCta, primaryNav } from "@/data/navigation";
import { Container } from "./Container";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <Container className="flex h-16 items-center justify-between gap-4 xl:h-20">
        <Logo />
        <DesktopNav items={primaryNav} cta={headerCta} />
        <div className="flex items-center gap-2">
          <SearchDialog />
          <MobileNav items={primaryNav} cta={headerCta} />
        </div>
      </Container>
    </header>
  );
}
