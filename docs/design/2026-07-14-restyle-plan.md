# Extruded Visual System Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle senthurayyappan.com to the converged extruded-panel system in `docs/design/2026-07-14-visual-system.md` -- zero-gap grids with honest oblique extrusion, extruded display type, Inter utility text, and a sikku-plait kolam footer.

**Architecture:** One CSS primitive (`.xsheet` / `.xcell` / `.xcell-face` plus an `@property`-registered `--d`) implements the entire panel system; pages adopt it grid by grid so the site is shippable after every task. The kolam generator is replaced wholesale. Imagery conversion is owner-gated and explicitly deferred.

**Tech Stack:** Next.js static export, Tailwind v4 alpha (`@import 'tailwindcss'`, Lightning CSS minifier), `next/font`, no test runner -- verification is `npm run build` + inspection of the **minified** CSS + browser checks in both themes.

**Repo:** `external/senthurayyappan.github.io` (work on branch `restyle/extrusion`; merging to `main` deploys).

**Read first:** `docs/design/2026-07-14-visual-system.md` (the spec -- geometry rationale, line-weight ownership, painter's order), then `CLAUDE.md`.

---

## File structure

| File | Responsibility |
|---|---|
| `app/globals.css` | New: extruded-panel primitives, display-type extrusion utility. Modified: retire `.rec-grid`/`.rec-cell` card CSS, adjust `.featured`, `.front-package` |
| `app/page.tsx` | Adopt `.xsheet`/`.xcell` for Recommendations, Front package, Featured |
| `app/layout.tsx` | Load Inter via `next/font`, expose `--font-sans` |
| `components/Kolam.tsx` | Replaced: sikku plait generator (two weaving strands, real over/under) |
| `components/footer.tsx` | Use the new `KolamPlait` |
| `CLAUDE.md` | Document the panel system + new kolam as load-bearing |

Painter's order needs **no z-index anywhere**: positioned siblings with `z-index: auto` paint in DOM order, and row-major DOM order guarantees every cell that could be overlapped from down-right comes later. Do not add z-index to cells; adding it is how the illusion breaks.

---

### Task 0: Branch

- [ ] **Step 0.1: Create the working branch**

```bash
cd external/senthurayyappan.github.io
git checkout main && git pull
git checkout -b restyle/extrusion
```

### Task 1: Extruded-panel primitives in `globals.css`

**Files:**
- Modify: `app/globals.css` (append a new section after the palette block, before the legacy comic CSS)

- [ ] **Step 1.1: Add the panel system CSS**

Append this block. Every numeric choice is from the spec -- do not "improve" it:

```css
/* ------------------------------------------------------------------ */
/* Extruded panel system -- docs/design/2026-07-14-visual-system.md    */
/* Geometry: footprint stays in the grid slot; the face lifts up-left  */
/* by --d; side faces are skewed strips inside the slot. Camera is     */
/* down-right, so DOM order IS painter's order: never add z-index.     */
/* ------------------------------------------------------------------ */
@property --d {
  syntax: '<length>';
  inherits: true;
  initial-value: 0px;
}

.xsheet {
  display: grid;
  gap: 0;
  /* compensates the cells' -2px keyline-collapse shift */
  padding: 2px 0 0 2px;
}
.xsheet > .xcell {
  /* butt the cells; adjacent 2px keylines collapse into one */
  margin: -2px 0 0 -2px;
}

.xcell {
  position: relative;
  display: flex;
  --d: 0px;
  transition: --d 0.16s ease;
}
a.xcell {
  text-decoration: none;
  color: inherit;
}
.xcell.raised { --d: 12px; }
.xcell:hover,
.xcell:focus-visible { --d: 18px; }

.xcell-face {
  position: relative;
  flex: 1;
  display: block;
  background: var(--paper);
  border: 2px solid var(--ink);
  padding: 16px 18px;
  transform: translate(calc(var(--d) * -1), calc(var(--d) * -1));
  transition: background 0.16s ease;
}
.xcell:hover .xcell-face,
.xcell:focus-visible .xcell-face {
  background: color-mix(in srgb, var(--accent) 12%, var(--paper));
}

/* Right side face: accent. Single-owner edges; diagonals 3px pre-skew
   (2.12px perpendicular) because Chromium floors fractional borders. */
.xcell::before {
  content: '';
  position: absolute;
  top: calc(var(--d) * -1);
  left: calc(100% - var(--d));
  width: var(--d);
  height: 100%;
  box-sizing: border-box;
  background: var(--accent);
  border: 0 solid var(--ink);
  border-top-width: min(calc(var(--d) * 99), 3px);
  border-right-width: min(calc(var(--d) * 99), 2px);
  border-bottom-width: min(calc(var(--d) * 99), 3px);
  transform: skewY(45deg);
  transform-origin: 0 0;
}
/* Bottom side face: blue, both themes. */
.xcell::after {
  content: '';
  position: absolute;
  top: calc(100% - var(--d));
  left: calc(var(--d) * -1);
  width: 100%;
  height: var(--d);
  box-sizing: border-box;
  background: var(--blue);
  border: 0 solid var(--ink);
  border-bottom-width: min(calc(var(--d) * 99), 2px);
  border-left-width: min(calc(var(--d) * 99), 3px);
  transform: skewX(45deg);
  transform-origin: 0 0;
}

@media (prefers-reduced-motion: reduce) {
  .xcell, .xcell-face { transition: none; }
}

/* Extruded display type -- 28px+ headings only (below that it reads as
   a misprint). Stacked 1px steps, NEVER a single offset shadow. */
.type-x {
  text-shadow:
    1px 1px 0 var(--accent),
    2px 2px 0 var(--accent),
    3px 3px 0 var(--accent);
}
```

- [ ] **Step 1.2: Build and inspect the minified output**

```bash
npm run build
grep -o '@property --d' out/_next/static/css/*.css
grep -o 'min(calc(var(--d)' out/_next/static/css/*.css | head -1
grep -o 'color-mix(in srgb,var(--accent) 12%' out/_next/static/css/*.css
```

Expected: all three greps match. If `min(calc(var(--d)*99),3px)` got mangled (the Lightning CSS `0%`-collapse class of bug), stop and fix before proceeding -- this is the known production-only failure mode.

- [ ] **Step 1.3: Commit**

```bash
git add app/globals.css
git commit -m "feat(css): extruded panel primitives (.xsheet/.xcell) and display-type extrusion"
```

### Task 2: Recommendations grid adopts the sheet

**Files:**
- Modify: `app/page.tsx` (the `Recommendations` component, ~line 331)
- Modify: `app/globals.css` (`.rec-grid` block, ~line 498)

- [ ] **Step 2.1: Rewrite the Recommendations JSX**

Replace the `Recommendations` function body's grid with:

```tsx
function Recommendations() {
  return (
    <section className="section" id="recommendations">
      <SectionHead title="Recommendations" />
      <div className="xsheet rec-sheet">
        {RECS.map((r) => (
          <a
            key={r.name}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="xcell"
          >
            <span className="xcell-face">
              <span className="rec-meta">
                <span className="rec-kind">{r.kind}</span>
                <span className="rec-glyph">{r.glyph}</span>
              </span>
              <span className="rec-name">{r.name}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
```

No cell is `raised` here -- restraint; hover does the work.

- [ ] **Step 2.2: Replace the `.rec-grid`/`.rec-cell` CSS**

Delete the `.rec-grid`, `.rec-cell`, `.rec-cell:last-child`, `.rec-cell:hover ...` blocks. Keep `.rec-meta`, `.rec-kind`, `.rec-glyph`, `.rec-name` typography (adjust selectors so they no longer depend on `.rec-cell`), and add:

```css
.rec-sheet { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 720px) {
  .rec-sheet { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2.3: Verify in the browser**

Run `npm run dev`. On `/`: the three recommendation cells butt together with single 2px lines; hovering any cell lifts it 18px up-left with accent right face, blue bottom face, tinted face; no cell changes stacking on hover; text crisp during the animation. Check dark mode: right faces yellow.

- [ ] **Step 2.4: Commit**

```bash
git add app/page.tsx app/globals.css
git commit -m "feat(home): recommendations grid becomes a zero-gap extruded sheet"
```

### Task 3: Front package and Featured adopt the sheet

**Files:**
- Modify: `app/page.tsx` (`FrontPackage` ~line 223, `Featured` ~line 127)
- Modify: `app/globals.css` (`.front-package`, `.fp-lead`, `.fp-story`, `.featured` blocks)

- [ ] **Step 3.1: FrontPackage becomes a 2-column sheet, Projects lead raised**

Keep all inner content markup (photo, dek, teaser list, arrows) but change the wrappers:

```tsx
<div className="xsheet fp-sheet">
  <Link href="/projects" className="xcell raised fp-lead">
    <span className="xcell-face">
      {/* existing fp-lead-photo + h3 + dek + teaser-list + more, unchanged */}
    </span>
  </Link>
  <div className="fp-side">
    <Link href="/about" className="xcell fp-story">
      <span className="xcell-face">{/* existing about content */}</span>
    </Link>
    <Link href="/publications" className="xcell fp-story">
      <span className="xcell-face">{/* existing publications content */}</span>
    </Link>
  </div>
</div>
```

CSS: `.fp-sheet { grid-template-columns: 3fr 2fr; }` (single column under 960px). `.fp-side` stacks its two cells with the same -2px collapse (`.fp-side { display:flex; flex-direction:column; } .fp-side .xcell + .xcell { margin-top:-2px; }`). Move any border/hover styling off `.fp-lead`/`.fp-story` -- the face owns it now. The `fp-lead-photo` keeps its own bottom keyline; drop its outer border if it doubles the face border.

- [ ] **Step 3.2: Featured post becomes a single raised cell**

Wrap the existing `.featured` two-column content in one sheet with one raised cell:

```tsx
<div className="xsheet">
  <div className="xcell raised">
    <div className="xcell-face featured">
      {/* existing img-frame + copy children unchanged */}
    </div>
  </div>
</div>
```

Remove any standalone border on `.featured`/`.img-frame` that doubles the face keyline.

- [ ] **Step 3.3: Verify in the browser**

`/` in both themes: Projects lead rests raised at 12px; hovering About/Publications lifts them; the raised lead's face overlaps up-left into the page margin, never covering neighbour text; Featured sits raised above the posts list. Resize to mobile width: single column, extrusions intact, nothing clipped by `overflow`.

- [ ] **Step 3.4: Commit**

```bash
git add app/page.tsx app/globals.css
git commit -m "feat(home): front package and featured post adopt the extruded sheet"
```

### Task 4: Display-type extrusion on page titles

**Files:**
- Modify: `app/blog/page.tsx`, `app/publications/page.tsx`, `app/projects/page.tsx`, `app/gallery/page.tsx` (the `<h1>` editorial headers)
- Modify: `components/PostHeader.tsx` (post title `<h1>`)

- [ ] **Step 4.1: Add `type-x` to each editorial `<h1>`**

Each page header h1 (the `clamp(3rem, ...)` ones) gains the class:

```tsx
<h1 className="type-x font-medium tracking-tight ..." style={{ ... }}>
```

Do **not** add it to `.section-head h2` (those are ~22px -- below the 28px threshold the spec sets), nor to any list-row or card title.

- [ ] **Step 4.2: Verify**

Every page title shows a continuous 3px accent side face welded to the glyphs -- no detached echo, no double vision. Dark mode: yellow extrusion. If any title wraps onto a busy background, confirm legibility.

- [ ] **Step 4.3: Commit**

```bash
git add app/blog/page.tsx app/publications/page.tsx app/projects/page.tsx app/gallery/page.tsx components/PostHeader.tsx
git commit -m "feat(type): extruded display treatment on editorial page titles"
```

### Task 5: Inter for utility text

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css` (`.meta-line`, `.hero-folio`, `.post-row .date`, `.post-row .read`, `.foot-copy`)

- [ ] **Step 5.1: Load Inter alongside the serifs**

In `app/layout.tsx`, alongside the existing `next/font` serif loaders:

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
})
```

and add `inter.variable` to the `<html>` className list where the serif variables are applied.

- [ ] **Step 5.2: Apply to utility text only**

In `globals.css`, switch font-family to `var(--font-sans), system-ui, sans-serif` for: `.meta-line`, `.hero-folio`, `.post-row .date`, `.post-row .read`, `.foot-copy`, `.exp-stamp`. Sizes stay as-is (9-14px range). Body, prose, titles, nav labels stay serif -- Inter is utility text only, per spec.

- [ ] **Step 5.3: Verify + commit**

Metadata rows render in Inter and remain muted/quiet; nothing else changed face.

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat(type): Inter for utility text (metadata, folio, stamps)"
```

