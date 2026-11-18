import { searchDocuments } from "./search";
import type { SearchDocument, SearchProvider } from "./types";

let indexRequest: Promise<SearchDocument[]> | null = null;

export function loadSearchIndex(): Promise<SearchDocument[]> {
  if (!indexRequest) {
    indexRequest = fetch("/api/search-index")
      .then((response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        return response.json() as Promise<SearchDocument[]>;
      })
      .catch((error: unknown) => {
        indexRequest = null;
        throw error;
      });
  }
  return indexRequest;
}

export function resetSearchIndexCache() {
  indexRequest = null;
}

export const localSearchProvider: SearchProvider = {
  async search(query, limit) {
    const documents = await loadSearchIndex();
    return searchDocuments(documents, query, limit);
  },
};
