import { normalizeText } from "@/lib/text";

export type HighlightSegment = {
  text: string;
  match: boolean;
};

function foldCharacter(character: string): string {
  return character
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function getHighlightSegments(text: string, terms: string[]): HighlightSegment[] {
  const usable = [...new Set(terms.map(normalizeText).filter(Boolean))];
  if (usable.length === 0) return [{ text, match: false }];

  let folded = "";
  const originalIndex: number[] = [];
  let position = 0;
  for (const character of text) {
    const next = foldCharacter(character);
    for (let step = 0; step < next.length; step++) originalIndex.push(position);
    folded += next;
    position += character.length;
  }

  const ranges: Array<[number, number]> = [];
  for (const term of usable) {
    let from = 0;
    for (;;) {
      const found = folded.indexOf(term, from);
      if (found === -1) break;
      const start = originalIndex[found];
      const lastStart = originalIndex[found + term.length - 1];
      if (start !== undefined && lastStart !== undefined) {
        const lastCodePoint = text.codePointAt(lastStart);
        const lastLength =
          lastCodePoint === undefined ? 1 : String.fromCodePoint(lastCodePoint).length;
        ranges.push([start, lastStart + lastLength]);
      }
      from = found + term.length;
    }
  }

  if (ranges.length === 0) return [{ text, match: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([range[0], range[1]]);
  }

  const segments: HighlightSegment[] = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) segments.push({ text: text.slice(cursor, start), match: false });
    segments.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), match: false });
  return segments;
}
