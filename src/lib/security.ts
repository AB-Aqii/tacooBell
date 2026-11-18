type CspOptions = {
  isDevelopment: boolean;
  analyticsEnabled: boolean;
  contactEndpoint?: string;
};

type HeaderOptions = CspOptions & { enforceCsp: boolean };

const analyticsScript = ["https://www.googletagmanager.com"];
const analyticsConnect = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
];
const analyticsImages = ["https://www.google-analytics.com", "https://*.google-analytics.com"];

function originOf(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.origin : undefined;
  } catch {
    return undefined;
  }
}

export function buildCsp({ isDevelopment, analyticsEnabled, contactEndpoint }: CspOptions): string {
  const contactOrigin = originOf(contactEndpoint);

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
      ...(analyticsEnabled ? analyticsScript : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", ...(analyticsEnabled ? analyticsImages : [])],
    "font-src": ["'self'", "data:"],
    "connect-src": [
      "'self'",
      ...(contactOrigin ? [contactOrigin] : []),
      ...(analyticsEnabled ? analyticsConnect : []),
      ...(isDevelopment ? ["ws:", "wss:"] : []),
    ],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "object-src": ["'none'"],
    ...(isDevelopment ? {} : { "upgrade-insecure-requests": [] }),
  };

  return Object.entries(directives)
    .map(([name, values]) => (values.length > 0 ? `${name} ${values.join(" ")}` : name))
    .join("; ");
}

export function buildSecurityHeaders(options: HeaderOptions): { key: string; value: string }[] {
  const headers = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];

  if (!options.isDevelopment) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains",
    });
    headers.push({
      key: options.enforceCsp ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
      value: buildCsp(options),
    });
  }

  return headers;
}
