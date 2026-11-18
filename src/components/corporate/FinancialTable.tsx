import type { FinancialFigure } from "@/types/corporate";

type FinancialTableProps = {
  rows: FinancialFigure[];
};

const headers = ["Measure", "Value", "Reporting period", "Currency and units", "Source"];

function Cell({ value }: { value: string | undefined }) {
  return (
    <td className="px-4 py-3 align-top">
      {value ? value : <span className="text-muted">To be confirmed</span>}
    </td>
  );
}

export function FinancialTable({ rows }: FinancialTableProps) {
  return (
    <div
      role="region"
      aria-label="Financial overview table"
      tabIndex={0}
      className="overflow-x-auto rounded-md border border-border bg-surface"
    >
      <table className="w-full min-w-[40rem] border-collapse text-left text-small">
        <caption className="sr-only">
          Financial figures with their reporting period, currency, units and source
        </caption>
        <thead>
          <tr className="border-b border-border bg-background">
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-semibold text-primary">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <th scope="row" className="px-4 py-3 align-top font-semibold text-foreground">
                {row.label}
              </th>
              <Cell value={row.value ?? undefined} />
              <Cell value={row.period} />
              <Cell value={[row.currency, row.units].filter(Boolean).join(", ") || undefined} />
              <Cell value={row.source} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
