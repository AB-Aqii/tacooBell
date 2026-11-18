import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SampleNotice } from "@/components/ui/SampleNotice";
import { hero } from "@/data/company";
import { getBrands } from "@/lib/brands";

export async function Hero() {
  const brands = (await getBrands()).slice(0, 5);

  return (
    <section aria-labelledby="hero-heading" className="surface-dark bg-primary text-white">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16 lg:py-24">
        <div>
          <h1 id="hero-heading" className="max-w-3xl text-display">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-body-lg text-white/85">{hero.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={hero.primaryCta.href} variant="accent" size="lg">
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="inverse" size="lg">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <aside aria-labelledby="hero-brands-heading">
          <h2 id="hero-brands-heading" className="text-small font-semibold text-white/80">
            Brands in the portfolio
          </h2>
          <ul className="mt-3 border-b border-white/20">
            {brands.map((brand) => (
              <li key={brand.slug} className="border-t border-white/20">
                <Link
                  href={`/brands/${brand.slug}`}
                  className="group flex min-h-16 items-center justify-between gap-4 py-3 hover:text-accent"
                >
                  <span>
                    <span className="block text-heading-3">{brand.name}</span>
                    <span className="block text-small text-white/70">{brand.category}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <SampleNotice
            show={brands.some((brand) => brand.isSample)}
            className="mt-3 text-white/70"
          />
        </aside>
      </Container>
    </section>
  );
}
