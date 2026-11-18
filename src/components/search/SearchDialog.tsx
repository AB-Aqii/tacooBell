"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { searchSuggestions } from "@/data/search";
import { trackEvent } from "@/lib/analytics";
import { localSearchProvider } from "@/lib/search/client";
import { searchTypeLabels, type SearchProvider, type SearchResult } from "@/lib/search/types";
import { tokenize } from "@/lib/text";
import { Highlight } from "./Highlight";

type Phase = "idle" | "loading" | "ready" | "error";

type SearchDialogProps = {
  provider?: SearchProvider;
};

const iconButton =
  "inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-primary hover:bg-background";

const chip =
  "inline-flex min-h-11 items-center rounded-md border border-border bg-surface px-4 text-small font-medium text-primary hover:bg-background";

export function SearchDialog({ provider = localSearchProvider }: SearchDialogProps) {
  const baseId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [attempt, setAttempt] = useState(0);

  const inputId = `${baseId}-input`;
  const listId = `${baseId}-results`;
  const optionId = (index: number) => `${baseId}-option-${index}`;
  const trimmed = query.trim();
  const terms = tokenize(query);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
    setIsOpen(true);
    inputRef.current?.focus();
  }, []);

  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!dialogRef.current?.open) open();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (trimmed === "") {
      setResults([]);
      setPhase("idle");
      setActiveIndex(-1);
      return;
    }

    let cancelled = false;
    setPhase("loading");
    provider
      .search(trimmed, 8)
      .then((found) => {
        if (cancelled) return;
        setResults(found);
        setPhase("ready");
        setActiveIndex(found.length > 0 ? 0 : -1);
      })
      .catch(() => {
        if (cancelled) return;
        setResults([]);
        setPhase("error");
        setActiveIndex(-1);
      });
    return () => {
      cancelled = true;
    };
  }, [trimmed, isOpen, provider, attempt]);

  useEffect(() => {
    if (activeIndex < 0) return;
    document.getElementById(`${baseId}-option-${activeIndex}`)?.scrollIntoView?.({
      block: "nearest",
    });
  }, [activeIndex, baseId]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.length > 0) setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length > 0) {
        setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
      }
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      document.getElementById(optionId(activeIndex))?.click();
    }
  };

  const applySuggestion = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const status =
    phase === "error"
      ? "Search is unavailable right now."
      : phase === "ready"
        ? results.length > 0
          ? `${results.length} ${results.length === 1 ? "result" : "results"}.`
          : `No results for ${trimmed}.`
        : phase === "loading" && results.length === 0
          ? "Searching."
          : "";

  const showList = trimmed !== "" && results.length > 0;

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label="Search the site"
        className={iconButton}
      >
        <Search aria-hidden="true" className="h-5 w-5" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Site search"
        onClose={() => {
          setIsOpen(false);
          setQuery("");
          setResults([]);
          setPhase("idle");
          setActiveIndex(-1);
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-black/50"
      >
        <div className="mx-auto flex h-full w-full max-w-2xl flex-col bg-surface text-foreground sm:mt-16 sm:h-auto sm:max-h-[calc(100dvh-8rem)] sm:rounded-md">
          <div className="flex shrink-0 items-center gap-2 border-b border-border p-3">
            <label htmlFor={inputId} className="sr-only">
              Search the site
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              aria-expanded={showList}
              aria-controls={showList ? listId : undefined}
              aria-autocomplete="list"
              aria-activedescendant={
                showList && activeIndex >= 0 ? optionId(activeIndex) : undefined
              }
              autoComplete="off"
              spellCheck={false}
              placeholder="Search brands, news, reports, careers"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-12 w-full rounded-md border border-border bg-surface px-3 text-body text-foreground"
            />
            <button type="button" onClick={close} aria-label="Close search" className={iconButton}>
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <p role="status" aria-live="polite" className="px-4 pt-3 text-small text-muted">
            {status}
          </p>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
            {trimmed === "" && (
              <div className="px-2 pt-2">
                <p className="text-small font-semibold text-foreground">Popular searches</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {searchSuggestions.map((term) => (
                    <li key={term}>
                      <button type="button" onClick={() => applySuggestion(term)} className={chip}>
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {phase === "error" && trimmed !== "" && (
              <div className="px-2 pt-2">
                <p className="text-body text-foreground">
                  The search index could not be loaded. Check your connection and try again.
                </p>
                <button
                  type="button"
                  onClick={() => setAttempt((count) => count + 1)}
                  className={`${chip} mt-3`}
                >
                  Try again
                </button>
              </div>
            )}

            {showList && (
              <ul role="listbox" id={listId} aria-label="Search results">
                {results.map((result, index) => (
                  <li key={result.id} role="presentation">
                    <Link
                      href={result.url}
                      id={optionId(index)}
                      role="option"
                      aria-selected={index === activeIndex}
                      onClick={() => {
                        trackEvent("site_search", {
                          result_type: result.type,
                          query_length: trimmed.length,
                        });
                        close();
                      }}
                      onMouseMove={() => setActiveIndex(index)}
                      className="block rounded-md px-3 py-3 aria-selected:bg-background aria-selected:outline aria-selected:outline-2 aria-selected:-outline-offset-2 aria-selected:outline-primary"
                    >
                      <span className="block text-small font-medium text-muted">
                        {searchTypeLabels[result.type]}
                      </span>
                      <span className="block font-semibold text-primary">
                        <Highlight text={result.title} terms={terms} />
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-small text-foreground">
                        <Highlight text={result.description} terms={terms} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {phase === "ready" && results.length === 0 && (
              <div className="px-2 pt-2">
                <p className="text-body text-foreground">
                  Nothing matched your search. Check the spelling or try a shorter word.
                </p>
                <p className="mt-4 text-small font-semibold text-foreground">Try one of these</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {searchSuggestions.map((term) => (
                    <li key={term}>
                      <button type="button" onClick={() => applySuggestion(term)} className={chip}>
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
