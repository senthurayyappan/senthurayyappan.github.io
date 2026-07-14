# Visual system: extruded comic lineart

Status: approved, not yet implemented
Date: 2026-07-14

## The idea in one line

**Flat lineart, extruded in Z.** Every mark on the site is drawn as a solid with an
ink keyline, and every solid is extruded along the same axis at the same angle --
the panel, the display type, and the logo all obey one rule.

This is not decoration. Senthur's research is robot codesign: co-evolving a machine's
3D morphology and its control policy. A site whose entire visual grammar is
"flat drawing, given depth" is the thesis restated in ink.

## Why not the obvious alternatives

- **Pure shadcn minimal** was rejected: clean and professional, but generic. Strip the
  content out and it is any startup blog.
- **Generic neubrutalism** (hard keyline + flat black offset shadow) was rejected as
  equally generic -- it was the dominant web look from roughly 2022-2024.
- The escape from both is that the chrome is derived from **the logo's own
  construction**, which a template cannot land on by accident.

## Palette -- five tokens, no pure black

| Token | Value | Role |
|---|---|---|
| `--paper` | `#f6f4ee` | light ground; panel faces **in both themes** |
| `--ink` | `#15130d` | text, keylines, **and the dark ground** |
| `--yellow` | `#f9c90a` | accent in dark; panel right face at night |
| `--red` | `#ef2841` | accent in light; panel right face by day |
| `--blue` | `#007d7e` | panel bottom face, **both themes** |

`--ink` is the warm tonal mirror of `--paper` -- same warm bias (red high, blue low),
inverted lightness. Pure `#000000` was tried and rejected: the paper is warm, and a
neutral black fights it.

**One ink serves as text, keyline, and dark ground.** Ink-on-paper is 16.7:1, and that
holds whether paper is the figure or the field. This is what makes a single token
possible, and it is why the keyline can stay dark in *both* themes.

Every neutral is `--ink` or `--paper` at reduced alpha. Never introduce a sixth hue.
`public/palette.png` is a stale orphaned swatch file -- do not source colours from it.

## Dark mode is night, not inversion

The panels do **not** flip. They stay paper -- lit physical objects -- with ink keylines
and their coloured side faces intact. Only the ground goes dark and the prose sitting
on that ground goes light.

The rationale is how comics actually handle night: **the ink is always black, even in a
night scene.** What changes after dark is the fills, not the linework. Batman has the
same outline at midnight as at noon.

The practical consequence is that a dark panel face is impossible -- an ink keyline on a
dark face is ~1.2:1 contrast and the outline that defines the whole language dissolves.
The alternatives (white keylines, or no keylines) were both tried and rejected.

Long-form prose lives **outside** panels, directly on the ground, so night reading stays
comfortable.

## The grid: a butted sheet with extruded cells

Grids and tables are **zero-gap**: cells butt together into one sheet, and adjacent
keylines collapse into a single shared 2px scribe line (each cell after the first
column/row pulls back 2px). A raised cell is extruded straight out of that sheet --
the literal CAD operation: sketch a grid on a plane, select a face, extrude.

### The geometry (load-bearing -- the first attempt got it wrong)

The first mockups kept the content face glued to its grid slot and bolted side faces
on *outside* it. That put the solid's implied footprint off-grid while its top face
stayed coplanar with the flat neighbours -- two contradictory depth cues at once. It
read as a rectangle with two coloured borders, and no amount of styling fixed it.
The correct construction:

- **The footprint never moves.** The cell's slot in the grid is the solid's base;
  its edges stay flush with the flat neighbours' scribe lines.
- **The face lifts up-left** by the extrusion height `d`:
  `transform: translate(-d, -d)`. The implied camera sits down-right.
- **Side faces are skewed parallelograms** connecting the lifted face back to the
  footprint, both *inside* the cell's own slot: right face is a `width: d` strip at
  the right edge under `skewY(45deg)`; bottom face is a `height: d` strip at the
  bottom edge under `skewX(45deg)`. They meet in a mitered corner edge.
