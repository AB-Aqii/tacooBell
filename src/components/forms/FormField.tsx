import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

type FieldControlProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
};

type FormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: (props: FieldControlProps) => ReactNode;
};

export function FormField({ id, label, hint, error, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-small font-semibold text-foreground">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="mb-1 text-small text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="mb-1 flex items-start gap-1.5 text-small font-medium text-danger"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="sr-only">Error: </span>
            {error}
          </span>
        </p>
      )}
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
    </div>
  );
}
