# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server
- `npm run build` — produce a static export to `out/` (used by GitHub Pages deploy)
- `npm run start` — serve a previously-built app

There is no test runner, linter, or formatter configured. The CI workflow (`.github/workflows/nextjs.yml`) runs only `next build` and uploads `out/` to GitHub Pages on push to `main`.

## Architecture

Personal portfolio + blog deployed as a **fully static export** to GitHub Pages. The static-export constraint shapes most decisions:

- `next.config.js` sets `output: 'export'` and `images.unoptimized: true`. There is no Node runtime in production — anything that looks like a server route (e.g. `app/rss/route.ts`) is rendered to a static file at build time, and dynamic routes must declare `generateStaticParams` (see `app/blog/[slug]/page.tsx`).
- `baseUrl` lives in `app/sitemap.ts` and is reused by `app/rss/route.ts` and blog metadata. Update it there if the deployment URL changes.

### Content pipeline (MDX blog)

- Posts are MDX files in `app/blog/posts/`. `template.mdx` is intentionally skipped by `getMDXFiles` in `app/blog/utils.ts` — copy it to start a new post.
- Frontmatter is parsed by a hand-rolled splitter in `app/blog/utils.ts` (not `gray-matter`, despite the dep). It supports `title`, `publishedAt`, `summary`, `image`, `imagePosition`, `tags`, `className`. `readingTime` is recomputed from word count on every read; don't set it in frontmatter.
- `getBlogPosts()` reads from disk synchronously and is called from `sitemap.ts`, `rss/route.ts`, and `blog/[slug]/page.tsx`. Because everything runs at build time this is fine, but don't try to call it from a `'use client'` component.
- Rendering goes through `components/mdx.tsx` (`CustomMDX`), which wires custom components for headings (auto-slugged anchors), links (`CustomLink` distinguishes internal/hash/external), code (`sugar-high` highlighting), and images (`RoundedImage`).

### Visual system

The site has a strong visual identity that runs through everything — treat it as load-bearing, not decorative:

- **Personal almanac.** The home page (`app/page.tsx`) is laid out as an editorial almanac with a sticky left sidebar nav (`components/nav.tsx`) and plain-titled sections (Latest post, From the blog, Around the site, Recommendations) via a local `SectionHead`. No section numbering, eyebrows, stamps, or "Fig." captions — those were removed deliberately as generic-AI-design tells; don't reintroduce them. The two-column shell (`.page-grid` + `.wrap` in `globals.css`) is applied site-wide via `app/layout.tsx`.
- **The logo palette is the whole palette.** Exactly five colours exist: `--yellow #f9c90a`, `--red #ef2841`, `--blue #007d7e`, `--ink #15130d`, `--paper #f6f4ee`. **There is no pure black** — `--ink` is the warm tonal mirror of `--paper` (same warm bias, inverted lightness); `#000000` was tried and rejected because a neutral black fights the warm paper. **Never introduce a sixth hue.** Every neutral (`--ink-soft`, `--ink-mute`, `--rule`, `--paper-2/3`) is `--ink` or `--paper` at reduced alpha — never a new tint, and never a warm brown. `#15130d = rgb(21 19 13)`: the `rgba(21, 19, 13, *)` literals scattered through `globals.css` (and the drawer shadow in `nav.tsx`) derive from it — a future ink change must update them together.
- **Dark mode: everything on the ground flips, including panels.** `--paper` and `--ink` are the two fixed poles and never flip; what flips is which pole is the ground. `.dark` redefines the ground-following tokens — `--background`, `--text`, `--accent`, the alpha neutrals (`--ink-soft`, `--ink-mute`, `--rule`, `--rule-strong`), and the ground tints `--paper-2/3`. (`.dark` also re-declares `--muted: var(--ink-mute)`, which is a redundant no-op — `:root`'s `--muted` already resolves through the flipped `--ink-mute`. It is harmless; don't "fix" it thinking a token is missing.) **Panel faces are cut from the ground and go dark with it**, which means the *linework inverts too*: keylines are `--text` (ink by day, paper at night). `--accent` is red in light, yellow in dark; `::selection` is yellow with ink text in both themes; the "Current" stamp (`.exp-stamp`) is red-on-paper by day, yellow-on-ink at night.
  - Historical note: the extrusion restyle originally shipped "night, not inversion" — panel faces pinned to lit paper with ink keylines in both themes, on the comics argument that ink stays black in a night scene. **The owner rejected it on sight**: a dark page full of glowing white panels defeats the purpose of dark mode. Faces now follow `--background`, and the keyline necessarily follows `--text` (an ink keyline on an ink face is ~1.2:1 and the outline dissolves). Don't reintroduce fixed-paper faces.
  - Historical note: an earlier palette drifted off-brand into invented hues (`--red-oxide #a6382e`, `--mustard #c9a227`, `--indigo`, `--teal #24a68e`, `--olive`, `--cream`) plus a warm-brown ink ramp, and a later pass used pure `#000000` as the fifth colour with dark mode as a true inversion. These are all deleted. `public/palette.png` is a **stale, orphaned** swatch file whose red (`#a6382e`) is *not* the brand red — do not source colours from it.
