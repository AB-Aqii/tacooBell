import { CONSENT_KEY, OPEN_CONSENT_EVENT } from "@/lib/analytics";
import { createActions, createChecker, setupDom } from "./helpers/dom";

async function main() {
  const dom = setupDom();
  const win = dom.window;
  const doc = win.document;
  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { Analytics } = await import("@/components/analytics/Analytics");
  const { check, finish } = createChecker();
  const { act } = React;
  const { click, settle, buttonByText } = createActions(dom, act);

  const gtagCalls: unknown[][] = [];
  (win as unknown as { gtag: (...args: unknown[]) => void }).gtag = (...args) => {
    gtagCalls.push(args);
  };

  const root = createRoot(doc.getElementById("root")!);
  await act(async () => {
    root.render(React.createElement(Analytics, { measurementId: "G-TEST1234" }));
  });
  await settle();

  const banner = () => doc.querySelector('section[aria-labelledby="consent-heading"]');
  const stored = () => win.localStorage.getItem(CONSENT_KEY);
  const link = (event: string, label?: string) => {
    const a = doc.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("data-track-event", event);
    if (label) a.setAttribute("data-track-label", label);
    doc.body.appendChild(a);
    return a;
  };
  const faq = (id: string, open: boolean) => {
    const details = doc.createElement("details");
    details.id = `faq-${id}`;
    doc.body.appendChild(details);
    if (open) details.setAttribute("open", "");
    return details;
  };
  const swallowClicks = (event: Event) => event.preventDefault();
  doc.addEventListener("click", swallowClicks);

  check("banner shows when no decision is stored", Boolean(banner()));
  const accept = buttonByText("Accept analytics", true)!;
  const decline = buttonByText("Decline", true)!;
  check("accept and decline have equal visual weight", accept.className === decline.className);
  check("nothing is sent before consent", gtagCalls.length === 0);
  await click(link("brand_website_click", "x"));
  check("clicks are not tracked before consent", gtagCalls.length === 0);

  await click(decline);
  check("declining stores the choice and hides the banner", stored() === "denied" && !banner());
  await click(link("brand_website_click", "x"));
  check(
    "declined visitors are not tracked",
    gtagCalls.filter((c) => c[0] === "event").length === 0,
  );

  await act(async () => {
    win.dispatchEvent(new win.Event(OPEN_CONSENT_EVENT));
  });
  check("cookie settings reopens the banner", Boolean(banner()));
  check("reopened banner moves focus to its heading", doc.activeElement?.id === "consent-heading");

  await click(buttonByText("Accept analytics", true)!);
  await settle();
  check("accepting stores the choice and hides the banner", stored() === "granted" && !banner());

  const events = () => gtagCalls.filter((c) => c[0] === "event");
  await click(link("brand_website_click", "harbor-grill"));
  check(
    "a tracked link click sends its event and label",
    JSON.stringify(events().at(-1)) ===
      JSON.stringify(["event", "brand_website_click", { label: "harbor-grill" }]),
  );
  const before = events().length;
  await click(link("purchase", "x"));
  check("unknown event names are ignored", events().length === before);

  const opened = faq("who-owns-the-group", true);
  await act(async () => {
    opened.dispatchEvent(new win.Event("toggle"));
  });
  check(
    "opening a FAQ question sends faq_expand",
    JSON.stringify(events().at(-1)) ===
      JSON.stringify(["event", "faq_expand", { question_id: "who-owns-the-group" }]),
  );
  const count = events().length;
  const closed = faq("closed-one", false);
  await act(async () => {
    closed.dispatchEvent(new win.Event("toggle"));
  });
  check("closing a FAQ question sends nothing", events().length === count);

  doc.removeEventListener("click", swallowClicks);
  finish();
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
