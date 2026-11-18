"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { sendContactMessage } from "@/lib/contact";
import {
  contactFields,
  validateContact,
  type ContactField,
  type ContactValues,
  type FieldErrors,
} from "@/lib/contact-schema";
import type { Department } from "@/types/corporate";
import { FormField } from "./FormField";

type Status = "idle" | "submitting" | "success" | "unavailable" | "error";

type ContactFormProps = {
  departments: Department[];
};

const emptyValues: ContactValues = { name: "", email: "", department: "", message: "" };

const fieldClass =
  "min-h-11 w-full rounded-md border bg-surface px-3 py-2 text-body text-foreground aria-[invalid=true]:border-danger aria-[invalid=true]:border-2 border-border";

const fieldLabels: Record<ContactField, string> = {
  name: "Full name",
  email: "Email address",
  department: "Department",
  message: "Message",
};

export function ContactForm({ departments }: ContactFormProps) {
  const baseId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<ContactValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const fieldId = (field: ContactField) => `${baseId}-${field}`;
  const errorFields = contactFields.filter((field) => errors[field]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) summaryRef.current?.focus();
  }, [errors]);

  const setField = (field: ContactField, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const focusField = (field: ContactField) => document.getElementById(fieldId(field))?.focus();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const result = validateContact(values);
    if (!result.ok) {
      setStatus("idle");
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    const outcome = await sendContactMessage(result.data);
    setStatus(outcome.status);
    if (outcome.status === "success") {
      trackEvent("contact_form_submit", { department: result.data.department });
      setValues(emptyValues);
    }
  };

  const submitting = status === "submitting";

  return (
    <form noValidate onSubmit={handleSubmit} aria-label="Contact form" className="space-y-6">
      <p className="text-body text-muted">All fields are required.</p>

      {errorFields.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-md border-2 border-danger bg-surface p-5"
        >
          <h2 className="flex items-center gap-2 text-heading-3 text-danger">
            <AlertCircle aria-hidden="true" className="h-5 w-5" />
            There is a problem
          </h2>
          <ul className="mt-3 space-y-1">
            {errorFields.map((field) => (
              <li key={field}>
                <a
                  href={`#${fieldId(field)}`}
                  onClick={(event) => {
                    event.preventDefault();
                    focusField(field);
                  }}
                  className="inline-flex min-h-8 items-center font-medium text-danger underline underline-offset-4"
                >
                  {fieldLabels[field]}: {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FormField id={fieldId("name")} label={fieldLabels.name} error={errors.name}>
        {(props) => (
          <input
            {...props}
            type="text"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            className={fieldClass}
          />
        )}
      </FormField>

      <FormField id={fieldId("email")} label={fieldLabels.email} error={errors.email}>
        {(props) => (
          <input
            {...props}
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            className={fieldClass}
          />
        )}
      </FormField>

      <FormField
        id={fieldId("department")}
        label={fieldLabels.department}
        error={errors.department}
      >
        {(props) => (
          <select
            {...props}
            name="department"
            value={values.department}
            onChange={(event) => setField("department", event.target.value)}
            className={fieldClass}
          >
            <option value="">Choose a department</option>
            {departments.map((department) => (
              <option key={department.value} value={department.value}>
                {department.label}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <FormField
        id={fieldId("message")}
        label={fieldLabels.message}
        hint="Up to 2,000 characters."
        error={errors.message}
      >
        {(props) => (
          <textarea
            {...props}
            name="message"
            rows={6}
            value={values.message}
            onChange={(event) => setField("message", event.target.value)}
            className={fieldClass}
          />
        )}
      </FormField>

      <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting}>
        {submitting ? "Sending..." : "Send message"}
      </Button>

      <div role="status" aria-live="polite">
        {status === "unavailable" && (
          <p className="flex items-start gap-2 rounded-md border border-primary bg-surface p-4 text-body text-foreground">
            <Info aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
            <span>
              This form is not connected to a mail service yet, so your message was not sent. Your
              details are still in the form.
            </span>
          </p>
        )}
        {status === "success" && (
          <p
            className={cn(
              "flex items-start gap-2 rounded-md border-2 border-success bg-surface p-4 text-body text-foreground",
            )}
          >
            <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-success" />
            <span>Thank you. Your message was sent.</span>
          </p>
        )}
        {status === "error" && (
          <p className="flex items-start gap-2 rounded-md border-2 border-danger bg-surface p-4 text-body text-foreground">
            <AlertCircle aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-danger" />
            <span>
              Your message could not be sent. Check your connection and try again. Your details are
              still in the form.
            </span>
          </p>
        )}
      </div>
    </form>
  );
}
