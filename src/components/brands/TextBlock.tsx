type TextBlockProps = {
  title: string;
  text: string | null;
  fallback: string;
};

export function TextBlock({ title, text, fallback }: TextBlockProps) {
  return (
    <div className="border-t-2 border-primary pt-4">
      <h3 className="text-heading-3 text-primary">{title}</h3>
      <p className={text ? "mt-3 text-body text-foreground" : "mt-3 text-body text-muted"}>
        {text ?? fallback}
      </p>
    </div>
  );
}
