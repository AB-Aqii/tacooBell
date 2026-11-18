import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { breadcrumbSchema } from "@/lib/structured-data";
import { Container } from "./Container";

type PageHeaderProps = {
  title: string;
  intro?: string;
  breadcrumbs: Crumb[];
  path: string;
};

export function PageHeader({ title, intro, breadcrumbs, path }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-surface">
      <Container className="py-10 lg:py-14">
        <JsonLd data={breadcrumbSchema(breadcrumbs, path)} />
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 max-w-3xl text-heading-1 text-primary">{title}</h1>
        {intro && <p className="mt-4 max-w-3xl text-body-lg text-muted">{intro}</p>}
      </Container>
    </div>
  );
}
