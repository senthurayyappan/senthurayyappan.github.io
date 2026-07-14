# Visual system: extruded comic lineart

Status: implemented (panels, palette, type, kolam, Inter). Imagery-to-lineart and the
`/about` sheet migration are still open.
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
| `--paper` | `#f6f4ee` | light ground and its panel faces; the keyline at night |
| `--ink` | `#15130d` | dark ground and its panel faces; the keyline by day |
| `--yellow` | `#f9c90a` | accent in dark; panel right face at night |
| `--red` | `#ef2841` | accent in light; panel right face by day |
| `--blue` | `#007d7e` | panel bottom face, **both themes** |

`--ink` is the warm tonal mirror of `--paper` -- same warm bias (red high, blue low),
inverted lightness. Pure `#000000` was tried and rejected: the paper is warm, and a
neutral black fights it.

**Paper and ink are two poles, not a figure and a field.** Ink-on-paper is 16.7:1, and
that holds whichever one is the ground. So the pair swaps roles wholesale between
themes: whichever is the ground fills the panel faces, and the *other* one draws every
line on top of it.

Every neutral is `--ink` or `--paper` at reduced alpha. Never introduce a sixth hue.
`public/palette.png` is a stale orphaned swatch file -- do not source colours from it.

## Dark mode: the whole sheet flips, linework included

Panels are **cut from the ground**. Whatever colour the ground is, the faces are that
colour too -- paper by day, ink at night -- and the coloured side faces stay saturated
in both. The face declares no tokens of its own; everything inside it (`--ink-soft`,
`--rule`, `--paper-2`, `--accent`) already flips, so face interiors come out right for
free.

**The keyline flips with it.** Lines are `--text`: ink on the paper ground, paper on the
ink ground. This is forced, not chosen -- an ink keyline on an ink face is ~1.2:1 and
the outline that defines the entire language would dissolve.

### The rejected version, and why it was wrong

This section originally read *"dark mode is night, not inversion"* and argued the
opposite: panels stay lit paper with ink keylines in both themes, on the comics
principle that **the ink is always black, even in a night scene** -- Batman has the same
outline at midnight as at noon. It shipped that way.

The owner rejected it immediately on seeing it: **a dark page full of glowing white
panels defeats the purpose of dark mode.** The comics analogy was seductive and wrong,
because it reasons about a *drawing of a night scene* -- a lit page you hold in daylight
-- when a dark-mode UI is the opposite thing: an emissive screen in a dark room, where
every white rectangle is a lamp pointed at the reader. On a page whose panels are most
of the content, "the panels don't flip" and "dark mode" cannot both be true.

Do not reintroduce fixed-paper faces.

Long-form prose still lives **outside** panels, directly on the ground.

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

One deliberate exception: the About tile on the home page rests at **18px**, not 12.
It is a narrow tile carrying a busy portrait, sitting between two flat neighbours,
and at 12px the extrusion read as shallow -- the owner asked for it to sit at the
depth a tile reaches when hovered. This is a per-tile override, not a licence to vary
heights freely; the wide Featured panel on clean paper still reads fine at 12.

### Hover

Any cell rises to 18px and **its title goes accent**. Flat cells become solids on hover,
so every cell is interactive; resting height only says which ones matter. The lift is
one animated `@property`-registered custom length driving pure 2D changes (face
translate, side-face growth) -- text stays on the pixel grid and never blurs. Side-face
borders use `min(calc(var(--d)*99), Npx)` so they vanish exactly when the cell is flat.

**The face itself does not tint.** A low-alpha accent wash on the face shipped first and
was rejected: the extrusion is already a large, unmistakable state change, and washing
the face on top of it is a second answer to a question the lift has answered. Every
sheet must therefore give its title an accent hover, or its cells will have no feedback
beyond the lift -- the Recommendations cells originally had none, because the tint was
carrying them.

Keyboard focus keeps `outline: 2px solid var(--accent)` on the face. A lift is not a
focus indicator, and the UA ring would hug the static footprint, 18px from the face.

### The padding rule

A raised face overlaps its up-left neighbours by its height. Cell padding of at
least 12px (the site uses 16-18px) keeps neighbour text clear of the resting
12px overlap; a hovered face may
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
- **Open weave** (option A of the two drawn): crossings every `P=20px`
  (P is a half-period), amplitude `A=15`, stroke 2. The load-bearing number is
  `A/P = 0.75`; the tighter option B (denser, smaller eyes) was rejected as
  crowded at footer scale. NOTE: the plait first shipped with `P` mistakenly
  standing in for the full period, which flattened `A/P` to ~0.42 and produced
  a flat bead-chain — the very failure this section warns against. Fixed by
  halving P and raising A.
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
| `app/globals.css` | **Shipped.** Hue correction (logo colours only); token-semantics rewrite (`--ink: #15130d`; `.dark` swaps which pole is the ground, and faces + keylines follow it); extruded-panel system (`.xcell` face + skewed pseudo side faces, `@property --d`); heading extrusion; zero-gap grid + border collapse |
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
