import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  pretendToBeVisual: true,
  url: "http://localhost/",
});
const g = globalThis as Record<string, unknown>;
g.window = dom.window;
g.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
g.HTMLElement = dom.window.HTMLElement;
g.Node = dom.window.Node;
g.IS_REACT_ACT_ENVIRONMENT = true;
g.self = dom.window;

async function main() {
  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { BrandDirectory } = await import("@/components/brands/BrandDirectory");
  const doc = dom.window.document;
  const mk = (n: string, c: string, r?: string) => ({
    slug: n.toLowerCase().replace(/\W+/g, "-"),
    name: n,
    shortDescription: `${n} text`,
    category: c,
    region: r,
    featured: false,
    isSample: true,
  });
  const many = Array.from({ length: 30 }, (_, i) =>
    mk(
      `Brand ${String(i).padStart(2, "0")}`,
      i % 2 ? "Pizza" : "Bakery",
      i % 3 ? "Europe" : "Asia",
    ),
  );
  const root = createRoot(doc.getElementById("root")!);
  const act = React.act;
  await act(async () => {
    root.render(React.createElement(BrandDirectory, { brands: many }));
  });

  const results: string[] = [];
  const check = (name: string, ok: boolean) => results.push(`${ok ? "PASS" : "FAIL"} ${name}`);
  const cards = () => doc.querySelectorAll("article").length;
  const status = () => doc.querySelector('[role="status"]')?.textContent ?? "";
  const setValue = async (el: Element, value: string, proto: object, evt: string) => {
    const setter = Object.getOwnPropertyDescriptor(proto, "value")!.set!;
    await act(async () => {
      setter.call(el, value);
      el.dispatchEvent(new dom.window.Event(evt, { bubbles: true }));
    });
  };
  const input = doc.querySelector('input[type="search"]')!;
  const selects = doc.querySelectorAll("select");
  const clickButton = async (label: string) => {
    const btn = [...doc.querySelectorAll("button")].find((b) => b.textContent?.includes(label));
    if (!btn) throw new Error("no button " + label);
    await act(async () => {
      btn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
    });
  };

  check("renders first page of 12", cards() === 12);
  check("status shows 12 of 30", status() === "Showing 12 of 30 brands.");
  check("region select present", selects.length === 3);
  await clickButton("Show 12 more");
  check("show more reveals 24", cards() === 24);
  await clickButton("Show 6 more");
  check(
    "show more reveals all 30 and hides button",
    cards() === 30 &&
      ![...doc.querySelectorAll("button")].some((b) => b.textContent?.includes("more brands")),
  );

  await setValue(input, "brand 07", dom.window.HTMLInputElement.prototype, "input");
  check("search narrows to 1", cards() === 1 && status() === "Showing 1 of 1 brand.");
  check(
    "clear filters button appears",
    [...doc.querySelectorAll("button")].some((b) => b.textContent === "Clear filters"),
  );
  await setValue(input, "zzzz", dom.window.HTMLInputElement.prototype, "input");
  check(
    "no match shows empty state",
    cards() === 0 &&
      status() === "No brands found." &&
      !!doc.body.textContent?.includes("No brands match your search"),
  );
  await clickButton("Clear filters");
  check("clear filters restores list", cards() === 12 && (input as HTMLInputElement).value === "");

  await setValue(selects[0]!, "Pizza", dom.window.HTMLSelectElement.prototype, "change");
  check("category filter works", status() === "Showing 12 of 15 brands.");
  await setValue(selects[1]!, "Asia", dom.window.HTMLSelectElement.prototype, "change");
  const names = [...doc.querySelectorAll("article h3")].map((h) => h.textContent);
  check(
    "category + region combine",
    status().includes("of 5 brand") || status().includes("5 of 5"),
  );
  await clickButton("Clear filters");
  await setValue(selects[2]!, "name-desc", dom.window.HTMLSelectElement.prototype, "change");
  check(
    "sort Z to A puts Brand 29 first",
    doc.querySelector("article h3")?.textContent === "Brand 29",
  );
  void names;

  console.log(results.join("\n"));
  process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(2);
});
