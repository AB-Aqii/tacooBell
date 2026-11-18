import type { NewsSummary } from "@/types/news";
import { createActions, createChecker, setupDom } from "./helpers/dom";

const make = (index: number): NewsSummary => ({
  slug: `article-${index}`,
  title: `Article ${String(index).padStart(2, "0")}`,
  excerpt: `Excerpt for article ${index}`,
  category: index % 2 === 0 ? "Press releases" : "Corporate updates",
  publishedAt: index <= 4 ? `2025-0${index}-15` : `2026-${String(index - 4).padStart(2, "0")}-15`,
  author: "Editorial team",
  featured: index === 14,
  isSample: true,
  readingMinutes: 2,
});

async function main() {
  const dom = setupDom();
  dom.window.history.pushState(null, "", "/news");
  const doc = dom.window.document;
  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { NewsDirectory } = await import("@/components/news/NewsDirectory");
  const { check, finish } = createChecker();
  const { act } = React;
  const { setValue, click, settle, buttonByText } = createActions(dom, act);

  const articles = Array.from({ length: 14 }, (_, index) => make(index + 1));
  const root = createRoot(doc.getElementById("root")!);
  await act(async () => {
    root.render(React.createElement(NewsDirectory, { articles }));
  });

  const listCards = () => doc.querySelectorAll("ul li article").length;
  const status = () => doc.querySelector('[role="status"]')?.textContent ?? "";
  const featured = () => doc.body.textContent?.includes("Featured article") ?? false;
  const field = (label: string) =>
    [...doc.querySelectorAll("label")].find((l) => l.textContent === label)?.control as
      HTMLInputElement | HTMLSelectElement;
  const heading = () => doc.getElementById("news-results")!;

  check("featured article shows on page 1", featured());
  check("grid shows 6 of the 13 non-featured articles", listCards() === 6);
  check("status counts articles after featured", status() === "Showing 1 to 6 of 13 articles.");
  check("heading says More news when featured is shown", heading().textContent === "More news");
  check(
    "pagination is present with three pages",
    doc.querySelectorAll('nav[aria-label="Pagination"] li').length === 5,
  );

  await click(buttonByText("Next")!);
  check("next goes to page 2", status() === "Showing 7 to 12 of 13 articles.");
  check("featured is hidden after page 1", !featured());
  check("results heading receives focus after paging", doc.activeElement === heading());
  check("current page is marked", doc.querySelector('[aria-current="page"]')?.textContent === "2");

  await click(doc.querySelector('button[aria-label="Page 3"]')!);
  check(
    "page 3 shows the last article",
    listCards() === 1 && status() === "Showing 13 to 13 of 13 articles.",
  );
  check("next is disabled on the last page", (buttonByText("Next") as HTMLButtonElement).disabled);
  await click(buttonByText("Previous")!);
  check("previous returns to page 2", status() === "Showing 7 to 12 of 13 articles.");

  await setValue(field("Search articles"), "article 07");
  check(
    "search narrows results and resets to page 1",
    listCards() === 1 && status() === "Showing 1 to 1 of 1 article.",
  );
  check("featured is hidden while filtering", !featured());
  check("heading says Search results", heading().textContent === "Search results");
  check("clear filters appears", Boolean(buttonByText("Clear filters", true)));

  await click(buttonByText("Clear filters", true)!);
  check("clear filters restores the list", listCards() === 6 && featured());

  await setValue(field("Category"), "Press releases");
  check(
    "category filter works",
    [...doc.querySelectorAll("ul li article h3")].length > 0 && !status().includes("No articles"),
  );
  await setValue(field("Category"), "Media coverage");
  check(
    "empty category shows its own message",
    doc.body.textContent!.includes("There are no articles in Media coverage yet"),
  );
  check("empty category status", status() === "No articles found.");
  await click(buttonByText("Clear filters", true)!);

  await setValue(field("Publication year"), "2025");
  check("year filter shows only 2025 articles", status() === "Showing 1 to 4 of 4 articles.");
  await setValue(field("Search articles"), "zzzz");
  check(
    "no matches shows the search message",
    doc.body.textContent!.includes("No articles match your search"),
  );
  await click(buttonByText("Clear filters", true)!);

  dom.window.history.pushState(null, "", "/news#press-releases");
  await act(async () => {
    dom.window.dispatchEvent(new dom.window.Event("hashchange"));
  });
  await settle();
  check(
    "a category hash selects that category",
    (field("Category") as HTMLSelectElement).value === "Press releases",
  );

  finish();
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
