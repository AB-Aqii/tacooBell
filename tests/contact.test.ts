import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { validateContact } from "@/lib/contact-schema";
import { sendContactMessage } from "@/lib/contact";

const valid = {
  name: "  Ada Lovelace ",
  email: " ada@example.com ",
  department: "media",
  message: "  Hello, I have a press question.  ",
};

const input = {
  name: "Ada",
  email: "ada@example.com",
  department: "general" as const,
  message: "A valid message here.",
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  delete process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
  globalThis.fetch = originalFetch;
});

test("accepts a valid submission and trims whitespace", () => {
  const result = validateContact(valid);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.name, "Ada Lovelace");
    assert.equal(result.data.email, "ada@example.com");
    assert.equal(result.data.message, "Hello, I have a press question.");
  }
});

test("reports one clear message per empty field", () => {
  const result = validateContact({ name: "", email: "", department: "", message: "" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errors.name, "Enter your full name.");
    assert.equal(result.errors.email, "Enter your email address.");
    assert.equal(result.errors.department, "Choose a department.");
    assert.equal(result.errors.message, "Enter a message of at least 10 characters.");
  }
});

test("rejects a malformed email address", () => {
  const result = validateContact({ ...valid, email: "not-an-email" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.errors.email ?? "", /name@example\.com/);
});

test("rejects short and overlong messages", () => {
  const short = validateContact({ ...valid, message: "Too short" });
  const long = validateContact({ ...valid, message: "x".repeat(2001) });
  assert.equal(short.ok, false);
  assert.equal(long.ok, false);
  if (!long.ok) assert.match(long.errors.message ?? "", /2,000/);
});

test("rejects an unknown department", () => {
  const result = validateContact({ ...valid, department: "sales" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.errors.department, "Choose a department.");
});

test("reports unavailable when no endpoint is configured", async () => {
  assert.deepEqual(await sendContactMessage(input), { status: "unavailable" });
});

test("reports success only when the endpoint accepts the message", async () => {
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT = "https://example.com/contact";
  let body = "";
  globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
    body = String(init?.body);
    return new Response(null, { status: 200 });
  }) as typeof fetch;
  assert.deepEqual(await sendContactMessage(input), { status: "success" });
  assert.equal(JSON.parse(body).email, "ada@example.com");
});

test("reports an error for failed responses and network failures", async () => {
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT = "https://example.com/contact";
  globalThis.fetch = (async () => new Response(null, { status: 500 })) as typeof fetch;
  assert.deepEqual(await sendContactMessage(input), { status: "error" });
  globalThis.fetch = (async () => {
    throw new TypeError("network down");
  }) as typeof fetch;
  assert.deepEqual(await sendContactMessage(input), { status: "error" });
});
