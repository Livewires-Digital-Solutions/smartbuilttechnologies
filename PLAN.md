# Smart Built Technologies — Website Plan

> Version 1.1 · 10 Nov 2026 · Status: **Approved, building on the recommended defaults in §1**
> Stack: Next.js 16.4 (App Router, Cache Components) · React 19 · TypeScript (strict) · Tailwind CSS v4
> Sources: SBT Brand Guidelines v1.0, Typography System v1.0, Colour System v1.0, Graphic Language v1.0, full crawl of txgksa.com (all 27 sitemap URLs).

## Progress log

| Date | Phase | Done | Waiting on |
|---|---|---|---|
| 10 Nov 2026 | 1 · Foundation | Project set up; tokens in `globals.css` (Tailwind default palette removed); Plus Jakarta Sans self-hosted; **logo, four lockups and 16 brand icons extracted as vectors from the brand PDFs** (`src/components/brand/*-data.ts`); 76 TXG assets migrated; typed content (site, pathways, services, 22 projects, clients, partners, accreditations, events, navigation); UI kit; header with mega-menu and mobile sheet; footer; `/kit` review page (dev only) | Review of `/kit` |
| 10 Nov 2026 | 2 · Home | H-01 Hero and H-09 Closing CTA built | Review of H-01; then H-02 Statement |
| 10 Nov 2026 | 2 · Home (direction v2) | v1 rejected as template-like. **Editorial direction v2** adopted on its recommended defaults: IBM Plex Mono added for labels and data, display/H1 at weight 500, 2px buttons, paper-first surfaces. H-01 rebuilt as a paper "opening sheet" (KAFD photo, grid references, title block); H-02 built as the "Who we are" overview with footnoted figures and offices; header nav and CTA made plain text | Review of H-01 and H-02; brand sign-off on the four deviations; then H-03 Capabilities index |
| 11 Nov 2026 | 2 · Home (rebuilt) | All earlier home versions and the five glass/scroll concepts deleted (glass rejected). **Home rebuilt in txgksa.com's section order**: hero · technology partners · about · accreditations · services · why choose us (BIM stages) · iconic projects · latest news · FAQ · closing CTA. Light editorial system: paper/white surfaces, one navy band, Plex Mono labels, 2px buttons. Motion is CSS-only and progressive: hero line-rise and photo uncover, hero parallax, reading-progress line, scroll-lit BIM stages, reveals. New content: `journal.ts`, `faq.ts` | Review of the home page; confirm ISO 19650 status (below); SBT-specific facts |
| 11 Nov 2026 | 2 · Home (hero) | Accreditations section removed from the home page (client request; `credentials.ts` data kept for About). Home hero rejected as too close to txgksa.com. Five new hero concepts built at `/heroes` (dev only): A Verbs · B Compare · C Layers · D Stages · E Need. Current home still uses the old hero | Pick a hero (or mix); then rework the remaining sections so the page stops mirroring TXG |
| 11 Nov 2026 | 2 · Home (restart) | Five wireframe versions and the hero concept routes rejected as too generic; restarted with a question round. Direction: bold and futuristic, light with one navy band, no glass, rich interaction, medium length (~8 sections), live prototype, SEO-optimised copy aimed at India/Chennai with a global reach. **New hero built**: real 3D (three.js, loaded on demand) building that assembles in four layers (model, scan, connect, hand over), clickable layers, SVG fallback for no-WebGL and reduced motion. Headline "Your building, modelled before it's built." under a keyword label in one H1. Home title, description and JSON-LD (WebSite, ProfessionalService) added | Review the hero; then redesign sections 2–8 in the same style with SEO copy; confirm domain and keyword priorities |
| 11 Nov 2026 | 2 · Home (hero v3) | Hero rebuilt as a **split left/right layout**: big headline and the four layers on the left, a tall 3D stage on the right. On wide screens the hero **pins and scroll drives the 3D** (building turns, camera moves to each layer, the list follows; clicking a layer scrolls to its moment). **Site-wide smooth scrolling with GSAP ScrollSmoother** (off for reduced motion; touch screens keep native scroll). CSS `position: sticky` does not work inside ScrollSmoother, so three sticky blocks (services preview, Why BIM, FAQ) now use a GSAP pin (`StickyPin`). Phones and tablets below 1024px do not pin | Review the hero and the smooth scroll; check the CSS scroll-driven effects (reveals, BIM stages) read well under smoothing |

