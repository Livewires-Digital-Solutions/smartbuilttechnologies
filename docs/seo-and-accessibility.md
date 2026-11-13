# Search, answer engines and accessibility

What the site does to be found (Google, Bing), quoted (AI assistants such as ChatGPT, Claude, Perplexity and Google's AI answers) and used by everyone, and what to do when it goes live.

## Before launch (needs you)

1. **Set `SITE_URL`** in the server's `.env` to the real address, for example `https://www.smartbuilttech.com`. Every canonical link, the sitemap, the social cards and the structured data are built from it. The placeholder domain is only a fallback.
2. **Replace the placeholder details** in `src/content/site.ts`: phone, email addresses and the Chennai street address. They are shown on the contact page and in the footer. They are deliberately **not** put into structured data (a placeholder phone number there would be worse than none). Once real, add `telephone`, `email` and a full `address` to `organizationJsonLd()` in `src/lib/jsonld.tsx`.
3. **Search Console and Bing Webmaster Tools:** add the site, put the verification codes in `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` (see `.env.example`), then submit `https://<site>/sitemap.xml`.
4. **Have the privacy notice reviewed** by a lawyer (`src/content/privacy.ts`), then set `reviewed: true`. The 12-month CV retention is a proposal; deleting older applications is done by hand in the admin area.
5. **Social profiles:** when SBT has company pages (LinkedIn and others), add them to `socials` in `site.ts`. They become `sameAs` links, which help search engines and assistants tell the company apart from similar names.

## What is in place

| Need | Where |
| --- | --- |
| Crawl rules, with AI crawlers named and allowed | `/robots.txt` (`src/app/robots.ts`); `/sys-ops` and `/api` are disallowed |
| Every public page, with last-edited dates for posts, events and jobs | `/sitemap.xml` (`src/app/sitemap.ts`) |
| A plain-text map for AI assistants | `/llms.txt` (`src/app/llms.txt/route.ts`): the facts about the company and links to each page |
| Blog feed | `/blog/feed.xml` (linked from the blog page's head) |
| One title, description, canonical address and social card per page | `pageMetadata()` in `src/lib/seo.ts`; titles are kept near 60 characters and descriptions at 160 or fewer |
| A link-preview picture on every page | `src/app/opengraph-image.tsx` (generated), or the page's own cover picture |
| Structured data | `src/lib/jsonld.tsx`: one Organization (shared by `@id`), WebSite, WebPage types per page, BreadcrumbList, ItemList, Service, FAQPage, BlogPosting or NewsArticle, Event, JobPosting |
| Old addresses | `/insights` redirects permanently to `/events` |
| Not found and error pages | `src/app/not-found.tsx`, `src/app/(site)/error.tsx`; marked noindex |

**The client-review copy on Vercel is not indexed.** When the `VERCEL` environment variable is present the site sends `X-Robots-Tag: noindex`, serves a `Disallow: /` robots file and hides `llms.txt`. The VPS is indexed.

Unknown addresses under `/blog`, `/events` and `/careers` show a "not found" page with status 200 and a noindex tag (a limit of how these request-time pages are streamed). They are not in the sitemap.

## Accessibility

Built to WCAG 2.2 level AA and checked with automated scans (axe: no issues on any page at desktop and phone width), keyboard walk-throughs, 320 px reflow, tap-target sizes and reduced motion.

- A "Skip to content" link, one `main`, labelled navigation landmarks, one `h1` per page and no skipped heading levels.
- A visible focus ring everywhere, including form fields.
- Text contrast of at least 4.5:1 and form borders of at least 3:1.
- Tap targets of at least 24 px (most 44 px); links never rely on colour alone.
- Reduced motion: smooth scrolling, reveals and the hero animation are switched off.
- The mobile menu is a dialog: focus moves into it, Escape closes it and returns focus to the Menu button.
- Forms: every field has a label, errors are announced and linked to their field, and focus moves to the first error.
- No time limits, no auto-playing media, no content that flashes.

## Keeping it that way

- Give every picture a real `alt` (the admin editors have an alt field); leave it empty only for pure decoration.
- Write a one-sentence summary for every post and event (it becomes the search description).
- Keep one `h1` per page; headings go down one level at a time.