### Task 6: Kolam plait

**Files:**
- Replace: `components/Kolam.tsx`
- Modify: `components/footer.tsx`

- [ ] **Step 6.1: Replace `components/Kolam.tsx` with the plait generator**

The medallion generator (D4 matrices, loop fill) is deleted -- this is the one piece of the redesign that discards working code, per spec. New file:

```tsx
// A sikku plait: two counter-phase strands weaving through a row of pulli
// dots with REAL alternating over/under crossings. The casing that produces
// the under-pass is always the ground colour (--background), so the weave
// inverts for free at night. Footer border ONLY -- see CLAUDE.md.

const P = 24 // px between crossings (half-period)
const A = 10 // strand amplitude
const STROKE = 1.8
const CASING = STROKE * 3.2
const DOT_R = 1.6
const CLIP_R = 5.5 // reclaim radius at alternate crossings

function strandPath(n: number, y: number, sign: 1 | -1) {
  // n half-waves of a sine approximated by quadratic beziers; control
  // offset 4/PI * A reproduces the sine peak.
  const c = (4 / Math.PI) * A
  let s: 1 | -1 = sign
  let d = `M 0 ${y}`
  for (let i = 0; i < n; i++) {
    const xa = i * P
    d += ` Q ${xa + P / 2} ${y + s * c}, ${xa + P} ${y}`
    s = (s * -1) as 1 | -1
  }
  return d
}

export function KolamPlait({ segments = 19 }: { segments?: number }) {
  const n = Math.max(2, segments)
  const y = A + STROKE + 2
  const w = n * P
  const h = 2 * y
  const a = strandPath(n, y, 1)
  const b = strandPath(n, y, -1)
  // crossings at x = i*P for i in 1..n-1; strand A is reclaimed (rides
  // over) at odd crossings, strand B rides over at even ones.
  const reclaim: number[] = []
  for (let i = 1; i < n; i++) if (i % 2 === 1) reclaim.push(i * P)
  const dots: number[] = []
  for (let i = 0; i < n; i++) dots.push(i * P + P / 2)

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="kolam-reclaim">
          {reclaim.map((x) => (
            <circle key={x} cx={x} cy={y} r={CLIP_R} />
          ))}
        </clipPath>
      </defs>
      {/* 1: strand A ink */}
      <path d={a} stroke="currentColor" strokeWidth={STROKE} />
      {/* 2+3: strand B rides over everywhere -- ground casing, then ink */}
      <path d={b} stroke="var(--background)" strokeWidth={CASING} />
      <path d={b} stroke="currentColor" strokeWidth={STROKE} />
      {/* 4: reclaim A at alternate crossings so the weave alternates */}
      <g clipPath="url(#kolam-reclaim)">
        <path d={a} stroke="var(--background)" strokeWidth={CASING} />
        <path d={a} stroke="currentColor" strokeWidth={STROKE} />
      </g>
      {/* 5: pulli dots in the eyes */}
      {dots.map((x) => (
        <circle key={x} cx={x} cy={y} r={DOT_R} fill="currentColor" />
      ))}
    </svg>
  )
}

export default KolamPlait
```

