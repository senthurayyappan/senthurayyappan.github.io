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

- **Comic-panel layout.** Most pages compose `components/ComicPanel.tsx` in a CSS grid (see `app/page.tsx`). A panel can be a background image, a title caption (`titlePosition`), a description bar, child content, and/or a link wrapper — all controlled by props. The hover/lift effect comes from the `.panel-link-hover` class in `app/globals.css`.
- **Theme + palette.** `next-themes` with `attribute="class"` toggles `.dark` on `<html>`. Colors are CSS variables in `app/globals.css` (`--sa-black`, `--sa-white`, `--sa-yellow`, `--sa-red`, `--sa-blue`, `--sa-green`, plus `--background`/`--text`/`--accent`/`--muted` aliases). Use these vars rather than hard-coded hex values.
- **Tailwind v4 alpha.** Imported via `@import 'tailwindcss'` in `globals.css` (no `tailwind.config.js`). The `@/*` path alias maps to the repo root (`tsconfig.json`).
- **Halftone overlay.** `html::before` paints a dotted background globally; `--dot-color`/`--dot-opacity`/`--dot-spacing` control it.

### Shaders / 3D

- `components/ShaderCanvas.tsx` is a generic React-Three-Fiber wrapper that takes raw vertex/fragment shader source as props. It exposes `time`, `resolution`, and `performanceLevel` uniforms and downgrades DPR/antialiasing on detected mobile GPUs.
- Shaders live in `shaders/` as `.vert`/`.frag` and are imported as strings via the `raw-loader` rule added in `next.config.js`. `types/glsl.d.ts` provides the module declarations.
- Demo routes (`app/demos/gjk-collision`, `app/demos/implicit-surfaces`) are currently empty placeholders.

### Client-only bits

- `lib/utils.ts` exposes `cn()` (clsx + tailwind-merge) and a `useVisitorCount` hook that hits Upstash Redis directly from the browser. **The Upstash REST URL and token are hardcoded** — they're public-by-design for an INCR-only counter, but be aware before adding any other operations against that store.
- `'use client'` is required for any component using hooks, theme context, or framer-motion. The root layout (`app/layout.tsx`) is a Server Component; `Navbar`, `RecentUpdates`, `ShaderCanvas`, etc. are client components.

## Conventions worth knowing

- TypeScript is configured loosely: `strict: false`, `target: es5`, but `strictNullChecks: true`. Don't expect strict-mode diagnostics; do expect null-check errors.
- Components mix `.tsx` styles: PascalCase filenames for newer additions (`ComicPanel.tsx`, `RecentUpdates.tsx`), lowercase for older ones (`nav.tsx`, `mdx.tsx`, `posts.tsx`). Match the surrounding file when editing.
- The "Recent Updates" panel on the home page (`components/RecentUpdates.tsx`) hardcodes the latest blog post title/summary/slug and three "current" recommendations (language/food/song). Update these strings when shipping a new post or refresh.