**Findings from the build (added to §1):**
- **Project images are low resolution.** 14 of 22 are 572×586 px; NEOM Oxagon and Shura are 293×300 px. Layouts use portrait figures at ≤600 px until originals arrive. Request high-res originals.
- `txgksa.com/Company-Profile.pdf` returns 404 on TXG's own site.
- Client logo "RSG" (an "R" emblem) needs its full name confirmed.
- The brand PDFs draw the symbol as coarse polygons, with the Foundation traced from a raster. The large symbol has been smoothed for hero use; vector master files are still needed (§1 #3).
- **Certificate files were mislabelled.** The four published certificates are **ISO 27001:2022, ISO 9001:2015, ISO 45001:2018 and ISO 14001:2015**, issued to International TXG Pvt. Ltd. (Kerala) and Technical Xperts International Ltd. (Riyadh). TXG's file names called three of them "ISO 19650-1", "ISO 19650-2" and "ISO 9001". Files and labels are corrected. **No ISO 19650 certificate has been supplied**, yet the footer says "ISO 19650 certified delivery" and TXG says "ISO 19650 BIM Certified". Confirm the status and get the certificate, or reword to "delivers to ISO 19650".
- Technology partners identified: Autodesk, Bentley, Trimble, Leica, Esri, IBM Maximo, EcoDomus, YouBIM, BEXEL, Unity, Meta.

---

## 0. What we are building, in one paragraph

A new marketing site for **Smart Built Technologies (SBT)**, a Chennai-based company in the **Technical Xperts Group (TXG)**. It reuses TXG's content, projects, assets and sitemap. The design comes entirely from the SBT brand system: Midnight Navy leads, Signal Orange signals, Plus Jakarta Sans throughout, built on the 30° grid and the four nested pathways of the symbol. The style is **editorial**: the site should read like a well-made technical monograph, not a template. Every page is statically generated, loads fast on a mid-range phone on 4G, and meets WCAG 2.2 AA.

---

## 1. Decisions needed before build (open questions)

Each item has a recommendation, so work can start on the recommended default and change later.

| # | Question | Recommendation (default if no answer) |
|---|---|---|
| 1 | Domain, SBT email addresses, phone, Chennai street address | Use placeholders in `content/site.ts`; swap before launch. |
| 2 | **Attribution of TXG projects.** | **Decided by the client's messaging brief (11 Nov 2026).** Smart Built Technologies is presented as **the production hub of TXG Saudi Arabia**, never as a new, separate or independent company, and the TXG Saudi Arabia name appears in all branding. TXG's projects, years and track record are Smart Built's own experience, but every project reference is tied to TXG Saudi Arabia. The Chennai office is "newly opened" (a production centre); the company is never called new or a startup. Open: the brief writes "Smart Build Technology" while the brand files say "Smart Built Technologies" (confirm the name); legal entity name for the footer and policies. |
| 3 | Vector logo files (SVG/AI) for every lockup (primary, horizontal, stacked, symbol; full colour, inverse, one colour) | **Required.** The PDFs only contain rendered artwork. Until we have the vectors, use a traced placeholder and do not ship it. |
| 4 | Real headcount. TXG says both "200+" and "250+", and its breakdown counters render as "0+". | Use "250+ professionals across the group" once confirmed, plus a per-role breakdown. |
| 5 | The remaining 11 accreditation documents (TXG shows 15 but publishes only 4 ISO images). Any SBT/India-specific registrations (GST, Udyam/MSME, etc.)? | Launch with the 4 ISO certificates. The data model already supports all three categories. |
| 6 | Names of technology partners `partner_01`–`partner_11` (TXG gives no alt text) | Needed for alt text and accessibility. Likely Autodesk and similar; confirm. |
| 7 | Photography. TXG reuses the same ~6 Unsplash photos on every service page. | Use real project images where they exist. Service pages get **diagrams and icons instead of stock photos** (see §6). Plan a photo shoot following the Graphic Language photo rules. |
| 8 | Downloadable PDFs: Quick Profile, Company Profile, Prequalification (SBT versions) | TXG has `/Company-Profile.pdf`. Ship SBT versions or hide the block. |
| 9 | SBT social accounts | Hide the social row until they exist. Do not link TXG's accounts as SBT's. |
| 10 | Who updates the blog, careers and events after launch? | v1: typed content files plus MDX in the repo (fastest, zero cost). v2: add a headless CMS (Sanity or Payload) if non-developers need to edit. |
| 11 | Languages | English only in v1. Routes are structured so an `/ar` locale can be added later. |
| 12 | Hosting | Vercel (Mumbai `bom1` region, close to the Chennai audience), or self-hosted Node behind nginx as TXG does. |

---

## 2. Audit of txgksa.com: what to keep, what to fix

### Keep (content and structure)
- The full sitemap and URL slugs (see §4), so users and search engines see the same structure.
- All 22 projects with client, location and scope; the 9 services and their sub-services; 9 events; 6 articles; the FAQ themes; ISO 19650 positioning; client and partner logos.
- The service page logic (definition → why us → what we deliver → CTA), which works well. We redesign it rather than replace it.

### Fix (problems found during the crawl)
| Problem on TXG | SBT approach |
|---|---|
| Stat counters render **"0 +"** until JS runs (and in search snippets) | Real numbers rendered on the server. No count-up animations. |
| Logo marquee duplicates every logo in the markup, so screen readers read 22 logos twice | Static, ruled logo grid. Each logo appears once. |
| Same 6 stock photos repeated on all 9 service pages | Brand icons, isometric illustrations and technical diagrams. Photography only where it is real. |
| `/careers/bim-modeler` and `/careers/bim-coordinator-mechanical` show the generic careers page | Real job description pages with `JobPosting` structured data. |
| Phone field: an 80-option `<select>` of flags | Searchable country-code combobox, defaulting to +91. |
| 2023 blog posts are one paragraph long (thin content) | Expand the posts or merge them into longer guides. Mark any still thin with `noindex` until expanded. |
| Absolute claims ("100% reduction in spatial clashes", "top BIM company", "paramount partner", "world-class") | A precise, verifiable voice (see §8). |
| Nav label "Events" points to `/insights` | Keep the URL, keep the label "Events" (consistent with the original). |
| No privacy page despite forms collecting personal data | Add `/privacy` (India DPDP Act 2023). This is the only addition to the sitemap. |
| A "More articles" link to "GIS and BIM Integration…" that has no page in the sitemap | Write it as a 7th article, or drop the link. |

---

## 3. Brand system as code (tokens)

Taken directly from the PDFs. These are the **only** values the UI uses.

### 3.1 Colour

```css
/* src/styles/tokens.css — referenced by Tailwind v4 @theme */
:root {
  /* Brand palette (Colour System p.2) */
  --navy:   #0C1446;  /* Midnight Navy — primary: text, headlines, dark backgrounds */
  --cobalt: #315BDB;  /* Cobalt Blue — secondary: links, digital layers, charts */
  --sky:    #8BBDFB;  /* Sky Blue — support: highlights on dark, data */
  --orange: #FF5200;  /* Signal Orange — accent: ONE focal point per view */
  --paper:  #F8FAFD;  /* Off White — base */
  --white:  #FFFFFF;

  /* Neutrals (Colour System p.5) */
  --slate-700: #3D4556; /* secondary text */
  --slate-500: #6E7787; /* captions, placeholders */
  --slate-300: #CBD2DF; /* dividers, input borders */
  --slate-200: #E3E7EF; /* card borders, hairlines */

  /* Tints (Colour System p.4): fills, backgrounds and chart series only, never text */
  --navy-10: #E7E8ED;  --navy-20: #CED0DA;  --navy-40: #9EA1B5;  --navy-60: #6D7290;  --navy-80: #3D436B;
  --cobalt-10: #EAEFFB; --cobalt-20: #D6DEF8; --cobalt-40: #ADBDF1; --cobalt-60: #839DE9; --cobalt-80: #5A7CE2;
  --sky-10: #F3F8FF;   --sky-20: #E8F2FE;   --sky-40: #D1E5FD;   --sky-60: #B9D7FD;   --sky-80: #A2CAFC;
  --orange-10: #FFEEE6; --orange-20: #FFDCCC; --orange-40: #FFBA99; --orange-60: #FF9766; --orange-80: #FF7533;

  /* Logo-only values (Colour System p.8): used ONLY inside symbol artwork */
  --logo-digital: #1D6BF3;
  --logo-precision: #7CC0FA;
  --logo-foundation: linear-gradient(to top right, #0C1446, #1E64F0);

  /* Status (UI only; orange is never a status colour) */
  --success: #13805F; --warning: #B7791F; --error: #D92D20; --info: var(--cobalt); /* hex sampled from PDF, confirm */
}
```

**Contrast rules (Colour System p.6–7), enforced in components:**

| Pair | Ratio | Use |
|---|---|---|
| Navy on white / paper | 17.4 / 16.7 | Body, headings |
| White on navy | 17.4 | Dark sections |
| Sky on navy | 8.9 | Highlights and data on dark |
| Cobalt on paper | 5.5 | Links |
| White on cobalt | 5.8 | Cobalt bands |
| **Navy on orange** | 5.4 | **Orange button labels are navy, not white** |
| Orange on navy | 5.4 | Overlines, figures and the tagline full stop on dark |
| Orange on white | 3.3 ✗ | **Large text only** (≥24px, or ≥18.66px bold) |
| Sky on white, orange on cobalt, sky on cobalt | ✗ | Never |

> ⚠️ **Deliberate deviation from the PDFs.** The guidelines show 13px orange overlines on white, which fails AA (3.3:1). On light backgrounds, overlines are **navy text led by an orange slash**, the "**/** 01 · BRAND MARK" device used on every guideline page. Orange overline text is used only on navy. The result is on-brand and accessible.

**Proportion per page (Colour System p.3):** about 40% off white, 35% navy, 12% cobalt, 8% sky, 5% orange. One orange focal point per view: one CTA, one key figure, or one node.

### 3.2 Typography

Plus Jakarta Sans only, self-hosted through `next/font` (latin subset, variable weight 400–800, plus the italic file loaded only where quotes appear). Fallback stack: `system-ui, -apple-system, "Segoe UI", Arial, sans-serif`.

| Token | Desktop (1440) | Mobile (360) | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|---|
| `display` | 72px | 44px | 800 | 1.05 | −2.5% | Hero statements only |
| `h1` | 48px | 34px | 800 | 1.1 | −2% | Page and section titles |
| `h2` | 32px | 26px | 700 | 1.2 | −1% | Sub-sections |
| `h3` | 22px | 20px | 700 | 1.3 | 0 | Cards, table heads |
| `body-lg` | 20px | 18px | 400 | 1.5 | 0 | Ledes |
| `body` | 16px | 16px | 400 | 1.55 | 0 | Running text |
| `caption` | 13px | 13px | 500 | 1.4 | +1% | Notes, labels, footers |
| `overline` | 13px | 12px | 600 | 1.4 | +20%, UPPERCASE | Section labels |
| `figure` | display/h1 size | — | 800 | 1 | −2% | Key figures, `tabular-nums` |

Sizes are fluid between the mobile and desktop values using `clamp()`.

**Weights by job:** 800 for display and H1 · 700 for H2, H3 and emphasis · 600 for tagline, buttons and labels · 500 for captions and navigation · 400 for body · italic 400 for quotes only, never headings.

**Rules (Typography p.6):** left-align everything except short titles and the tagline · sentence case for headings · uppercase only for overlines and short labels · body measure 60–75 characters (`max-width: 68ch`) · no more than 3 sizes and 2 weights per section · no justified text, no forced hyphenation · `font-variant-numeric: tabular-nums` in tables, spec lists, dates and figures · body never below 14px.

### 3.3 Space, grid and shape

- **Grid:** 12 columns, 1440px max width. Outer margins 20 / 40 / 64px (mobile / tablet / desktop), gutters 16 / 24 / 32px.
- **Spacing scale (4px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- **Section rhythm:** 64–96px vertical padding on mobile, 128–160px on desktop.
- **Radii:** 14px for cards, media and diagram nodes (from the "rounded corners at 14px on nodes" rule); full pill for buttons and tags. Nothing sharp ("No sharp tips").
- **Lines:** 1px `--slate-200` hairlines on light, `rgba(255,255,255,.12)` on navy. Rules are the main structural device in the editorial layout. Card shadows are used sparingly; the logo never gets a shadow.
- **Angles:** every diagonal is 30°: diagram connectors, crops, the reveal motion axis.

### 3.4 Motion

- Easing: `--ease-out: cubic-bezier(.22,1,.36,1)`. Durations: 160ms (hover/press), 240ms (menus, accordions), 480ms (reveals), 700ms (hero symbol, once).
- Reveals: opacity plus a 12px translate **along the 30° axis**, triggered once per element, using CSS `animation-timeline: view()` where supported and a small IntersectionObserver fallback. Elements are never hidden from no-JS users.
- `prefers-reduced-motion`: every transform is removed; fades become instant.
- **Not used:** preloaders, scroll-jacking or smooth-scroll libraries, cursor followers, parallax on text, count-up numbers, typewriter text, marquees.

---

## 4. Sitemap and routes (mirrors txgksa.com)

```
/                                   Home
/about                              About us
/services                           Services index
  /services/bim                     BIM in design
  /services/reality-capture         Reality capture & scan to BIM
  /services/asset-management        Asset management systems  (#asset-tagging section)
  /services/cafm                    CAFM implementation
  /services/digital-twin            Digital twin & smart buildings
  /services/gis-smart-cities        GIS integration & smart cities
  /services/immersive-solutions     Immersive solutions (AR / VR / XR)
  /services/4d-simulation           4D construction & logistics simulation
  /services/it-services             IT services & infrastructure
/projects                           Projects (filterable; each project at /projects#<slug>)
/insights                           Events  (label "Events", URL kept)
/blog                               Journal index
  /blog/[slug]                      6 articles (+1 optional: gis-and-bim-integration)
/careers                            Careers
  /careers/[slug]                   bim-modeler, bim-coordinator-mechanical
/contact                            Contact
/privacy                            Privacy notice            ← only addition
/sitemap.xml  /robots.txt  /404
```

**Main navigation:** Home, About, Services (mega-menu), Projects, Events, Blog, Careers, plus a "Get in touch" button.

**Why projects stay at `/projects#slug` and do not get their own pages:** each project has only client, location, scope and one image. Separate pages would be thin. Projects open in a detail drawer with a shareable hash URL, which matches TXG's anchors (`/projects#riyadh-metro`). If case-study content is written later, `/projects/[slug]` can be added without breaking those links.

---

## 5. The design idea

### 5.1 Concept: "The four pathways, read as a monograph"

The SBT symbol is four nested pathways, and the brand already gives each one a meaning (Brand Guidelines p.2). **The site's information architecture follows the same four pathways**, so the logo, navigation, services and diagrams all tell one story:

| Pathway | Meaning | Logo colour | Services |
|---|---|---|---|
| **Foundation** | Build / structure | navy→cobalt gradient | BIM in design · 4D simulation |
| **Precision** | Scan / capture | sky `#7CC0FA` | Reality capture & scan to BIM · Asset tagging |
| **Digital layer** | Data / twin | blue `#1D6BF3` | Digital twin · GIS & smart cities · Immersive AR/VR/XR |
| **Integration** | Systems / people | orange `#FF5200` | Asset management · CAFM · IT services |

This grouping is used in the mega-menu, the services index, the home "capabilities" section and the overline on each service page (e.g. "**/** Precision · Scan / capture").

### 5.2 What makes the layout editorial (and not a template)

1. **Running heads and sheet numbers.** Each major section opens with an overline in the guideline format, "**/** 03 · Selected work", and long pages carry a sticky section index on desktop ("03 / 07 — What we deliver"), like page numbers in the PDFs.
2. **Typography carries the page.** Display type sits left-aligned and large, with generous white space and asymmetric 5/7 or 4/8 column splits. Body text keeps a real reading measure.
3. **Ruled spec lists instead of cards.** Client, location and scope appear as hairline-ruled definition lists in tabular figures, like a drawing title block.
4. **Figures with captions.** Every image is a `<figure>` with a caption in caption style (e.g. "Fig. 02 — Tadawul Tower, KAFD Riyadh. Clash-free consolidated model.").
5. **Diagrams instead of stock photos.** Process steps use the technical diagram style (Graphic Language p.11): straight connectors turning at 30°, rounded nodes, one orange node marking the decision or output.
6. **One orange per view.** Only the most important thing is orange: the primary CTA, the key figure, or the tagline full stop.
7. **Background rhythm.** Light field (off white with a 4% isometric lattice), white, Midnight depth (navy gradient with one 12% symbol crop), and Cobalt energy (pillar rhythm) for data moments. One divider style per page.

### 5.3 Anti-slop checklist (every section must pass)

- ✗ No purple or blue gradient blobs, glassmorphism, neon glows, or mesh gradients
- ✗ No centred hero with two equal buttons and a floating 3D render
- ✗ No rows of three identical icon cards with "Lorem-style" two-line blurbs
- ✗ No emoji, no generic stock "handshake/office" photos, no fake testimonials or fake metrics
- ✗ No "Unlock / Elevate / Revolutionize / Seamless / Cutting-edge / World-class"
- ✗ No count-up stats, marquees, preloaders, custom cursors, or scroll-jacking
- ✗ No colours outside the tokens, no second typeface, no rotated, stretched or shadowed logo
- ✓ Every section has a reason to exist, real content, and one clear next step

---

## 6. Component library

### 6.1 Brand primitives — `src/components/brand/`
| Component | Notes |
|---|---|
| `Logo` | Props: `lockup` (primary, horizontal, stacked, symbol) and `tone` (full, inverse, mono). Inline SVG with `aria-label`. Enforces minimum sizes (symbol 16px, horizontal 120px, primary 96px) and clear space. Drops the tagline below 120px. |
| `Tagline` | "Built with Intelligence." in SemiBold 600, about ⅓ wordmark cap height. Navy on light, white on dark. The full stop is orange only in editorial use (Colour System p.2). |
| `SymbolCrop` | An oversized fragment of the symbol bleeding off a page edge. Props: `edge`, `tone` (full / navy-12% / white-12% / navy-7%). The recommended device (Graphic Language p.3 A). |
| `ExplodedSymbol` | The four pathways as separate SVG layers that move apart along the 30° axis as the user scrolls. Used in the home hero and capabilities section. CSS scroll-timeline only, no JS. |
| `Lattice` | Isometric dot lattice as an SVG `pattern` background, at 4% (Light field). |
| `NodePath` | Lattice route with nodes and one orange terminal node. |
| `PillarRhythm` | Stepped rounded bars with one orange bar, for data dividers. |
| `Icon` | 24 icons drawn to spec: 24px grid, 2px safe margin, 1.75px stroke, round caps and joins, 30° diagonals only, one orange node (1.7px radius, filled). Set: building, bim-model, scan, digital-twin, layers, data, coordination, sensor, cloud, report, safety, site, schedule, team, energy, handover, plus UI icons (arrow, arrow-up-right, plus, minus, close, menu, download, play, grid, list, filter). |

### 6.2 UI — `src/components/ui/`
`Button` (variants: `signal` orange with navy label, the one per view · `primary` navy · `inverse` white on dark · `ghost` text with arrow), `TextLink`, `Overline` (orange slash plus label), `Heading`, `Rule`, `Tag`/`Chip`, `Figure` (image, caption, figure number), `SpecList` (ruled `<dl>`), `KeyFigure` (tabular figure and caption), `Accordion` (native `<details>`, works without JS), `Tabs`, `Drawer`/`Dialog` (focus-trapped, Esc to close, restores focus), `Lightbox`, `Field`/`Input`/`Textarea`, `PhoneInput` (searchable combobox, +91 default), `Select`, `FileDrop` (PDF/DOC/DOCX, 5MB max), `Breadcrumbs`, `SectionIndex` (sticky, desktop only), `SkipLink`.

### 6.3 Layout — `src/components/layout/`
- **`Header`:** sticky. Transparent with the inverse logo over dark heroes, solid off-white with a hairline elsewhere. Hides on scroll down and shows on scroll up. The "Get in touch" button is navy (white over dark heroes) so that orange stays free for the page's own CTA.
- **`MegaMenu` (Services):** four columns, one per pathway, each topped by its symbol fragment, then the services, then a featured project. Opens on click, on hover with a 120ms intent delay, and from the keyboard. Arrow-key navigation; Esc closes.
- **`MobileMenu`:** full-screen navy sheet, large type list, Services as an accordion grouped by pathway, CTA at the bottom, safe-area aware.
- **`Footer`:** a navy closing CTA merged into the footer (no separate CTA band, avoiding two navy blocks), oversized wordmark, sitemap columns, Chennai head office plus group offices, "A Technical Xperts Group company", ISO 19650 mark, legal links, "© 2026 Smart Built Technologies".

---

## 7. Pages, section by section

Each section lists **purpose → content → layout → treatment → mobile**. Content in quotes is draft copy written for SBT (see §8 for the voice rules). Content marked *TXG* is reused and rephrased from the crawl.

### 7.1 Home `/`

Background rhythm: navy, off white, lattice, white, navy, off white, white, off white, navy footer.

**H-01 Hero (Midnight depth)**
- Purpose: say who SBT is in five seconds.
- Content: overline "**/** Smart Built Technologies · Chennai". Display: "Built with Intelligence." with the orange full stop. Lede (body-lg, white at 80%): "BIM, reality capture, digital twins and facility systems, delivered from Chennai for landmark buildings in the Gulf, India and beyond." CTAs: `signal` "Start a project" and `ghost` "See selected work".
- Layout: text in columns 1–7. `ExplodedSymbol` bleeds off the bottom-right edge (cols 7–12). On load the four pathways assemble along the 30° axis, foundation first and the orange integration pathway last (700ms, once).
- Base strip: four key figures in tabular numerals, separated by hairlines: "2014 · Group founded", "250+ · Professionals in the group", "22 · Landmark projects", "ISO 19650 · Certified delivery". Figures need confirming (see §1 #4).
- Mobile: the symbol crop moves above the type at about 40% height, figures become a 2×2 grid, and the hero is never taller than `100svh`.
- LCP: text, not an image. The symbol is inline SVG, so there is no hero image request.

**H-02 Statement**
- Purpose: an editorial lede and the group relationship.
- Content: overline "**/** 01 · Who we are". H2-size lede: "We connect the physical building with its digital model, so every trade works from the same truth." Body: two short paragraphs on SBT as the Chennai engineering and software arm of TXG (est. 2014 in Riyadh; offices in Riyadh, Sharjah, Chennai and Kozhikode). Link: "About SBT →".
- Layout: 4/8 split. The overline sits in the narrow left column; text on the right is held to a 68ch measure.

**H-03 Capabilities: four pathways (Light field + lattice)**
- Purpose: the whole service offer in one view, organised by the brand concept.
- Content: overline "**/** 02 · Capabilities". H1: "Four pathways. One model." Four rows: pathway name, meaning, services listed as links, and one line per service (*TXG*, rewritten).
- Layout (desktop): the `ExplodedSymbol` is sticky on the left. As each pathway row enters the viewport, its layer lifts and the others fade to 30%. Rows on the right are separated by hairlines.
- Mobile: no sticky element. Each row shows its own small symbol fragment. Tapping expands the service list (accordion).

**H-04 Selected work**
- Purpose: proof through the landmark projects.
- Content: overline "**/** 03 · Selected work". H1: "Landmarks, modelled." Three features: **NEOM Bay Airport T1 T2**, **King Abdullah Financial District**, **Sports Boulevard** (*TXG* data). Link: "All 22 projects →".
- Layout: alternating editorial spreads. A large `Figure` (8 columns) sits beside a `SpecList` (4 columns): Client / Location / Scope / Services, with service tags linking to service pages. Figure captions are numbered (Fig. 01 to 03).
- Treatment: photos graded per the photography rules (−20% saturation, +5% contrast) using a CSS filter, plus a navy gradient on the text side when text overlaps.
- Mobile: image above the spec list.

**H-05 The model across the lifecycle (navy)**
- Purpose: the "Advantage of BIM" content from TXG, recast as a technical diagram.
- Content: overline "**/** 04 · Why BIM". H1: "One model, from first sketch to facility handover." Four nodes: **Design & planning** → **Construction** → **Operations & maintenance** → **Risk management** (*TXG* copy, tightened). The orange node is Construction ("coordinated, clash-free models before anything is fabricated"). Replace "100% reduction in spatial clashes" with a verifiable statement or a sourced figure from a real project.
- Layout: diagram drawn to the Graphic Language p.11 rules (straight connectors that turn at 30°, nodes with 14px corners, step numbers in tracked caps). On mobile it becomes a vertical timeline.

**H-06 Credentials (off white)**
- Purpose: trust.
- Content: overline "**/** 05 · Credentials". H2: "Certified to the standards our clients specify." **Accreditations:** a ruled table (Standard / Scope / Certificate) for ISO 19650-1:2018, 19650-2:2018, 9001:2015 and 14001:2015; thumbnails open in a `Lightbox`. Tabs: All · ISO · Government & trade · Regulatory, each showing a count, as on TXG. **Clients:** a static ruled 5×4 grid of 20 logos in one-colour navy at 60%, rising to 100% on hover. **Technology partners:** a single row of 11 logos.
- Mobile: clients grid becomes 3 columns; table rows become stacked cards.

**H-07 Journal (white)**
- Content: overline "**/** 06 · Journal". The latest news item (featured, large) plus the three latest articles as an editorial list (date in tabular numerals / title / standfirst / reading time). Link: "All articles →".

**H-08 FAQ (off white)**
- Content: overline "**/** 07 · Questions". About 7 questions rewritten for SBT and Chennai search intent, e.g. "What does Smart Built Technologies do?", "Is SBT part of TXG?", "Do you deliver BIM to ISO 19650?", "Which LODs do you model to?", "Can you support projects in Saudi Arabia and the UAE from Chennai?", "What is scan to BIM?", "How do we start a project?".
- Layout: 4/8 split (heading left, accordion right). `FAQPage` JSON-LD.

**H-09 Closing CTA (merged into the navy footer)**
- Content: H1 "Tell us what you are building." Body: "Share drawings, a scan or just a brief. A BIM lead in Chennai will reply within two working days." CTA: `signal` "Start a project". Beside it: email, phone and the Chennai address.
- Treatment: Midnight depth with a 12% white `SymbolCrop` bleeding off the right edge.

### 7.2 About `/about`

| # | Section | Content and layout |
|---|---|---|
| A-01 | Page hero (light) | Overline "**/** About SBT". Display: "Software and engineering, working as one." Lede on SBT plus TXG. Download link: Company profile (PDF). A full-width `Figure` below (KAFD or a team photo). |
| A-02 | Our story | 4/8 editorial text; *TXG* story rewritten. A pull quote in italic 400 with an orange rule (the only italic on the page). |
| A-03 | The group (timeline) | A horizontal timeline on the 30° grid: 2014 TXG founded, Riyadh · 2022 Cyberpark office opens, Kozhikode · 2023 10th anniversary (Riyadh and Kozhikode) · 20XX SBT established in Chennai (**date needed**) · 2026 Digital twin operations expand to the UAE and Bahrain. On mobile it becomes a vertical list. |
| A-04 | People (Cobalt energy) | "Capacity that delivers." Four key figures (BIM engineers / coordinators / managers / digital construction professionals; **numbers needed**) over a `PillarRhythm`. White text on cobalt. |
| A-05 | Rooted in Chennai, delivering globally | Replaces TXG's "Deeply rooted in Saudi Arabia". Four ruled points: Chennai engineering hub · KSA presence through the group (CR registered, 13+ years) · Vision 2030 mega-project experience · delivery across KSA, UAE, UK, USA and Australia. A simple map with an orange node on Chennai and navy nodes on group offices. |
| A-06 | Accreditations repository | The full filterable set (All 15 / ISO 5 / Government & trade 5 / Regulatory 5), with a Grid/List toggle as on TXG. Certificates open in a `Lightbox`. |
| A-07 | Vision, mission, values | Three columns separated by hairlines. Values: Quality & teamwork · Precision & excellence · Commitment & integrity. |
| A-08 | FAQ + footer CTA | 3–4 questions (when founded, relationship to TXG, mission). |

*The TXG "Play showcase" video block is dropped until a real video exists; an empty play button is slop.*

### 7.3 Services index `/services`

| # | Section | Content and layout |
|---|---|---|
| S-01 | Page hero | Overline "**/** Services". H1: "Nine services. Four pathways. One model." Lede. A small `ExplodedSymbol` on the right. |
| S-02 | Pathway index | Four chapters (Foundation, Precision, Digital layer, Integration). Each chapter has a heading row (pathway name, meaning, symbol fragment), then a **ruled index list** of its services: number / title / one-line summary / arrow. **Desktop hover** shows the service's diagram thumbnail in a fixed preview panel on the right (it does not follow the cursor). |
| S-03 | How we engage | A 4-step technical diagram: Brief → Scope & BEP → Deliver to ISO 19650 → Handover & support. One orange node at Handover. |
| S-04 | Footer CTA | |

### 7.4 Service detail template `/services/[slug]` (9 pages)

All nine pages use one template driven by `content/services/<slug>.ts`.

| # | Section | Content and layout |
|---|---|---|
| D-01 | Hero | Breadcrumbs · overline with the pathway ("**/** Precision · Scan / capture") · H1 · lede · a `Figure` with a navy gradient on the text side (a real project image where one exists, otherwise the pathway's isometric illustration). |
| D-02 | Definition | "What is reality capture?" 4/8 split with a sticky left heading. Body *TXG* (rewritten), then three `KeyFigure`s in tabular numerals (e.g. "mm · Level accuracy", "LOD 100–500", "ISO 19650"). |
| D-03 | Our approach | Four numbered principles in a 2×2 ruled grid (01 to 04, H3 plus body). No icons, no cards. |
| D-04 | What we deliver | 4–6 deliverables as an editorial list: brand `Icon`, H3, one sentence, and an optional "Typical output" caption (e.g. "Revit model · IFC · COBie"). Replaces TXG's repeated stock-photo cards. |
| D-05 | Process diagram | Service-specific steps in the technical diagram style, e.g. scan to BIM: Define requirements → Plan survey → Capture → Register & process → Model → Validate & deliver (from the TXG article). Orange node at Validate. |
| D-06 | Related projects | Projects automatically filtered by service tag (e.g. reality capture → Jeddah Opera House; 4D → Jeddah Tower, Six Senses). A horizontal scroll-snap rail on mobile. |
| D-07 | FAQ | 3–5 service questions, with `FAQPage` JSON-LD. |
| D-08 | From the journal | 1–2 related articles. |
| D-09 | Next chapter | Full-width link: "Next: CAFM implementation →", so the site reads like a book. Then the footer CTA. |

**Per-service content map** (from the crawl, to be rewritten):

| Slug | Pathway | Approach (01 to 04) | Deliverables |
|---|---|---|---|
| `bim` | Foundation | Integrated collaboration · Design accuracy · Data management · Cost & time | 3D modelling & visualisation · Coordination & clash detection · Implementation & training · Lifecycle management |
| `4d-simulation` | Foundation | Schedule-linked models · Logistics & site planning · Clash avoidance · Stakeholder communication | Sequencing · Schedule visualisation (P6 / MS Project) · Logistics simulation · Clash & conflict avoidance · Progress monitoring · Phasing & zones |
| `reality-capture` | Precision | Scan to BIM pipeline · mm accuracy · Faster timelines · Risk & QA | LiDAR scanning · Point cloud processing · Scan to BIM · As-built documentation · Construction verification · Heritage & retrofit |
| `asset-management` (+ `#asset-tagging`) | Integration (tagging section: Precision) | End-to-end implementation · BIM-to-operations bridge · System integration · Reporting & analytics | CAFM/CMMS · Asset information management · Data migration · Enterprise integration (SAP, Oracle, BMS, IoT) · Lifecycle · Analytics. **Tagging:** QR/barcode · RFID · Digital asset register |
| `cafm` | Integration | Centralised data · Asset tracking · Operational efficiency · Cost optimisation | Tailored CAFM · Data integration · Real-time monitoring · Scalable FM |
| `it-services` | Integration | Web apps · Mobile · API integration | Digital asset modelling · Asset registers · CAFM support · Tagging · Lifecycle data · O&M enablement |
| `digital-twin` | Digital layer | Remote monitoring · Predictive maintenance · Risk assessment · IoT & BMS integration | Smart building implementation · IoT integration · BMS connectivity · Predictive analytics |
| `gis-smart-cities` | Digital layer | Surveying & data · GIS + BIM · Real-time data · GIS-BIM-twin synergy | GIS-BIM integration · Centralised data · Real-time access · Surveying · Twin & GIS convergence · GIS for FM |
| `immersive-solutions` | Digital layer | BIM-native experiences · AR site verification · Training & safety · Client approvals | VR walkthroughs · AR overlay · XR for FM · Safety training · Client visualisation · BIM model interaction |

### 7.5 Projects `/projects`

| # | Section | Content and layout |
|---|---|---|
| P-01 | Page hero | Overline "**/** Projects". H1: "22 projects across five countries." Lede on the group track record (see §1 #2). |
| P-02 | Filter bar (sticky) | **Sector** chips (All · Airports · Mixed use · Hospitals · Hotels · Commercial · Infrastructure · Industrial · Government; empty sectors are hidden automatically, so Residential is not shown) · **Region** (KSA · Australia) · **Service** select. A live result count ("9 projects"), announced through `aria-live`. State is kept in the URL (`?sector=airports&service=bim`) so filtered views can be shared, and filtering happens instantly on the client. |
| P-03 | Results | A **Grid / Index** toggle. Grid: editorial mixed-size grid (1 large, 2 small, repeating) of figures with a caption (name, location). Index: a ruled table (No. / Project / Client / Location / Sector / Scope), which is useful for prequalification reviewers. |
| P-04 | Project drawer | Clicking a project opens a right-hand drawer (full screen on mobile) at `/projects#slug`: image, `SpecList` (Client, Location, Sector, Delivered by, Scope as a list), service tags linking to services, and Previous/Next. Deep links from the footer and service pages open the drawer directly. |
| P-05 | Clients | The ruled client logo grid (as on Home). |

**Project data** (from the crawl; sectors are proposed and need confirming):

| # | Project | Client | Location | Sector | Main services |
|---|---|---|---|---|---|
| 1 | NEOM Bay Airport T1 T2 | NEOM | NEOM, KSA | Airports | BIM (LOD 300–500), digital delivery partner |
| 2 | King Abdullah Financial District | KAFD | Riyadh, KSA | Mixed use | Digital twin, operational BIM, AIM |
| 3 | Sports Boulevard | Sports Boulevard Foundation | Riyadh, KSA | Infrastructure | As-built AIM, LOD 500, COBie |
| 4 | Riyadh Metro | High Commission for the Development of Ar-Riyadh | Riyadh, KSA | Infrastructure | BIM, construction documents, ELV shop drawings |
| 5 | NEOM Oxagon | Samsung C&T | NEOM Oxagon, KSA | Industrial | Electrical shop drawings, 246,186 m² modular factory |
| 6 | Shura HC-1 The Tail, Marsa Village | Red Sea Global / ICAD | Shura Island, KSA | Hotels | ELV BIM LOD 400 / D05, onsite coordinator |
| 7 | Al Nahda Entertainment Complex, Exit 15 | Seven Entertainments | Riyadh, KSA | Commercial | BIM staffing |
| 8 | Melbourne Airport | Stowe | Melbourne, AU | Airports | Electrical layouts, containment, Revizto/Trimble |
| 9 | Chadstone Shopping Centre | Stowe | Melbourne, AU | Commercial | ″ |
| 10 | Banksia CSL | Stowe | Melbourne, AU | Industrial | ″ |
| 11 | Thomas Embling Hospital | Stowe | Melbourne, AU | Hospitals | ″ |
| 12 | Microsoft Data Center MEL07 | Stowe | Melbourne, AU | Industrial | ″ |
| 13 | Geelong Convention & Event Centre | Stowe | Geelong, AU | Commercial | ″ |
| 14 | AirTrunk Shell (H, J, K, L) | Stowe | Melbourne, AU | Industrial | ″ |
| 15 | King Salman Park | MBL | Riyadh, KSA | Government | Tendering support |
| 16 | Jeddah Tower | Saudi Binladin Group | Jeddah, KSA | Mixed use | 4D simulation, 3D space coordination |
| 17 | Hegra Boutique Hotel (UNESCO site) | Gioforma | AlUla, KSA | Hotels | ArchiCAD to Revit conversion |
| 18 | King Abdulaziz International Airport | GACA | Jeddah, KSA | Airports | Engineering support, close-out, MSI, CAD standards |
| 19 | Tadawul Tower | Samsung CCE JV | KAFD, Riyadh | Commercial | Multi-trade BIM, clash-free model, CSD |
| 20 | Al Moosa Rehabilitation Hospital | Al Moosa Hospital | Al Ahsa, KSA | Hospitals | Multi-trade BIM, clash-free model, CSD |
| 21 | Six Senses Hotel, Wadi Safar | Diriyah Company (BUJV) | Diriyah, KSA | Hotels | BIM, CDE, 4D/5D, VR, LOD 400–500 |
| 22 | Jeddah Opera House | Jeddah Central Development Co. | Jeddah, KSA | Government | LiDAR scanning |

*Note: TXG names the Sports Boulevard client "Sports Boulevard Federation"; the official name is "Sports Boulevard Foundation". Confirm before launch.*

### 7.6 Events `/insights`

| # | Section | Content and layout |
|---|---|---|
| E-01 | Page hero | H1 "Events." Lede: exhibitions, summits and milestones. |
| E-02 | Timeline by year | Year headings (2024 · 2023 · 2022) as large tabular figures in navy at 25% opacity (the section-number rule from Graphic Language p.6). Under each year, ruled rows: date / type tag / title / location, with a thumbnail. |
| E-03 | Event gallery | Clicking a row opens a `Lightbox` gallery. The event folders suggest several photos per event; collect them. |

Events: Saudi Airport Exhibition 2024 (11–12 Nov 2024) · Construction Technology Confex KSA (23 Oct 2024) · Autodesk Technology Day (22 Feb 2024) · World Defense Show (4–8 Feb 2024) · Saudi Airport Exhibition 2023 (19–20 Dec 2023) · 10th Anniversary, Riyadh (30 Nov 2023) · 10th Anniversary, Kozhikode (13 Oct 2023) · IFSEC International (16–18 May 2023) · Office inauguration, Cyberpark (16 Sep 2022).

### 7.7 Blog `/blog` and `/blog/[slug]`

**Index:** hero "Journal." · the featured latest item (large) · category filter (All · Articles · News) · an editorial list of the rest.

**Article template (long-read):**
- Header: breadcrumbs, date and reading time in tabular numerals, H1, standfirst, hero `Figure`.
- Body: a 68ch column. On desktop, a sticky **table of contents** sits on the left with the current heading highlighted. A 2px reading-progress hairline in cobalt runs at the top.
- MDX components: `Callout` (navy rule), `PullQuote` (italic 400 with an orange rule), `Figure`, `SpecList`, `ProcessDiagram`, `FAQ` (renders `FAQPage` JSON-LD).
- Footer: author, related articles, Previous/Next, and a soft CTA ("Planning a scan to BIM project? Talk to us →").
- `Article` JSON-LD, plus an OG image generated from a brand template.

**Articles to migrate:** scan-to-bim-process-accuracy-deliverables (long, keep) · is-cost-really-the-biggest-barrier (long, keep) · what-is-digital-twin, introduction-to-bim, bim-vs-traditional-methods, digital-twins-vs-bms (thin, expand to at least 800 words or `noindex`) · news: "TXG expands digital twin operations to the UAE and Bahrain" (28 Jun 2026).

### 7.8 Careers `/careers` and `/careers/[slug]`

| # | Section | Content and layout |
|---|---|---|
| C-01 | Hero | H1 "Build the model with us." Lede: hiring BIM modellers, engineers, team leads and coordinators (all disciplines) in Chennai, across India and in the Middle East. |
| C-02 | Why SBT | Four ruled points: landmark projects · ISO 19650 practice · growth across the group · Chennai engineering hub. |
| C-03 | Open roles | A ruled list (role / discipline / location / type) linking to detail pages. Empty state: "No open roles right now. Send your CV anyway." |
| C-04 | Apply form | Name, email, phone (+91 default), position (BIM modeller · BIM engineer · Team leader · BIM coordinator · Other), CV upload (PDF/DOC/DOCX, 5MB max, drag-and-drop with a keyboard-accessible fallback), consent checkbox. |
| Detail | `/careers/[slug]` | Role summary, responsibilities, requirements, location, and the apply form pre-filled with the role. `JobPosting` JSON-LD. |

### 7.9 Contact `/contact`

| # | Section | Content and layout |
|---|---|---|
| K-01 | Hero | H1 "Get in touch." Lede: head office in Chennai, group offices in KSA, UAE and India. |
| K-02 | Form + direct lines | 7/5 split. Form: name, company, email, phone (searchable country code, +91 default), **service of interest** (grouped by pathway), **project stage** (Concept · Design · Construction · Operation), message. A `signal` "Send enquiry" button. Inline validation on blur, a clear success state, nothing lost on error. Right column: email, phone, office hours (IST), and an expected reply time. |
| K-03 | Downloads | Quick profile · Company profile · Prequalification: a ruled list with file size and format. |
| K-04 | Offices | Chennai (head office, orange node) · Riyadh, Al Kindi Plaza, Diplomatic Quarter (group HQ) · Sharjah, SAIF Zone, PO Box 513153 · Kozhikode, Kerala. Each gets a "View on map" link to Google Maps. **No embedded map iframes** (about 500KB each); an optional static map image instead. |

### 7.10 Utility pages
- **404:** "This page isn't on the drawings." Links to Home, Services and Projects, with a lattice background and one orange node.
- **Privacy:** a plain DPDP-aligned notice covering form data, the CV retention period, and a contact for data requests.

---

## 8. Voice and copy

**Voice:** precise, plain and confident, like an engineer explaining a model to a client. Short sentences, specific nouns and numbers, no superlatives.

**Rules:**
- Sentence case. British/Indian English spelling (colour, modelling, organisation, centre), matching the guidelines.
- Lead with what is delivered (LOD, format, standard), not adjectives.
- Every claim can be checked: a project, a standard or a number.
- The tagline is always "Built with Intelligence." with the capital I and the full stop, never altered.
- **Rewrite all reused TXG copy** (at least sentence-level paraphrase). Identical text on two domains competes in search and splits ranking.

**Example rewrites:**

| TXG | SBT |
|---|---|
| "Over a Decade of Innovation." | "Built with Intelligence." |
| "Beautifully created by us." | "Landmarks, modelled." |
| "Ready to redefine your structural methodology?" | "Tell us what you are building." |
| "Absolute Precision." (About) | "Software and engineering, working as one." |
| "100% reduction in spatial clashes" | "Clash-free, coordinated models before fabrication" (or a sourced project figure) |
| "Manpower that delivers." | "Capacity that delivers." |

---

## 9. Technical architecture

### 9.1 Stack
| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js, latest stable (16.x or newer), App Router, Turbopack** | As requested; static generation for every route |
| Language | **TypeScript** `strict`, `noUncheckedIndexedAccess` | Typed content means fewer content bugs |
| UI | **React 19**, Server Components by default; client components only for menu, filters, drawer, forms and lightbox | Keeps JavaScript small |
| Styling | **Tailwind CSS v4** with tokens from `tokens.css` via `@theme`; `clsx` + `tailwind-merge` | Tokens become the only allowed values |
| Fonts | `next/font/google`, Plus Jakarta Sans (variable 400–800, plus italic) | Self-hosted, no layout shift, no third-party request |
| Content | Typed TS modules in `src/content/` plus **MDX** for articles (`@next/mdx`, with `remark-gfm` and `rehype-slug`) | Zero cost, versioned, type-checked |
| Validation | **Zod** shared by client and server | One schema per form |
| Forms | **Server Actions** → email via **Resend** (SMTP fallback). CV upload to **Vercel Blob / S3** with a signed URL in the email. Spam: honeypot plus **Cloudflare Turnstile** | No backend to maintain |
| Images | `next/image` (AVIF/WebP), explicit `sizes`, blur placeholders, `priority` only on the LCP image | Fast and stable |
| Motion | CSS first (`animation-timeline`, transitions); **no animation library** in v1 | Zero JS cost |
| Analytics | Vercel Web Analytics or Plausible (cookieless, so no cookie banner) | Privacy-friendly |
| Quality | ESLint (next + jsx-a11y), Prettier, **Playwright** smoke and a11y tests (`@axe-core/playwright`), **Lighthouse CI** budgets | Automated gates |
| Hosting | Vercel (`bom1`) or self-hosted `next start` behind nginx | See §1 #12 |

### 9.2 Folder structure

```
src/
  app/
    layout.tsx                 # fonts, <Header/>, <Footer/>, skip link, JSON-LD Organization
    page.tsx                   # Home
    about/page.tsx
    services/page.tsx
    services/[slug]/page.tsx   # generateStaticParams from content/services
    projects/page.tsx
    insights/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
    careers/page.tsx
    careers/[slug]/page.tsx
    contact/page.tsx
    privacy/page.tsx
    not-found.tsx
    sitemap.ts  robots.ts  manifest.ts
    opengraph-image.tsx        # brand OG template (next/og)
    icon.svg  apple-icon.png
  actions/
    contact.ts  apply.ts       # server actions
  components/
    brand/   ui/   layout/   sections/
  content/
    site.ts          # name, contacts, offices, socials, figures
    navigation.ts    # nav plus pathway grouping
    pathways.ts      # the 4 pathways (name, meaning, colour, services)
    services/*.ts    # 9 typed service documents
    projects.ts      # 22 projects
    clients.ts  partners.ts  accreditations.ts  events.ts  faqs.ts
    careers/*.mdx
    blog/*.mdx
  lib/
    seo.ts  jsonld.ts  cn.ts  format.ts  schemas.ts
  styles/
    globals.css  tokens.css
public/
  assets/ (projects/, clients/, partners/, certificates/, events/, brand/, downloads/)
```

### 9.3 Content types (abridged)

```ts
type PathwayId = 'foundation' | 'precision' | 'digital-layer' | 'integration';

interface Service {
  slug: string; pathway: PathwayId; order: number;
  title: string; shortTitle: string; summary: string;     // index row
  hero: { lede: string; image?: ImageRef };
  definition: { heading: string; body: string[]; figures: KeyFigure[] };
  approach: { title: string; body: string }[];            // exactly 4
  deliverables: { icon: IconName; title: string; body: string; outputs?: string[] }[];
  process?: { title: string; caption: string; focus?: boolean }[]; // focus = orange node
  faqs: Faq[]; relatedArticles?: string[];
  seo: { title: string; description: string };
}

interface Project {
  slug: string; name: string; client: string; location: string;
  country: 'KSA' | 'AU' | 'UAE' | 'IN' | 'UK' | 'US';
  sector: Sector; services: Service['slug'][]; scope: string[];
  image: ImageRef; featured?: boolean; deliveredBy: 'TXG Group' | 'SBT';
}
```

The type system guarantees that every project's service tags exist, every service has 4 approach points, and every image has alt text.

### 9.4 SEO
- `generateMetadata` on every page: unique title (`{Page} | Smart Built Technologies`), description, canonical, OG/Twitter tags, and a generated OG image in the brand template (navy, symbol crop, title).
- JSON-LD: `Organization` (with `parentOrganization` TXG and `sameAs`), `LocalBusiness` (Chennai), `BreadcrumbList`, `Service`, `FAQPage`, `Article`, `JobPosting`.
- `sitemap.ts` generated from the content files; `robots.ts` matching TXG (disallow `/api/`).
- Chennai and India search intent covered in the FAQs and metadata ("BIM services company in Chennai", "scan to BIM India") without keyword stuffing.
- Optional: `llms.txt` summarising the services for AI search.

### 9.5 Performance budgets (enforced by Lighthouse CI)
| Metric | Budget |
|---|---|
| LCP (mid-range Android, 4G) | ≤ 2.0s |
| CLS | ≤ 0.05 |
| INP | ≤ 150ms |
| First-load JS (marketing pages) | Framework baseline (React DOM + Next runtime, about 160KB gzip on Next 16.4; measured) **plus at most 40KB of our own code**. Home currently adds about 16KB. |
| Lighthouse Performance / Accessibility / Best practices / SEO | ≥ 95 / 100 / 100 / 100 |
| Hero | Text LCP plus inline SVG, no hero image request on Home |

### 9.6 Accessibility (WCAG 2.2 AA)
Semantic landmarks · a skip link · visible focus rings (2px cobalt plus a 2px offset, white on dark) · every interactive element reachable by keyboard · 44×44px minimum touch targets · `aria-live` for filter counts and form status · labels, never placeholder-only fields · errors linked with `aria-describedby` · reduced-motion support · alt text from the content types · axe checks in CI.

### 9.7 Asset migration
All assets on txgksa.com download directly (HTTP 200, checked). A script `scripts/migrate-assets.ts` will:
1. Download the inventory below into `public/assets/…` with kebab-case filenames.
2. Convert to AVIF/WebP masters at a 2400px long edge (`sharp`).
3. Write a manifest with dimensions and a blur hash for `next/image`.

Inventory: 22 project images · 20 client logos · 11 partner logos · 4 ISO certificates · 9 event covers · 7 service backgrounds · hero background · 3 country icons · 1 blog image · `Company-Profile.pdf`. Client logos are converted to one-colour navy SVG/PNG for the logo wall.

---

## 10. Delivery plan: built section by section

Every section follows the same loop: **content draft → build (desktop and mobile) → screenshots at 360 / 768 / 1440 → your review → sign-off → next section.** Nothing moves on until its section is approved.

| Phase | Scope | Exit criteria |
|---|---|---|
| **0. Inputs** | Answers to §1; vector logos; contact details | Placeholders listed in one file |
| **1. Foundation** | Next.js + TS + Tailwind setup, tokens, fonts, lint/test/CI, asset migration, content types and all content entered, brand primitives (Logo, SymbolCrop, ExplodedSymbol, Lattice, Icon set), UI kit, Header, MegaMenu, MobileMenu, Footer. A `/_kit` page (dev only) showing every component | Kit reviewed and approved |
| **2. Home** | H-01 → H-09, one at a time | Each section signed off |
| **3. Services** | Index, then the detail template on `reality-capture` first (richest content), then the other 8 | Template approved, then all 9 pages |
| **4. Projects + Events** | Filters, Grid/Index views, drawer, timeline, galleries | Deep links work; no JS errors; filters announced to screen readers |
| **5. About, Careers, Contact** | Includes server actions, upload, email, spam protection | Test submissions reach the inbox |
| **6. Blog** | MDX pipeline, article template, migrated and rewritten articles | Articles pass the readability check |
| **7. Hardening and launch** | SEO and JSON-LD validation, Lighthouse CI, axe, cross-browser (Chrome, Safari iOS, Firefox, Samsung Internet), 404/privacy, analytics, domain and DNS, Search Console plus sitemap submission | All budgets in §9.5 met |

### Definition of done (per section)
- [ ] Matches the brand tokens. No values hard-coded outside the tokens.
- [ ] Passes the anti-slop checklist (§5.3) and the one-orange-per-view rule.
- [ ] Works from 360px to 1920px; no horizontal scroll; touch targets at least 44px.
- [ ] Keyboard-only walkthrough passes; axe shows 0 violations; contrast pairs from §3.1 only.
- [ ] Reduced motion respected; no CLS from fonts, images or reveals.
- [ ] All copy comes from `src/content`, rewritten in the SBT voice, with no TXG text verbatim.
- [ ] Screenshots attached for review.

---

## Appendix A: Source summary of txgksa.com (crawled 10 Nov 2026)

- **Company:** Technical Xperts Group, est. 2014, HQ Al Kindi Plaza, Diplomatic Quarter, Riyadh. Offices in Sharjah (SAIF Zone, PO Box 513153), Chennai and Kozhikode. 200–250+ professionals. Saudi CR registered, 13+ years in KSA. Delivered work in KSA, UAE, UK, USA and Australia.
- **Vision:** redefine construction by integrating advanced BIM and digital delivery. **Mission:** empower construction excellence with innovative digital delivery, ensuring cost-effective design and planning. **Values:** Quality & teamwork · Precision & excellence · Commitment & integrity.
- **Accreditations:** 15 in total (5 ISO / 5 government & trade / 5 regulatory). Published: ISO 19650-1:2018, ISO 19650-2:2018, ISO 9001:2015, ISO 14001:2015.
- **Clients (20 logos):** Al Bawani, Al Moosa, Baumat, CCE, First Fix, HATCO, HUTA, ICAD, IFAS, Jeddah Central, Sevens, Samsung, SP, Red Sea Global, RSG, NESMA, NEOM, MIDAD, MBL, KAFD.
- **Contacts:** info@txgksa.com · sales@txgksa.com · hr@txgksa.com.
- **Socials (TXG):** Facebook, Instagram @txg_ksa, LinkedIn technical-xperts-group-saudi-arabia, X @txg_ksa, YouTube @txg_ksa.
- **Home FAQ themes:** top BIM company in KSA · BIM companies in Riyadh · what BIM is · services offered · Vision 2030 support · where TXG operates · major projects.