- [ ] **Step 6.2: Update the footer**

```tsx
import KolamPlait from './Kolam'

export default function Footer() {
  return (
    <footer className="foot wrap">
      <div className="foot-ornament">
        <KolamPlait segments={19} />
      </div>
      <div className="foot-row">
        <span className="foot-end">The End</span>
        <span className="foot-copy">
          © {new Date().getFullYear()} Senthur Ayyappan
        </span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 6.3: Fix any other Kolam imports**

```bash
grep -rn "from './Kolam'\|from '@/components/Kolam'\|KolamStrip" app components
```

Expected: only `footer.tsx`. If anything else imports `KolamStrip` or the old `Kolam` default, update or remove it.

- [ ] **Step 6.4: Verify the weave**

In the browser, zoom the footer: the over/under must be REAL -- at each crossing exactly one strand shows a gap, and the gaps alternate along the row. Dots sit in the eyes. Toggle dark mode: the casing follows the ground automatically (rice flour on dark earth). A bead chain (no visible under-passes) means the clip circles are misplaced -- check `CLIP_R` covers the crossing but not the neighbouring peaks.

- [ ] **Step 6.5: Commit**

```bash
git add components/Kolam.tsx components/footer.tsx
git commit -m "feat(kolam): replace medallion generator with a woven sikku plait"
```

### Task 7: Documentation

**Files:**
- Modify: `CLAUDE.md` (visual-system section)

- [ ] **Step 7.1: Update CLAUDE.md**

Rewrite the "Kolam ornament" bullet to describe the plait (two counter-phase strands, ground-colour casing, alternating clip-path reclaims, footer only) and add a "Extruded panel system" bullet: `.xsheet`/`.xcell` geometry summary, the DOM-order-is-painter's-order rule (**never add z-index to cells**), single-owner edge rule with 3px diagonals, binary heights 12/0/18, `type-x` threshold (28px+ only), pointer to `docs/design/2026-07-14-visual-system.md`. Mark `.rec-grid`-era card CSS as deleted.

- [ ] **Step 7.2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document the extruded panel system and plait kolam as load-bearing"
```

