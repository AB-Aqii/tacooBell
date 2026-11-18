import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: token("primary"), soft: token("primary-soft") },
        accent: token("accent"),
        background: token("background"),
        surface: token("surface"),
        foreground: token("foreground"),
        muted: token("muted"),
        border: token("border"),
        focus: token("focus"),
        danger: token("danger"),
        success: token("success"),
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: [
          "clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "700" },
        ],
        "heading-1": [
          "clamp(2rem, 1.5rem + 2vw, 3rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "heading-2": [
          "clamp(1.5rem, 1.25rem + 1vw, 2.25rem)",
          { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" },
        ],
        "heading-3": ["1.25rem", { lineHeight: "1.35", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        body: ["1rem", { lineHeight: "1.65" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [],
};

export default config;
