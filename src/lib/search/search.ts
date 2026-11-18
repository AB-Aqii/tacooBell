import { normalizeText, tokenize } from "@/lib/text";
import type { SearchDocument, SearchResult } from "./types";

type PreparedDocument = {
  document: SearchDocument;
  title: string;
  titleWords: string[];
  keywords: string;
  description: string;
};

const preparedCache = new WeakMap<SearchDocument[], PreparedDocument[]>();

function prepare(documents: SearchDocument[]): PreparedDocument[] {
  const cached = preparedCache.get(documents);
  if (cached) return cached;

  const prepared = documents.map((document) => ({
    document,
    title: normalizeText(document.title),
    titleWords: tokenize(document.title),
    keywords: normalizeText(document.keywords.join(" ")),
    description: normalizeText(document.description),
  }));
  preparedCache.set(documents, prepared);
  return prepared;
}

function scoreDocument(entry: PreparedDocument, terms: string[], phrase: string): number {
  let score = 0;

  for (const term of terms) {
    if (entry.titleWords.some((word) => word.startsWith(term))) score += 12;
    else if (entry.title.includes(term)) score += 8;
    else if (entry.keywords.includes(term)) score += 5;
    else if (entry.description.includes(term)) score += 2;
    else return 0;
  }

  if (entry.title === phrase) score += 25;
  else if (entry.title.startsWith(phrase)) score += 10;
  if (entry.keywords.includes(phrase)) score += 14;
  if (entry.document.type === "page") score += 3;
  return score;
}

export function searchDocuments(
  documents: SearchDocument[],
  query: string,
  limit = 8,
): SearchResult[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  const phrase = normalizeText(query);

  return prepare(documents)
    .map((entry) => ({ ...entry.document, score: scoreDocument(entry, terms, phrase) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "en"))
    .slice(0, limit);
}