- **Type system.** Three Latin faces, loaded via `next/font` in `app/layout.tsx`:
  - `--font-serif-display` (Young Serif) — h2/h3/feature titles, sidebar nav labels.
  - `--font-serif-body` (Newsreader, variable with `opsz` axis + italic) — body, post titles in lists, and the blog `.prose`. `--font-serif` is a CSS alias to it (set in `:root`) so older inline styles keep resolving.
  - `--font-sans` (Inter, weights 400/500/600) — **utility text only**: `.meta-line`, `.label`, kickers (`.rec-kind`, `.section-head .right`), meta rows (`.featured .copy .meta`, `.exp-meta`), dates and read-times (`.post-row .date`/`.read`), the `.exp-stamp`, the `.hero-folio` dateline, and footer copy (`.foot-copy`). 14px standard (stamps 12px, folio 18px). Body, prose, titles, and nav labels stay serif — don't let the sans creep upward.
- **Kolam ornament.** `components/Kolam.tsx` is `KolamPlait`, a woven sikku plait: two counter-phase sine strands approximated with quadratic Beziers (period 24px, amplitude 10, stroke 1.8; control offset `4/pi * A` reproduces the sine peak) weaving through a row of pulli dots with **real alternating over/under crossings**. The under-pass is mechanical, not drawn: strand B is painted over everything with a ground-colour (`--background`) casing stroke beneath its ink, then strand A is reclaimed at odd crossings via a `clipPath` of circles (`useId`-derived id, so two plaits on one page can't collide). Because the casing is always the ground colour, the weave inverts for free at night — rice flour on dark earth, which is what a kolam physically is. API: `<KolamPlait segments={n} />` (min 2). It is the site's signature mark. **Where kolams go: the footer border ONLY** (`components/footer.tsx`; `.foot-ornament` renders it at natural height — the footer is padded to align with the main content column, not the full wrap). The owner tried and rejected kolams in the sidebar nav, beside year headings, atop `PostFooter`, and on the 404 page — don't reintroduce them anywhere without being asked; plain 1px rules are correct everywhere else. The old D4-symmetric medallion generator (seeded corner matrix, shape-indexed loop fills, `KolamStrip` chaining) was **deliberately deleted wholesale** on the extrusion restyle — git history has it; don't resurrect it. Rationale: `docs/design/2026-07-14-visual-system.md`.
- **Theme + palette.** `next-themes` with `attribute="class"` toggles `.dark` on `<html>`. Hover/active colors use `var(--accent)` (never hardcode a red/yellow pair with `.dark` overrides). The legacy `--sa-*` aliases are thin aliases so the comic-panel CSS keeps compiling: `--sa-black`/`--sa-white` alias the **fixed** `--ink`/`--paper` and never flip; `--sa-off-white` follows the ground (aliases `--paper-3`, which flips). New code should use `--yellow`/`--red`/`--blue`/`--ink`/`--paper` and the flipping `--background`/`--text` tokens directly. `--sa-green` and the poster hues are gone.
- **Tailwind v4 alpha.** Imported via `@import 'tailwindcss'` in `globals.css` (no `tailwind.config.js`). The `@/*` path alias maps to the repo root (`tsconfig.json`).
- **No texture overlays.** The body is flat paper — the old fractal-noise/radial-gradient wash was removed as an AI-design tell. Don't add grain, noise, or vignette layers back.

#### Extruded panel system (load-bearing)

The site's panel grammar is "flat lineart, extruded in Z" — every raised element is a solid extruded from a butted sheet, the CAD operation restated in CSS. Full rationale (and the rejected alternatives) in `docs/design/2026-07-14-visual-system.md`; the primitives live at the top of `globals.css`. Treat every rule below as load-bearing:

- **Primitives:** `.xsheet` (the grid), `.xcell` (a slot, carries the side faces and the animated `--d` height), `.xcell-face` (the face — `--background` fill, 2px `--text` keyline, so it flips with the theme).
- **Zero-gap butted grids.** Cells butt together; adjacent 2px keylines collapse into one shared scribe line via `margin: -2px 0 0 -2px` on `.xsheet > .xcell`, compensated by `padding: 2px 0 0 2px` on the sheet. **Never set `gap`, `justify-content`, or `align-content` on a sheet** — the collapse depends on contiguous tracks.
- **Geometry.** The footprint never leaves its grid slot; the face lifts up-left by `translate(-d, -d)`. Side faces are skewed pseudo-element strips *inside* the slot on `.xcell`: `::before` is the right face (accent — red by day, yellow at night), `::after` is the bottom face (`--blue`, both themes). They hang off `.xcell` and **not** the face because the face is the thing that translates by `-d` — pseudos on the face would ride along with it instead of staying welded to the footprint. Their keylines are `--text`, same as the face: all the linework inverts together.
- **Heights are binary:** flat `0` (default), `.raised` `12px` (editorial mark — at most 1-2 cells per sheet), hover or keyboard focus `18px`. `--d` is an `@property`-registered length so the lift animates; hover lift is scoped to `@media (hover: hover)`.
- **DOM order IS painter's order.** The camera sits down-right, so a later cell legitimately wins every overlap. **NEVER add z-index to cells** — hover-promoting z-index was tried and rejected; the illusion collapses.
- **Single-owner edges.** Every edge is drawn by exactly one element; shared edges are `border-width: 0` on the non-owner. Diagonal borders are **3px pre-skew** (2.12px perpendicular) because Chromium floors fractional border widths.
- **Faces inherit the theme — no re-anchor.** `.xcell-face` declares no custom properties: every token used inside a face (`--ink-soft`, `--ink-mute`, `--rule`, `--paper-2/3`, `--accent`) is already written to flip, so face interiors are correct for free. An earlier version re-anchored all of them to light-theme values to keep faces lit; that block is **deleted**, and re-adding it is what would pin face interiors back to daylight.
- **Hover and focus never tint the face.** The hover language is the lift plus the title going `--accent` (`.featured .copy:hover h3`, `.fp-lead/.fp-story:hover h3`, `.rec-sheet .xcell:hover .rec-name`). A low-alpha accent wash on the face was tried and rejected by the owner. Focus still draws `outline: 2px solid var(--accent)` **on the face** — a lift alone is not a focus indicator, and the UA ring would hug the static footprint 18px away from where the face now is. Any new sheet must give its title an accent hover, or the cell will have no hover feedback beyond the lift.
- **Nested columns:** a plain grid area stacking two cells (see `.fp-side`) is outside the `.xsheet > .xcell` reach, so the wrapper itself mirrors the `-2px` collapse and the second inner cell collapses the shared keyline (`.fp-side .xcell + .xcell { margin-top: -2px }`). Copy that pattern for any future nested-cell layout.
- **Display type:** `.type-x` extrudes text with stacked 1px `text-shadow` steps (never a single offset — a detached echo reads as double vision). It is for **28px+ page-title h1s only** (blog, projects, publications, 404, `PostHeader`); below that it reads as a misprint.
- **Current adopters** (home page): Recommendations (`.rec-sheet`), the Front package "Around the site" (`.fp-sheet`, with the Projects lead `.fp-lead` raised), and the Featured/Latest-post cell.

#### Comic-panel legacy (dead code)

`components/ComicPanel.tsx` and the `.comic` / `.panel` / `.affiliations-strip` / `.panel-link-hover` CSS are **orphaned** — nothing imports `ComicPanel`, and `/about` and `/projects` were rewritten into the editorial system (`/about` uses `.profile-*` / `.exp-*` / `.section-head`; `/projects` uses utility classes plus `.type-x`). The only remaining `.panel-link-hover` reference is in `components/RecentUpdates.tsx`, which is itself unrendered. The CSS still lives in `globals.css` and its tokens were rewritten so panels would render paper-fixed (lit at night), but it has no consumers: treat all of it as a deletion candidate, not a system to build on. New grids and cards use the extruded sheet (Recommendations replaced the old `.rec-grid` card CSS); new list-row hovers use the editorial pattern below.

### Shaders / 3D

- `components/ShaderCanvas.tsx` is a generic React-Three-Fiber wrapper that takes raw vertex/fragment shader source as props. It exposes `time`, `resolution`, and `performanceLevel` uniforms and downgrades DPR/antialiasing on detected mobile GPUs.
- Shaders live in `shaders/` as `.vert`/`.frag` and are imported as strings via the `raw-loader` rule added in `next.config.js`. `types/glsl.d.ts` provides the module declarations.
- Demo routes (`app/demos/gjk-collision`, `app/demos/implicit-surfaces`) are currently empty placeholders.

### Client-only bits

- `lib/utils.ts` exposes `cn()` (clsx + tailwind-merge) and a `useVisitorCount` hook that hits Upstash Redis directly from the browser. **The Upstash REST URL and token are hardcoded** — they're public-by-design for an INCR-only counter, but be aware before adding any other operations against that store.
- `'use client'` is required for any component using hooks, theme context, or framer-motion. The root layout (`app/layout.tsx`) is a Server Component; `Navbar` (`components/nav.tsx`), `ShaderCanvas`, etc. are client components.

## Visual conventions

### Editorial list-row hover (use across the site)

Any "row of clickable items" pattern — blog index entries, publications entries, future content lists — uses this hover treatment, **not** a background tint:

- Parent: `<Link>` / `<a>` with `className="block group no-underline py-5 border-b border-current/15"`.
- Inside: `flex items-start justify-between gap-6` with content in `flex-1` and an arrow span as the right-side sibling.
- Title: `group-hover:text-[var(--accent)] transition-colors`.
- Arrow span (owner-preferred — keep this): `opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200`, color `text-[var(--accent)]`. Use `→` (`M5 12h14 / M13 6l6 6-6 6`) for internal links and `↗` (`M7 17 17 7 / M7 7h10v10`) for external. 18×18 SVG, currentColor stroke. The same slide-in arrow appears in the sidebar nav (`.sn-arrow`) and the home page `.read-on` / `.more` links.
- Meta line below summary uses the `.meta-line` class (Inter via `--font-sans`, 14px, roman, normal case, muted). Metadata is the sans voice now, but the standing prohibitions survive the switch: never mono/uppercase letterspaced kickers, and never italic metadata — italics are reserved for semantic emphasis in prose.
- Never join metadata with `·` separator glyphs. When a meta row has two logical clusters (role + timeline, stats + updated date, date/read-time + tags), lay them out as two elements with `justify-between`; within a cluster, separate items with flex gaps (`gap-x-4`/`gap-x-5`), not punctuation. Reference: `.exp-meta` on `/about`, repo meta rows on `/projects`.

Reference implementations: `components/posts.tsx` (`PostEntry`) and `app/publications/page.tsx` (`PublicationEntry`).

### Editorial page header (for content-listing pages)

Big serif title with an accent-colored period at the end (an owner-preferred signature — keep it), extruded via `.type-x`, fluid sized via `clamp()`, no eyebrow row, no subtitle by default:

```tsx
<h1
  className="type-x font-medium tracking-tight text-[var(--text)] leading-[0.95]"
  style={{
    fontFamily: 'var(--font-serif), Georgia, serif',
    fontSize: 'clamp(3rem, 2rem + 4vw, 5rem)',
  }}
>
  Title<span className="text-[var(--accent)]">.</span>
</h1>
```

Reference: `app/blog/page.tsx`, `app/publications/page.tsx`.

### Where each visual mode lives

- **Editorial almanac (default)** — home (`app/page.tsx`), global sidebar nav, global footer. New pages should adopt this system: plain-titled `SectionHead`, extruded `.xsheet` panels for grids/cards, paper/ink palette, Young Serif + Newsreader + Inter utility text. (Kolams stay in the footer only.)
- **Comic-panel legacy** — no live consumers. `/about` and `/projects` are already editorial; `ComicPanel.tsx` and the `.comic`/`.panel`/`.affiliations-strip` CSS survive only as unreferenced code awaiting deletion.
- **Blog posts use the full content column** — no `max-w`/`mx-auto` reading column; the owner wants post pages to occupy the same scrollable width as every other page. `PostHeader` uses the editorial page-header treatment (big extruded `.type-x` Newsreader title with accent period, summary, then a `.meta-line`), `.prose` body is 18px Newsreader at 88% ink, and `.prose` h1–h4 use the Young Serif display face like headings everywhere else. No mono-uppercase headings inside prose (h5/h6 are small bold serif). `.prose` figures are panels: paper face, ink keyline, both themes.
- The blog *index* uses the same editorial list-row pattern with year-section headings (`text-3xl md:text-4xl font-bold tracking-tight text-[var(--accent)]`).

## Conventions worth knowing

- TypeScript is configured loosely: `strict: false`, `target: es5`, but `strictNullChecks: true`. Don't expect strict-mode diagnostics; do expect null-check errors.
- Components mix `.tsx` styles: PascalCase filenames for newer additions (`ComicPanel.tsx`, `RecentUpdates.tsx`), lowercase for older ones (`nav.tsx`, `mdx.tsx`, `posts.tsx`). Match the surrounding file when editing.
- The home page (`app/page.tsx`) sources the latest blog post automatically from `getBlogPosts()`, but the recommendations list (`RECS`) is hardcoded — update it when something new is worth surfacing. `components/RecentUpdates.tsx` is no longer rendered but is kept temporarily as a content reference.
