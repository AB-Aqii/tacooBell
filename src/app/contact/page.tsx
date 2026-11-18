import { RelatedLinks } from "@/components/corporate/RelatedLinks";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { contactPage, contactRelated, corporateDetails, departments } from "@/data/contact";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema } from "@/lib/structured-data";

const description =
  "Contact Global Food Group. Choose a department for general, media, investor or partnership inquiries and send a message.";

export const metadata = buildMetadata({ title: "Contact Us", description, path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: "ContactPage",
          name: "Contact Us",
          description,
          path: "/contact",
        })}
      />
      <PageHeader
        path="/contact"
        title="Contact us"
        intro={contactPage.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />
      <section aria-labelledby="send-heading" className="bg-surface py-12 lg:py-16">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 id="send-heading" className="text-heading-2 text-primary">
              Send a message
            </h2>
            <div className="mt-6 max-w-xl">
              <ContactForm departments={departments} />
            </div>
          </div>
          <aside className="space-y-10">
            <section aria-labelledby="departments-heading">
              <h2 id="departments-heading" className="text-heading-3 text-primary">
                Departments
              </h2>
              <dl className="mt-4 border-t border-border">
                {departments.map((department) => (
                  <div key={department.value} className="border-b border-border py-3">
                    <dt className="font-semibold text-foreground">{department.label}</dt>
                    <dd className="text-small text-muted">{department.description}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section aria-labelledby="corporate-heading">
              <h2 id="corporate-heading" className="text-heading-3 text-primary">
                Corporate information
              </h2>
              <dl className="mt-4 border-t border-border">
                {corporateDetails.map((detail) => (
                  <div key={detail.label} className="border-b border-border py-3">
                    <dt className="font-semibold text-foreground">{detail.label}</dt>
                    <dd className={detail.value ? "text-foreground" : "text-muted"}>
                      {detail.value ?? "To be confirmed"}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </Container>
      </section>
      <RelatedLinks links={contactRelated} />
    </>
  );
}
