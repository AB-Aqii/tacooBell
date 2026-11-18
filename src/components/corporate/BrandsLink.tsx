import Link from "next/link";

export function BrandsLink() {
  return (
    <p>
      <Link
        href="/brands"
        className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
      >
        Explore the group&apos;s brands
      </Link>
    </p>
  );
}
