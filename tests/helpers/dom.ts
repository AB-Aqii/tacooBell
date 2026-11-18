import { JSDOM } from "jsdom";

export function setupDom(url = "http://localhost/") {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    pretendToBeVisual: true,
    url,
  });
  const g = globalThis as Record<string, unknown>;
  g.window = dom.window;
  g.document = dom.window.document;
  g.self = dom.window;
  g.HTMLElement = dom.window.HTMLElement;
  g.Node = dom.window.Node;
  g.IS_REACT_ACT_ENVIRONMENT = true;
  Object.defineProperty(globalThis, "navigator", {
    value: dom.window.navigator,
    configurable: true,
  });

  const dialog = dom.window.HTMLDialogElement.prototype as unknown as {
    showModal: () => void;
    close: () => void;
  };
  dialog.showModal = function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  dialog.close = function (this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new dom.window.Event("close"));
  };
  return dom;
}

type Act = (callback: () => Promise<void>) => Promise<unknown>;

export function createActions(dom: JSDOM, act: Act) {
  const win = dom.window;

  const setValue = async (element: Element, value: string) => {
    const isSelect = element instanceof win.HTMLSelectElement;
    const isArea = element instanceof win.HTMLTextAreaElement;
    const proto = isSelect
      ? win.HTMLSelectElement.prototype
      : isArea
        ? win.HTMLTextAreaElement.prototype
        : win.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")!.set!;
    await act(async () => {
      setter.call(element, value);
      element.dispatchEvent(new win.Event(isSelect ? "change" : "input", { bubbles: true }));
    });
  };

  const click = async (element: Element) => {
    await act(async () => {
      element.dispatchEvent(new win.MouseEvent("click", { bubbles: true, cancelable: true }));
    });
  };

  const press = async (element: Element, key: string, init: KeyboardEventInit = {}) => {
    await act(async () => {
      element.dispatchEvent(
        new win.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }),
      );
    });
  };

  const settle = async (ms = 30) => {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, ms));
    });
  };

  const buttonByText = (text: string, exact = false) =>
    [...win.document.querySelectorAll("button")].find((button) =>
      exact ? button.textContent === text : button.textContent?.includes(text),
    );

  return { setValue, click, press, settle, buttonByText };
}

export function createChecker() {
  const results: string[] = [];
  return {
    check(name: string, ok: boolean) {
      results.push(`${ok ? "PASS" : "FAIL"} ${name}`);
    },
    finish() {
      console.log(results.join("\n"));
      process.exit(results.some((line) => line.startsWith("FAIL")) ? 1 : 0);
    },
  };
}
