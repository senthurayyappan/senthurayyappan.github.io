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
- **The logo palette is the whole palette.** Exactly five colours exist, taken verbatim from the logo: `--yellow #f9c90a`, `--red #ef2841`, `--blue #007d7e`, `--black #000000`, `--white #f6f4ee`. **Never introduce a sixth hue.** Every neutral (`--ink-soft`, `--ink-mute`, `--rule`, `--paper-2/3`) is `--black` or `--white` at reduced alpha — never a new tint, and never a warm brown. Light mode is black-on-white, dark mode is a true inversion (white-on-`#000`). `--accent` is red in light, yellow in dark; yellow-on-black is the `::selection` highlight and the "Current" stamp.
  - Historical note: an earlier palette drifted off-brand into invented hues (`--red-oxide #a6382e`, `--mustard #c9a227`, `--indigo`, `--teal #24a68e`, `--olive`, `--cream`) plus a warm-brown ink ramp. These are all deleted. `public/palette.png` is a **stale, orphaned** swatch file whose red (`#a6382e`) is *not* the brand red — do not source colours from it.
- **Type system.** Two Latin faces, loaded via `next/font` in `app/layout.tsx`:
  - `--font-serif-display` (Young Serif) — h2/h3/feature titles, sidebar nav labels.
  - `--font-serif-body` (Newsreader, variable with `opsz` axis + italic) — body, metadata, post titles in lists, and the blog `.prose`. `--font-serif` is a CSS alias to it (set in `:root`) so older inline styles keep resolving.
