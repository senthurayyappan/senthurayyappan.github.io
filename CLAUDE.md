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

- **Personal almanac.** The home page (`app/page.tsx`) is laid out as an editorial almanac with a sticky left sidebar nav (`components/nav.tsx`) and numbered sections (`§ 01 Latest Dispatch`, `§ 02 From the Blog`, `§ 03 Triptych`, `§ 04 Now`). The two-column shell (`.page-grid` + `.wrap` in `globals.css`) is applied site-wide via `app/layout.tsx`.
- **Vintage Tamil cinema × Japanese editorial.** Paper/ink palette (`--paper` / `--ink`) plus poster accents (`--red-oxide`, `--mustard`, `--indigo`, `--olive`, `--teal`, `--cream`) used sparingly. Yellow appears as a highlighter wash under emphasized words in the hero (`.hero-tag em`).
- **Type system.** Three serif voices, all loaded via `next/font` in `app/layout.tsx`:
  - `--font-serif-display` (DM Serif Display) — h2/h3/feature titles, sidebar nav labels.
  - `--font-serif-body` (Crimson Pro) — body, italic metadata, post titles in lists.
  - `--font-tamil` (Anek Tamil) — Tamil-only flourishes (currently the footer "முற்றும்").
  - `--font-serif` (Source Serif 4) is kept for the blog post `.prose` body.
- **Kolam ornament.** `components/Kolam.tsx` renders a sikku-kolam SVG (continuous line woven around a 3×3 dot grid). Use it via `<Kolam size={...} strokeWidth={...} />` — currently appears as a divider in the footer (over a 1px rule) and as an ornament inside the home `.recs` recommendations card.
- **Theme + palette.** `next-themes` with `attribute="class"` toggles `.dark` on `<html>`. In dark mode `--accent` flips from red-oxide to mustard. The legacy `--sa-*` aliases (`--sa-black`, `--sa-white`, `--sa-red`, etc.) still resolve so existing components compile, but new code should use the paper/ink/poster vars directly.
- **Tailwind v4 alpha.** Imported via `@import 'tailwindcss'` in `globals.css` (no `tailwind.config.js`). The `@/*` path alias maps to the repo root (`tsconfig.json`).
- **Body texture.** `body` paints a subtle SVG fractal-noise + radial-gradient layer (replaces the prior halftone-dot overlay on `html::before`). It's purely decorative; don't rely on it for contrast.

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
- Arrow span: `opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200`, color `text-[var(--accent)]`. Use `→` (`M5 12h14 / M13 6l6 6-6 6`) for internal links and `↗` (`M7 17 17 7 / M7 7h10v10`) for external. 18×18 SVG, currentColor stroke.
- Mono meta line below summary uses `text-[11px] font-mono uppercase tracking-[0.1em] text-[color:color-mix(in_srgb,var(--text)_55%,transparent)]`.

Reference implementations: `components/posts.tsx` (`PostEntry`) and `app/publications/page.tsx` (`PublicationEntry`).

### Editorial page header (for content-listing pages)

Big serif title with an accent-colored period at the end, fluid sized via `clamp()`, no eyebrow row, no subtitle by default:

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
- **Editorial restraint** (Source Serif 4 body, ~640px reading column) — blog post body, publications.
- The blog *index* uses the same editorial list-row pattern with year-section headings (`text-3xl md:text-4xl font-bold tracking-tight text-[var(--accent)]`).

## Conventions worth knowing

- TypeScript is configured loosely: `strict: false`, `target: es5`, but `strictNullChecks: true`. Don't expect strict-mode diagnostics; do expect null-check errors.
- Components mix `.tsx` styles: PascalCase filenames for newer additions (`ComicPanel.tsx`, `RecentUpdates.tsx`), lowercase for older ones (`nav.tsx`, `mdx.tsx`, `posts.tsx`). Match the surrounding file when editing.
- The home page (`app/page.tsx`) sources the latest blog post automatically from `getBlogPosts()`, but the recommendations list (`RECS`) and the "Now" prose (`Now()` component) are hardcoded — update them when something new is worth surfacing. `components/RecentUpdates.tsx` is no longer rendered but is kept temporarily as a content reference.
