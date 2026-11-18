# Global Food Group

Corporate brand portfolio platform. Next.js App Router, React, strict TypeScript, Tailwind CSS.

"Global Food Group" is a placeholder name. Change it in `src/data/site.ts`.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `format`, `format:check`, `test` (runs `test:unit` and `test:ui`).

## Environment

| Variable                        | Purpose                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`          | Base URL for canonical links and Open Graph                                                      |
| `NEXT_PUBLIC_ALLOW_INDEXING`    | `true` only on the production site. Any other value sends noindex                                |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 ID (G-XXXX). Empty means no analytics code, banner or cookies                 |
| `NEXT_PUBLIC_GSC_VERIFICATION`  | Google Search Console verification token. Optional                                               |
| `CSP_ENFORCE`                   | `true` enforces the Content Security Policy. Any other value sends it as report-only             |
| `NEXT_PUBLIC_CONTACT_ENDPOINT`  | URL that accepts the contact form as JSON. Empty means the form reports that it is not connected |

## Structure

- `src/app` routes and layouts
- `src/components` UI split by area: `layout`, `navigation`, `ui`, and later `homepage`, `brands`, `news`, `faq`, `forms`, `seo`
- `src/data` site config and navigation. Content lives here, not in components
- `src/lib` helpers: `seo.ts` builds page metadata, `cn.ts` joins class names
- `src/types` shared types
- `src/styles/globals.css` design tokens as CSS variables, read by Tailwind in `tailwind.config.ts`

## Design tokens

Colors are RGB triplets in `:root` in `globals.css`. Change a value there to change it everywhere. Type sizes are in `tailwind.config.ts` under `fontSize`.

## Page metadata

```ts
export const metadata = buildMetadata({
  title: "Our Brands",
  description: "...",
  path: "/brands",
});
```

## Brands

Brand content lives in `src/data/brands.ts`. Each brand has a card summary and a `profile` for its page at `/brands/[slug]`. Fields set to `null` or an empty list show a plain "will be added once verified" line on the page.

- Add `region` to a brand and the Country or region filter appears in the directory
- Add `website` and the card and page link to the official site
- Add `logo` and the card and page use it in place of the monogram
- Set `seo.title` or `seo.description` to override the generated metadata
- Brand FAQs are built in `src/lib/brand-faqs.ts` from the brand's data. Ownership, founding and franchise answers are not generated

## Corporate pages

Content for About, Leadership, Investors, Sustainability, Careers and Contact lives in `src/data/`. Placeholders are marked `pending` or left `null`, and each page shows a plain "to be confirmed" or empty state until real data is added.

- `leaders` in `leadership.ts`: add profiles to fill the Leadership page
- `financialOverview` in `investors.ts`: set value, period, currency, units and source together
- `reportGroups` and `announcementGroups`: add documents with a `url`
- `positions` and `applicationUrl` in `careers.ts`: add official job links only
- `timeline` in `about.ts`: replace placeholder entries with verified dates

## Contact form

Validation is in `src/lib/contact-schema.ts` (Zod) and can be reused by a server endpoint. `src/lib/contact.ts` posts to `NEXT_PUBLIC_CONTACT_ENDPOINT`. Without it the form validates and then says the message was not sent. It never reports success on its own.

## News

Articles live in `src/data/news.ts` with a body made of titled sections. Reading time is computed from the text. Exactly one article should have `featured: true`. Set `image` to show a featured image, `brandSlug` to link a brand, and `updatedAt` to show an updated date. Categories are fixed in `src/types/news.ts`, and a category with no articles shows its own empty message.

The directory filters in the browser. A hash such as `/news#brand-announcements` selects that category.

## Search

The header search dialog (also Ctrl or Cmd+K) loads `/api/search-index` on first use. That route is built from the same data files in `src/lib/search/build-index.ts`, so new brands, articles, FAQs, leaders and investor documents are indexed automatically. Static page entries and popular-search suggestions are in `src/data/search.ts`.

The UI talks to a `SearchProvider` (`src/lib/search/types.ts`). To use a search service later, implement `search(query, limit)` against it and pass it to `SearchDialog`.

## FAQ

Questions are in `src/data/faqs.ts`. Questions about ownership, finance, headquarters and franchises say plainly that the information has not been published. Replace those answers only with verified facts. `relatedIds` link related questions, and `homepage: true` shows a question on the homepage.

## Tests

`npm test` runs the unit tests (`tests/*.test.ts`) and the interaction tests (`tests/*.ui.tsx`), which render components in a simulated browser. They do not replace testing in a real browser.

## SEO and indexing

- `NEXT_PUBLIC_SITE_URL` must be the production origin at build time. Canonicals, the sitemap, Open Graph and structured data all use it
- `/robots.txt` blocks all crawlers unless `NEXT_PUBLIC_ALLOW_INDEXING=true`. Pages also send `noindex` until then. In production it allows crawling, blocks `/api/` and lists the sitemap
- `/sitemap.xml` comes from `src/lib/sitemap.ts`. Dates appear only where the data has them. Add public routes to `src/data/routes.ts`
- JSON-LD is built in `src/lib/structured-data.ts` from visible page content only: Organization and WebSite on the homepage, BreadcrumbList on pages with breadcrumbs, AboutPage, ContactPage, WebPage with Brand on brand pages, NewsArticle on articles, and Person for leaders once they exist. There is no FAQ markup
- Share images are generated per page (`opengraph-image.tsx`). Replace them with designed artwork when available
- Permanent redirects go in `src/data/redirects.ts`
- Languages: `siteConfig.locales` holds one language, so no hreflang tags are written. Adding a second locale makes `getAlternateLanguages` emit them, but the localized pages themselves must exist first

## Security

Headers are built in `src/lib/security.ts`. The Content Security Policy ships as report-only. Load the site in a browser with the console open, confirm there are no violations, then set `CSP_ENFORCE=true`. It allows inline scripts, because nonces would force every page to render per request. Analytics hosts and the contact endpoint origin are added only when configured.

## Analytics

Nothing loads unless `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. The visitor then sees a banner with equal Accept and Decline buttons, and Google's script loads only after Accept. Cookie settings in the footer reopens the choice.

Events: `brand_website_click`, `site_search` (result type and query length only, never the words typed), `faq_expand`, `contact_form_submit`, `investor_resource_click` and `career_link_click`. Add `data-track-event` and `data-track-label` to a link to track it. Page views come from Google's automatic history tracking.

## Audit

```bash
npm run build && npm start
npm run audit:site -- http://localhost:3000
```

The audit crawls the site and checks every sitemap URL for orphans, broken links, titles, descriptions, canonicals, headings, Open Graph, JSON-LD, image alt text and basic accessibility, and reports initial transfer size per page. It uses a simulated DOM, so it does not measure Core Web Vitals or color contrast. Use PageSpeed Insights and a browser accessibility checker for those.

## Status

Phases 1 to 6 are complete: foundation, homepage, brands, corporate pages, news, search and FAQ, and SEO, security and analytics preparation.

Brands, news articles and other company facts are sample entries or placeholders until verified information is added in `src/data/`.