- **Right side face = accent** (`--red` by day, `--yellow` at night).
  **Bottom side face = `--blue`**, both themes.
- **Fixed painter's order.** Cells further down-right always paint in front
  (z-index derived from grid position, row + col) and hover **never** changes it.
  A lifted face only ever invades up-left, and the down-right cell legitimately
  wins every overlap -- occlusion, not collision. Hover-promoting z-index was tried
  and rejected: the block pops over everything and the illusion collapses.
- **No drop shadows.** At zero gap there is no ground between cells to receive one,
  and soft blur fights the flat ink language.

A true CSS-3D perspective version (real cuboids in a `perspective` camera) was
prototyped and rejected: a real camera shows near cells almost no side face, and
perspective transforms rasterize text off the pixel grid -- the type blurs.

### Line weights: every edge has exactly one owner

Stacked keylines read as a misprint. The face draws its own 2px border including
both seams; the right side face draws the outer diagonals and the miter; the bottom
face draws only its outer horizontal edge and outer diagonal. Shared edges are
`border-width: 0` on the non-owner. Diagonal borders are **3px pre-skew** (2.12px
perpendicular after the 45-degree shear) because Chromium rounds fractional border
widths down to whole px -- the exact 2.83px computes to 2px and renders thin.

### Heights: binary, not a scale

| State | Height |
|---|---|
| Flat (default) | 0 |
| Raised -- editorial mark: current work, featured | 12px |
| Hovered (any cell) | 18px |

Raise at most 1-2 cells per grid, ideally on a diagonal. If everything is raised,
nothing is. Varied per-cell heights were tried and rejected as noise.

### Hover

Any cell rises to 18px and its face tints with the accent at low alpha. Flat cells
become solids on hover, so every cell is interactive; resting height only says which
ones matter. The lift is one animated `@property`-registered custom length driving
pure 2D changes (face translate, side-face growth) -- text stays on the pixel grid
and never blurs. Side-face borders use `min(calc(var(--d)*99), Npx)` so they vanish
exactly when the cell is flat.

### The padding rule

A raised face overlaps its up-left neighbours by its height. Cell padding of
12-15px keeps neighbour text clear of the resting 12px overlap; a hovered face may
graze a neighbour's text zone by a few px, which reads as an object passing in
front, not a bug.

## Display type: continuous extrusion, single accent

Headings are extruded on the same axis as the panel, in the **accent** colour -- red in
light, yellow in dark.

**Critical:** the offset must be built from **stacked 1px steps**, not a single
`text-shadow` at 3px:

```css
/* correct -- a solid side face welded to the glyph */
text-shadow: 1px 1px 0 var(--accent), 2px 2px 0 var(--accent), 3px 3px 0 var(--accent);

/* WRONG -- a detached duplicate. Colour floats inside the counters and free of the
   stems; the eye reads two overlapping letterforms. Illegible. */
text-shadow: 3px 3px 0 var(--accent);
```

A detached echo is double vision. A continuous extrusion is depth. This distinction was
the single hardest-won point in the design.

Only **one** accent layer. Two layers (red + teal) was tried and rejected as unreadable.

### Size threshold

Extruded type needs stroke weight for the side face to sit against.

| Element | Depth |
|---|---|
| Display headings (page titles, section heads, hero), 28px+ | 3px |
| Card titles (~20px) | 2px max |
| Body, nav, metadata, list rows | **none** |

Below the threshold the extrusion stops reading as depth and starts reading as a
printing error -- the exact failure we fixed.

## Typography

**Keep both serifs.** The page now carries extruded two-tone panels and misregistered
display type; the serifs are the ballast that makes this read as a *publication* rather
than a product landing page.