- **Kolam ornament.** `components/Kolam.tsx` is a deterministic sikku-kolam generator (after Bárbara Almeida's Processing sketch): a checkerboard of tiles drawn as rounded rects whose corners are either fully rounded (smooth S-curve with the diagonal neighbour) or square (X crossing), driven by a seeded 0/1 corner matrix; pulli dots fill every enclosed cell. The unit is a **radially (D4) symmetric medallion** — each corner value is stamped onto its full dihedral orbit, and the medallion side `n` must stay ODD so the drawn checkerboard survives 90° rotation — because the owner explicitly wants each motif to be radially symmetric like a real kolam, arranged as a repeating border rather than a random field. A kolam authenticity rule is enforced: **no drawn loop may have zero rounded corners** (a plain orthogonal square never appears in real kolams — lines curve around every dot); invalid matrices deterministically re-roll the seed. Closed loops are **filled from the logo palette indexed by shape** (rounded-corner count 0–4 → none/none/blue/accent/blue), so colouring follows the symmetry and flips with the theme. `<KolamStrip count n seed p altN? altSeed? />` **chains** medallions with zero gap, the traditional way borders are joined from small dot motifs: the pulli columns stay evenly spaced across the joins and neighbouring border arcs meet in tangent kisses, so the border reads as one continuous chain (never re-add spacing between medallions — the owner wants the seamless lattice). `altN`/`altSeed` alternate a second smaller vertically-centred motif (big-motif/small-connector rhythm); `n=1` degenerates to the classic single-row circle chain, good for lightweight separators. Used as the footer divider (`.foot-ornament` — the footer is padded to align with the main content column, not the full wrap); the default `Kolam` export is a single medallion for smaller marks. Lower `p` → more crossings/longer weave. It is the site's signature mark. **Where kolams go: the footer border ONLY** (`components/footer.tsx`: alternating 5/3 chained medallions). The owner tried and rejected kolams in the sidebar nav, beside year headings, atop `PostFooter`, and on the 404 page — don't reintroduce them anywhere without being asked; plain 1px rules are correct everywhere else.
- **Theme + palette.** `next-themes` with `attribute="class"` toggles `.dark` on `<html>`. Hover/active colors use `var(--accent)` (never hardcode a red/yellow pair with `.dark` overrides). The legacy `--sa-*` aliases (`--sa-black`, `--sa-white`, `--sa-red`, etc.) are now thin aliases onto the five brand vars so the comic-panel CSS keeps compiling; new code should use `--yellow`/`--red`/`--blue`/`--black`/`--white` and the `--paper`/`--ink` surfaces directly. `--sa-green` and the poster hues are gone.
- **Tailwind v4 alpha.** Imported via `@import 'tailwindcss'` in `globals.css` (no `tailwind.config.js`). The `@/*` path alias maps to the repo root (`tsconfig.json`).
- **No texture overlays.** The body is flat paper — the old fractal-noise/radial-gradient wash was removed as an AI-design tell. Don't add grain, noise, or vignette layers back.

#### Comic-panel legacy

`components/ComicPanel.tsx` and the `.comic` / `.panel` / `.affiliations-strip` CSS still exist and are used by `/about` and `/projects`. Don't introduce comic panels into new pages — they're carried forward only so existing showcase pages keep working until they're individually rewritten into the editorial system. The `.panel-link-hover` class is similarly legacy; new list-row hovers should use the editorial pattern below.

### Shaders / 3D

- `components/ShaderCanvas.tsx` is a generic React-Three-Fiber wrapper that takes raw vertex/fragment shader source as props. It exposes `time`, `resolution`, and `performanceLevel` uniforms and downgrades DPR/antialiasing on detected mobile GPUs.
- Shaders live in `shaders/` as `.vert`/`.frag` and are imported as strings via the `raw-loader` rule added in `next.config.js`. `types/glsl.d.ts` provides the module declarations.
- Demo routes (`app/demos/gjk-collision`, `app/demos/implicit-surfaces`) are currently empty placeholders.

### Client-only bits

- `lib/utils.ts` exposes `cn()` (clsx + tailwind-merge) and a `useVisitorCount` hook that hits Upstash Redis directly from the browser. **The Upstash REST URL and token are hardcoded** — they're public-by-design for an INCR-only counter, but be aware before adding any other operations against that store.
- `'use client'` is required for any component using hooks, theme context, or framer-motion. The root layout (`app/layout.tsx`) is a Server Component; `Navbar`, `RecentUpdates`, `ShaderCanvas`, etc. are client components.

## Visual conventions

### Editorial list-row hover (use across the site)

Any "row of clickable items" pattern — blog index entries, publications entries, future content lists — uses this hover treatment, **not** a background tint:

- Parent: `<Link>` / `<a>` with `className="block group no-underline py-5 border-b border-current/15"`.
- Inside: `flex items-start justify-between gap-6` with content in `flex-1` and an arrow span as the right-side sibling.
- Title: `group-hover:text-[var(--accent)] transition-colors`.
- Arrow span (owner-preferred — keep this): `opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200`, color `text-[var(--accent)]`. Use `→` (`M5 12h14 / M13 6l6 6-6 6`) for internal links and `↗` (`M7 17 17 7 / M7 7h10v10`) for external. 18×18 SVG, currentColor stroke. The same slide-in arrow appears in the sidebar nav (`.sn-arrow`) and the home page `.read-on` / `.more` links.
- Meta line below summary uses the `.meta-line` class (Newsreader roman, 14px, normal case, muted). Never use tiny mono/uppercase letterspaced kickers for metadata, and don't set metadata in italics — both treatments were removed site-wide (the owner dislikes italic metadata; italics are reserved for semantic emphasis in prose).
- Never join metadata with `·` separator glyphs. When a meta row has two logical clusters (role + timeline, stats + updated date, date/read-time + tags), lay them out as two elements with `justify-between`; within a cluster, separate items with flex gaps (`gap-x-4`/`gap-x-5`), not punctuation. Reference: `.exp-meta` on `/about`, repo meta rows on `/projects`.

Reference implementations: `components/posts.tsx` (`PostEntry`) and `app/publications/page.tsx` (`PublicationEntry`).

### Editorial page header (for content-listing pages)

Big serif title with an accent-colored period at the end (an owner-preferred signature — keep it), fluid sized via `clamp()`, no eyebrow row, no subtitle by default:

```tsx
<h1
  className="font-medium tracking-tight text-[var(--text)] leading-[0.95]"
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

- **Editorial almanac (default)** — home (`app/page.tsx`), global sidebar nav, global footer. New pages should adopt this system: numbered `SectionHead`, kolam dividers, paper/ink palette, DM Serif Display + Crimson Pro.
- **Comic-panel legacy** — `/about` and `/projects` still use `ComicPanel`. They render fine inside the new sidebar shell but should eventually be rewritten into the editorial system.
- **Blog posts use the full content column** — no `max-w`/`mx-auto` reading column; the owner wants post pages to occupy the same scrollable width as every other page. `PostHeader` uses the editorial page-header treatment (big Newsreader title with accent period, summary, then a `.meta-line`), `.prose` body is 18px Newsreader at 88% ink, and `.prose` h1–h4 use the Young Serif display face like headings everywhere else. No mono-uppercase headings inside prose (h5/h6 are small bold serif).
- The blog *index* uses the same editorial list-row pattern with year-section headings (`text-3xl md:text-4xl font-bold tracking-tight text-[var(--accent)]`).

## Conventions worth knowing

- TypeScript is configured loosely: `strict: false`, `target: es5`, but `strictNullChecks: true`. Don't expect strict-mode diagnostics; do expect null-check errors.
- Components mix `.tsx` styles: PascalCase filenames for newer additions (`ComicPanel.tsx`, `RecentUpdates.tsx`), lowercase for older ones (`nav.tsx`, `mdx.tsx`, `posts.tsx`). Match the surrounding file when editing.
- The home page (`app/page.tsx`) sources the latest blog post automatically from `getBlogPosts()`, but the recommendations list (`RECS`) is hardcoded — update it when something new is worth surfacing. `components/RecentUpdates.tsx` is no longer rendered but is kept temporarily as a content reference.
