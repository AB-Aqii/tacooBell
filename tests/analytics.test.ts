import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  CONSENT_KEY,
  isAnalyticsEvent,
  parseMeasurementId,
  readConsent,
  trackEvent,
  writeConsent,
} from "@/lib/analytics";

type Calls = unknown[][];

let store: Map<string, string>;
let calls: Calls;
const g = globalThis as Record<string, unknown>;

beforeEach(() => {
  store = new Map();
  calls = [];
  g.window = {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
    },
    gtag: (...args: unknown[]) => void calls.push(args),
  };
});

afterEach(() => {
  delete g.window;
});

test("measurement ids are accepted only in the Google format", () => {
  assert.equal(parseMeasurementId("G-ABCD1234"), "G-ABCD1234");
  assert.equal(parseMeasurementId(""), "");
  assert.equal(parseMeasurementId(undefined), "");
  assert.equal(parseMeasurementId("UA-12345-1"), "");
  assert.equal(parseMeasurementId("G-AB'+alert(1)+'"), "");
  assert.equal(parseMeasurementId("G-ABCD1234;x"), "");
});

test("consent starts unset and ignores unknown stored values", () => {
  assert.equal(readConsent(), null);
  store.set(CONSENT_KEY, "maybe");
  assert.equal(readConsent(), null);
});

test("consent round trips", () => {
  writeConsent("granted");
  assert.equal(readConsent(), "granted");
  writeConsent("denied");
  assert.equal(readConsent(), "denied");
});

test("storage failures never throw", () => {
  g.window = {
    localStorage: {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    },
  };
  assert.equal(readConsent(), null);
  assert.doesNotThrow(() => writeConsent("granted"));
});

test("no event is sent without consent", () => {
  trackEvent("faq_expand", { question_id: "x" });
  writeConsent("denied");
  trackEvent("faq_expand", { question_id: "x" });
  assert.deepEqual(calls, []);
});

test("events are sent once consent is granted", () => {
  writeConsent("granted");
  trackEvent("brand_website_click", { label: "harbor-grill" });
  trackEvent("contact_form_submit");
  assert.deepEqual(calls, [
    ["event", "brand_website_click", { label: "harbor-grill" }],
    ["event", "contact_form_submit", {}],
  ]);
});

test("tracking is safe when analytics has not loaded or there is no window", () => {
  writeConsent("granted");
  delete (g.window as Record<string, unknown>).gtag;
  assert.doesNotThrow(() => trackEvent("site_search", { result_type: "brand" }));
  delete g.window;
  assert.doesNotThrow(() => trackEvent("site_search"));
});

test("only known event names are recognised", () => {
  assert.equal(isAnalyticsEvent("faq_expand"), true);
  assert.equal(isAnalyticsEvent("purchase"), false);
  assert.equal(isAnalyticsEvent(undefined), false);
});
