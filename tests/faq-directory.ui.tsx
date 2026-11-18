import { faqs } from "@/data/faqs";
import { createActions, createChecker, setupDom } from "./helpers/dom";

async function main() {
  const dom = setupDom("http://localhost/faq#faq-company-mission");
  const doc = dom.window.document;
  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { FaqDirectory } = await import("@/components/faq/FaqDirectory");
  const { check, finish } = createChecker();
  const { act } = React;
  const { setValue, click, settle, buttonByText } = createActions(dom, act);

  const root = createRoot(doc.getElementById("root")!);
  await act(async () => {
    root.render(React.createElement(FaqDirectory, { items: faqs }));
  });
  await settle();

  const status = () => doc.querySelector('[role="status"]')?.textContent ?? "";
  const details = () => [...doc.querySelectorAll("details")];
  const search = doc.querySelector('input[type="search"]') as HTMLInputElement;
  const isOpen = (id: string) => doc.getElementById(`faq-${id}`)?.hasAttribute("open") ?? false;

  check("all questions are listed", details().length === faqs.length);
  check(
    "status counts questions",
    status() === `Showing ${faqs.length} of ${faqs.length} questions.`,
  );
  check("a #faq- hash opens that question on load", isOpen("company-mission"));
  check("the opened question's summary receives focus", doc.activeElement?.tagName === "SUMMARY");

  await setValue(search, "owns");
  check(
    "search filters by question and answer text",
    details().length >= 1 && details().every((d) => d.textContent!.toLowerCase().includes("own")),
  );
  check("clear filters appears while searching", Boolean(buttonByText("Clear filters", true)));

  await setValue(search, "");
  await click(buttonByText("Careers", true)!);
  check(
    "category button filters",
    details().every((d) => d.textContent!.includes("job") || d.textContent!.includes("Careers")) &&
      details().length >= 1,
  );
  check(
    "active category is marked pressed",
    buttonByText("Careers", true)!.getAttribute("aria-pressed") === "true",
  );
  check(
    "All is no longer pressed",
    buttonByText("All", true)!.getAttribute("aria-pressed") === "false",
  );

  await click(buttonByText("All", true)!);
  const owner = doc.getElementById("faq-who-owns-the-group")!;
  const relatedLinks = [...owner.querySelectorAll('a[href^="#faq-"]')];
  check("related questions are linked", relatedLinks.length >= 1);

  await setValue(search, "zzzz");
  check(
    "no results shows an empty state",
    doc.body.textContent!.includes("No questions match your search") &&
      status() === "No questions found.",
  );
  check("empty state offers the contact page", Boolean(doc.querySelector('a[href="/contact"]')));

  dom.window.history.pushState(null, "", "/faq#faq-headquarters");
  await act(async () => {
    dom.window.dispatchEvent(new dom.window.Event("hashchange"));
  });
  await settle();
  check(
    "a hash to a hidden question clears filters and opens it",
    details().length === faqs.length && isOpen("headquarters") && search.value === "",
  );

  finish();
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
