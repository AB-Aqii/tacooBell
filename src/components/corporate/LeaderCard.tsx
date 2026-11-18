import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getInitials } from "@/lib/format";
import type { Leader } from "@/types/corporate";

type LeaderCardProps = {
  leader: Leader;
};

export function LeaderCard({ leader }: LeaderCardProps) {
  return (
    <article className="flex h-full flex-col rounded-md border border-border bg-surface p-6">
      {leader.photo ? (
        <Image
          src={leader.photo.src}
          alt={leader.photo.alt}
          width={leader.photo.width}
          height={leader.photo.height}
          className="h-28 w-28 rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-28 w-28 items-center justify-center rounded-full bg-primary text-heading-2 text-white"
        >
          {getInitials(leader.name)}
        </div>
      )}
      <h3 className="mt-5 text-heading-3 text-primary">{leader.name}</h3>
      <p className="text-small font-medium text-muted">{leader.title}</p>
      <p className="mt-3 text-body text-foreground">{leader.biography}</p>
      <p className="mt-3 flex-1 text-small text-muted">{leader.responsibilities}</p>
      {leader.profileLinks && leader.profileLinks.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-5">
          {leader.profileLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 font-medium text-primary underline underline-offset-4"
              >
                {link.label}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
