import { z } from "zod";

export const departmentValues = ["general", "media", "investor", "partnership"] as const;

export type DepartmentValue = (typeof departmentValues)[number];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your full name.")
    .max(100, "Enter a name of 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .max(254, "Enter an email address of 254 characters or fewer.")
    .email("Enter an email address in the format name@example.com."),
  department: z.enum(departmentValues, {
    errorMap: () => ({ message: "Choose a department." }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Enter a message of at least 10 characters.")
    .max(2000, "Shorten your message to 2,000 characters or fewer."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactValues = {
  name: string;
  email: string;
  department: string;
  message: string;
};

export type ContactField = keyof ContactValues;

export type FieldErrors = Partial<Record<ContactField, string>>;

export type ValidationResult =
  { ok: true; data: ContactInput } | { ok: false; errors: FieldErrors };

export const contactFields: ContactField[] = ["name", "email", "department", "message"];

export function validateContact(values: ContactValues): ValidationResult {
  const parsed = contactSchema.safeParse(values);
  if (parsed.success) return { ok: true, data: parsed.data };

  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && contactFields.includes(key) && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
