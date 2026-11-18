import assert from "node:assert/strict";
import { test } from "node:test";
import { buildCsp, buildSecurityHeaders } from "@/lib/security";

const base = { isDevelopment: false, analyticsEnabled: false };

test("production policy is strict by default", () => {
  const csp = buildCsp(base);
  assert.ok(csp.includes("default-src 'self'"));
  assert.ok(csp.includes("object-src 'none'"));
  assert.ok(csp.includes("frame-ancestors 'none'"));
  assert.ok(csp.includes("base-uri 'self'"));
  assert.ok(csp.includes("upgrade-insecure-requests"));
  assert.equal(csp.includes("unsafe-eval"), false);
  assert.equal(csp.includes("googletagmanager"), false);
  assert.equal(csp.includes("*"), false);
});

test("development allows eval and websockets for hot reload only", () => {
  const csp = buildCsp({ ...base, isDevelopment: true });
  assert.ok(csp.includes("'unsafe-eval'"));
  assert.ok(csp.includes("ws:"));
  assert.equal(csp.includes("upgrade-insecure-requests"), false);
});

test("analytics hosts are added only when analytics is enabled", () => {
  const csp = buildCsp({ ...base, analyticsEnabled: true });
  assert.ok(csp.includes("script-src 'self' 'unsafe-inline' https://www.googletagmanager.com"));
  assert.ok(csp.includes("https://*.google-analytics.com"));
});

test("the contact endpoint origin is allowed, and invalid endpoints are ignored", () => {
  assert.ok(
    buildCsp({ ...base, contactEndpoint: "https://forms.example.com/v1/send?x=1" }).includes(
      "connect-src 'self' https://forms.example.com;",
    ),
  );
  const invalid = buildCsp({ ...base, contactEndpoint: "javascript:alert(1)" });
  assert.equal(invalid.includes("javascript"), false);
  assert.ok(invalid.includes("connect-src 'self';"));
  assert.ok(buildCsp({ ...base, contactEndpoint: "not a url" }).includes("connect-src 'self';"));
});

test("the policy is report-only until enforcement is requested", () => {
  const reportOnly = buildSecurityHeaders({ ...base, enforceCsp: false });
  assert.ok(reportOnly.some((h) => h.key === "Content-Security-Policy-Report-Only"));
  assert.equal(
    reportOnly.some((h) => h.key === "Content-Security-Policy"),
    false,
  );
  const enforced = buildSecurityHeaders({ ...base, enforceCsp: true });
  assert.ok(enforced.some((h) => h.key === "Content-Security-Policy"));
});

test("core security headers are always present and HSTS is production only", () => {
  const prod = buildSecurityHeaders({ ...base, enforceCsp: false }).map((h) => h.key);
  for (const key of [
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Cross-Origin-Opener-Policy",
    "Strict-Transport-Security",
  ]) {
    assert.ok(prod.includes(key), key);
  }
  const dev = buildSecurityHeaders({ ...base, isDevelopment: true, enforceCsp: true }).map(
    (h) => h.key,
  );
  assert.equal(dev.includes("Strict-Transport-Security"), false);
  assert.equal(
    dev.some((k) => k.startsWith("Content-Security-Policy")),
    false,
  );
});