- `--font-serif-display` (Young Serif) -- display headings, section heads.
- `--font-serif-body` (Newsreader) -- body, prose, post titles.
- **Inter** -- utility text only: kickers, metadata, timestamps, nav labels. It is
  genuinely better than a serif at 9-12px and gives the clean shadcn texture exactly
  where it belongs.

What we take from shadcn is its **restraint**, not its typeface: the spacing scale, the
muted-foreground token for secondary text, tight heading tracking, generous whitespace.
The sans-serif is incidental to what makes shadcn feel clean, and swapping Newsreader
for Inter would remove the exact counterweight that keeps the comic chrome professional.

## Kolam: a real sikku plait

The current `components/Kolam.tsx` (D4-symmetric medallion from a seeded corner matrix,
closed loops filled by shape) is **replaced**, not restyled. It is the one piece of this
redesign that discards working code.

The new generator is much simpler:

- Two counter-phase sine strands, approximated with quadratic Beziers
  (control offset `4/pi * amplitude` approximates a sine peak).
- **Tight weave**: period 24, amplitude 10, stroke 1.8px.
- Pulli dots at the lens centres (half-period midpoints).
- Crossings every half-period, **alternating which strand rides over** -- achieved by
  drawing strand A, then strand B with a ground-coloured casing beneath its ink, then
  reclaiming A at alternate crossings via a `clipPath` of circles.

The over/under must be *real*. A bead chain -- two waves overlapping with no crossings --
was tried and rejected. A sikku kolam is a weave; that is the entire form.

**The casing is always the ground colour** (`--paper` by day, `--ink` at night), so the
weave inverts for free with no second asset. The night version is therefore literally
rice flour on dark earth, which is what a kolam physically is.

Footer border only. This has not changed.

## Imagery: continuous lineart

All photographs are re-exported as continuous lineart.

**Hard constraint: SVG with `stroke="currentColor"`.** Raster lineart is not viable --
with `--ink` serving as both keyline and dark ground, a black-line PNG is invisible at
night. SVG also buys crisp scaling, small files, and an optional draw-on animation via
`stroke-dashoffset`.

Existing images carry a halftone dot treatment. **Lineart plus halftone is redundant --
drop the halftone.**

### Open risks (owner's call, not blocking)

- Automated photo-to-lineart (edge detection) typically produces broken, noisy contours.
  **Convert two images first and look at them in place** before committing to the full set.
- The portrait on `/about` may be worth keeping as a real photograph. It is the one image
  doing emotional work on a page about a person, and a uniformly line-arted site risks
  reading as cold -- which fights the "welcoming" goal.

## What changes in the code

| File | Change |
|---|---|
| `app/globals.css` | Palette rewrite (5 tokens, no black) -- **done, shipped 2026-07-14**; extruded-panel system (`.xp` face + skewed pseudo side faces, `@property --d`); heading extrusion; zero-gap grid + border collapse; painter's-order z rules |
| `components/Kolam.tsx` | Replaced with the plait generator |
| `app/layout.tsx` | Add Inter for utility text |
| `public/logo/favicons/site.webmanifest` | `theme_color` / `background_color` -> `--paper` -- **done, shipped 2026-07-14** |
| Image assets | Re-exported as `currentColor` SVG lineart |
| `CLAUDE.md` | Document the system as load-bearing |

The comic-panel legacy CSS (`.comic`, `.panel`, `.affiliations-strip`, `.panel-link-hover`)
is superseded by the extruded panel and should be retired as pages migrate.

## Verification

- `npm run build` and inspect the **minified** CSS. Dev mode hides minifier bugs; a
  `color-mix(... 0%, ...)` collapse to a unitless `0` silently voided
  `background-image` in production once already. `min(calc(var(--d)*99), 3px)` and
  `@property` registrations must survive minification -- verify in the built output.
- Check both themes in a real browser, not just dev.
- Confirm no hex outside the five tokens (plus ink/paper alpha derivations) ships.
- Hover every grid: no cell may change stacking order, no seam may render heavier
  than 2px, and no neighbour's text may be covered at rest.
