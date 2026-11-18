import { toJsonLd, type JsonLdNode } from "@/lib/structured-data";

type JsonLdProps = {
  data: JsonLdNode | JsonLdNode[];
};

export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(data) }} />;
}
