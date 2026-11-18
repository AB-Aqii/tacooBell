import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { footerGroups, headerCta, primaryNav } from "@/data/navigation";

const routesBuiltInLaterPhases = ["/news"];

const hrefs = [
  ...primaryNav.flatMap((item) => [item.href, ...(item.children ?? []).map((c) => c.href)]),
  headerCta.href,
  ...footerGroups.flatMap((group) => group.links.map((link) => link.href)),
];

test("every navigation link points to an existing route or a later phase", () => {
  for (const href of new Set(hrefs)) {
    const path = href.split("#")[0] ?? href;
    if (path === "/" || routesBuiltInLaterPhases.includes(path)) continue;
    const page = join(process.cwd(), "src/app", path, "page.tsx");
    assert.ok(existsSync(page), `${href} has no page at ${page}`);
  }
});

test("navigation has no placeholder hrefs", () => {
  for (const href of hrefs) assert.notEqual(href, "#");
});
