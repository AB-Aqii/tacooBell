import { buildSearchIndex } from "@/lib/search/build-index";
import { createActions, createChecker, setupDom } from "./helpers/dom";

async function main() {
  const dom = setupDom();
  const doc = dom.window.document;
  const index = await buildSearchIndex();
  let indexRequests = 0;
  let failIndex = false;
  globalThis.fetch = (async () => {
    indexRequests++;
    if (failIndex) return new Response(null, { status: 500 });
    return new Response(JSON.stringify(index), { status: 200 });
  }) as typeof fetch;

  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { SearchDialog } = await import("@/components/search/SearchDialog");
  const { check, finish } = createChecker();
  const { act } = React;
  const { setValue, click, press, settle, buttonByText } = createActions(dom, act);

  const root = createRoot(doc.getElementById("root")!);
  await act(async () => {
    root.render(React.createElement(SearchDialog));
  });

  const dialog = doc.querySelector("dialog")!;
  const input = doc.querySelector('input[role="combobox"]') as HTMLInputElement;
  const trigger = doc.querySelector('button[aria-label="Search the site"]')!;
  const status = () => doc.querySelector('[role="status"]')?.textContent ?? "";
  const options = () => [...doc.querySelectorAll('[role="option"]')] as HTMLAnchorElement[];
  const active = () => options().findIndex((o) => o.getAttribute("aria-selected") === "true");

  check("index is not fetched before search opens", indexRequests === 0);
  await click(trigger);
  check("trigger opens the dialog", dialog.hasAttribute("open"));
  check(
    "input has the combobox role and a label",
    Boolean(doc.querySelector(`label[for="${input.id}"]`)),
  );
  check("input is focused when opened", doc.activeElement === input);
  check(
    "empty query shows popular searches",
    doc.body.textContent!.includes("Popular searches") &&
      doc.querySelectorAll("ul li button").length >= 5,
  );

  await setValue(input, "annual report");
  await settle();
  check("index is fetched once on first search", indexRequests === 1);
  check("results are listed as options", options().length >= 2);
  check("first result is active by default", active() === 0);
  check(
    "input points at the active option",
    input.getAttribute("aria-activedescendant") === options()[0]!.id,
  );
  check(
    "combobox is expanded and controls the list",
    input.getAttribute("aria-expanded") === "true" &&
      Boolean(doc.getElementById(input.getAttribute("aria-controls")!)),
  );
  check("status announces the result count", /^\d+ results?\.$/.test(status()));
  check(
    "matches are highlighted with mark",
    doc.querySelectorAll("[role=listbox] mark").length >= 2,
  );
  check(
    "top result is an investor page",
    options()[0]!.getAttribute("href")!.startsWith("/investors"),
  );

  await press(input, "ArrowDown");
  check("arrow down moves the active option", active() === 1);
  await press(input, "ArrowUp");
  await press(input, "ArrowUp");
  check("arrow up from the first wraps to the last", active() === options().length - 1);
  await press(input, "ArrowDown");
  check("arrow down from the last wraps to the first", active() === 0);

  let clicked = "";
  doc.addEventListener(
    "click",
    (event) => {
      const target = event.target as Element;
      const link = target.closest("a");
      if (link) {
        clicked = link.getAttribute("href") ?? "";
        event.preventDefault();
      }
    },
    true,
  );
  await press(input, "ArrowDown");
  const expected = options()[1]!.getAttribute("href");
  await press(input, "Enter");
  check("enter activates the highlighted result", clicked === expected && Boolean(expected));
  check("choosing a result closes the dialog", !dialog.hasAttribute("open"));

  await click(trigger);
  check("reopening starts with an empty query", input.value === "");

  await setValue(input, "zzzzq");
  await settle();
  check(
    "no results shows a message and suggestions",
    status() === "No results for zzzzq." && doc.body.textContent!.includes("Try one of these"),
  );
  await click(doc.querySelector("ul li button")!);
  await settle();
  check(
    "a suggestion fills the search and returns results",
    input.value.length > 0 && options().length > 0,
  );

  await setValue(input, "seafood");
  await settle();
  check(
    "brand products are searchable",
    options()[0]?.getAttribute("href") === "/brands/harbor-grill",
  );

  await click(doc.querySelector('button[aria-label="Close search"]')!);
  check("close button closes the dialog", !dialog.hasAttribute("open"));

  await act(async () => {
    doc.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );
  });
  check("Ctrl+K opens search", dialog.hasAttribute("open"));
  await click(doc.querySelector('button[aria-label="Close search"]')!);

  const { resetSearchIndexCache } = await import("@/lib/search/client");
  resetSearchIndexCache();
  failIndex = true;
  await click(trigger);
  await setValue(input, "brands");
  await settle();
  check(
    "a failed index load shows an error and retry",
    status() === "Search is unavailable right now." && Boolean(buttonByText("Try again")),
  );
  failIndex = false;
  await click(buttonByText("Try again")!);
  await settle();
  check("retry recovers and shows results", options().length > 0);

  finish();
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