### Task 8: Full verification + PR

- [ ] **Step 8.1: Production build gate**

```bash
npm run build
```

Then against `out/_next/static/css/*.css` verify: `@property --d` present; `min(calc(` expressions intact; `color-mix` percentages intact; no hex outside the five tokens plus ink/paper alpha derivations (`grep -oE '#[0-9a-fA-F]{3,8}' out/_next/static/css/*.css | sort -u` and audit the list).

- [ ] **Step 8.2: Serve the static export and sweep both themes**

```bash
npx serve out
```

Every page, light and dark: hover every grid -- no cell changes stacking order, no seam renders heavier than 2px, no neighbour text covered at rest, no text blur during hover animation, kolam weave correct on both grounds.

- [ ] **Step 8.3: Push branch and open PR (do NOT merge -- merging deploys)**

```bash
PONYTAIL_REVIEWED=1 git push -u origin restyle/extrusion
gh pr create --title "Restyle: extruded visual system" --body "Implements docs/design/2026-07-14-visual-system.md ...

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

Owner reviews the deploy preview via local build; merge is the owner's call (deploys to the live site).

---

## Deferred (owner-gated, not in this plan)

- **Imagery to lineart:** requires owner-produced `currentColor` SVG exports. Spec says trial-convert two images first (`/projects/osl-v2.jpg` and one post image) and judge in place before committing to the set. The panel system does not depend on it.
- **`/about` comic-panel retirement:** `/about` and its `.exp-grid` still render inside the new shell; migrating them to `.xsheet` is a follow-up with its own layout decisions (the experience rows are not a uniform grid).
- **`public/palette.png`:** still orphaned; regenerate from the five tokens or delete -- owner's call.
