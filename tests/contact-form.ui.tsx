import { createChecker, setupDom } from "./helpers/dom";

async function main() {
  const dom = setupDom();
  const doc = dom.window.document;
  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { ContactForm } = await import("@/components/forms/ContactForm");
  const { departments } = await import("@/data/contact");
  const { check, finish } = createChecker();
  const act = React.act;

  const root = createRoot(doc.getElementById("root")!);
  await act(async () => {
    root.render(React.createElement(ContactForm, { departments }));
  });

  const field = (name: string) => doc.querySelector(`[name="${name}"]`) as HTMLInputElement;
  const setValue = async (el: Element, value: string, proto: object, type: string) => {
    const setter = Object.getOwnPropertyDescriptor(proto, "value")!.set!;
    await act(async () => {
      setter.call(el, value);
      el.dispatchEvent(new dom.window.Event(type, { bubbles: true }));
    });
  };
  const fill = async (values: Record<string, string>) => {
    await setValue(
      field("name"),
      values.name ?? "",
      dom.window.HTMLInputElement.prototype,
      "input",
    );
    await setValue(
      field("email"),
      values.email ?? "",
      dom.window.HTMLInputElement.prototype,
      "input",
    );
    await setValue(
      field("department"),
      values.department ?? "",
      dom.window.HTMLSelectElement.prototype,
      "change",
    );
    await setValue(
      field("message"),
      values.message ?? "",
      dom.window.HTMLTextAreaElement.prototype,
      "input",
    );
  };
  const submit = async () => {
    await act(async () => {
      doc
        .querySelector("form")!
        .dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
    });
  };
  const summary = () => doc.querySelector('[role="alert"]') as HTMLElement | null;
  const live = () => doc.querySelector('[role="status"]')?.textContent ?? "";

  check("no errors shown initially", summary() === null);

  await submit();
  check(
    "empty submit shows error summary",
    summary() !== null && summary()!.textContent!.includes("There is a problem"),
  );
  check("summary lists all four fields", summary()!.querySelectorAll("li").length === 4);
  check("summary receives focus", doc.activeElement === summary());
  check(
    "fields are marked invalid",
    ["name", "email", "department", "message"].every(
      (n) => field(n).getAttribute("aria-invalid") === "true",
    ),
  );
  check(
    "error text is linked to its field",
    (field("email").getAttribute("aria-describedby") ?? "").includes("-error"),
  );

  summary()!
    .querySelector("a")!
    .dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
  check("summary link moves focus to the field", doc.activeElement === field("name"));

  await fill({
    name: "Ada",
    email: "bad-email",
    department: "media",
    message: "A valid long message.",
  });
  await submit();
  check(
    "bad email is the only error",
    summary()!.querySelectorAll("li").length === 1 &&
      summary()!.textContent!.includes("name@example.com"),
  );
  check("other fields are valid again", field("name").getAttribute("aria-invalid") === "false");

  await fill({
    name: "Ada",
    email: "ada@example.com",
    department: "media",
    message: "A valid long message.",
  });
  await submit();
  check("no summary after a valid submit", summary() === null);
  check(
    "unconfigured form says it was not sent",
    live().includes("not connected") && live().includes("not sent"),
  );
  check("unconfigured form never claims success", !live().includes("Thank you"));
  check("values are kept when unavailable", field("name").value === "Ada");

  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT = "https://example.com/contact";
  let release: () => void = () => {};
  globalThis.fetch = (() =>
    new Promise<Response>((resolve) => {
      release = () => resolve(new Response(null, { status: 200 }));
    })) as typeof fetch;
  await submit();
  const button = doc.querySelector('button[type="submit"]') as HTMLButtonElement;
  check(
    "button is disabled and busy while sending",
    button.disabled &&
      button.getAttribute("aria-busy") === "true" &&
      button.textContent === "Sending...",
  );
  await act(async () => {
    release();
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  check("success message appears when the endpoint accepts", live().includes("Thank you"));
  check(
    "form is cleared after success",
    field("name").value === "" && field("message").value === "",
  );

  globalThis.fetch = (async () => new Response(null, { status: 500 })) as typeof fetch;
  await fill({
    name: "Ada",
    email: "ada@example.com",
    department: "general",
    message: "Another valid message.",
  });
  await submit();
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  check(
    "failed send shows an error and keeps details",
    live().includes("could not be sent") && field("name").value === "Ada",
  );

  finish();
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
