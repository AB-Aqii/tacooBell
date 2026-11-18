import { getHighlightSegments } from "@/lib/search/highlight";

type HighlightProps = {
  text: string;
  terms: string[];
};

export function Highlight({ text, terms }: HighlightProps) {
  return (
    <>
      {getHighlightSegments(text, terms).map((segment, index) =>
        segment.match ? (
          <mark key={index} className="rounded-sm bg-accent/40 font-bold text-inherit">
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
