import { cn } from "@/lib/cn";

type SampleNoticeProps = {
  show: boolean;
  className?: string;
};

export function SampleNotice({ show, className }: SampleNoticeProps) {
  if (!show) return null;
  return (
    <p className={cn("text-small text-muted", className)}>
      Sample entries are shown until verified information is added.
    </p>
  );
}
