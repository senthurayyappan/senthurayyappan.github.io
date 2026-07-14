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
| `--yellow` | `#f9c90a` | accent in dark |
| `--red` | `#ef2841` | accent in light; panel bottom face |
| `--blue` | `#007d7e` | panel right face |

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

## The panel: true oblique extrusion

Not a CSS drop shadow. A real solid:

- **Face**: `--paper`, `--ink` keyline at 2.4px.
- **Right side face**: `--blue`. Cool, recessive -- correct for a vertical plane.
- **Bottom side face**: `--red`. Warm, heavy -- correct for a ground-facing plane.
- **Mitered corner edge** where the two side faces meet. This is what sells it as a
  solid rather than two rectangles.
- Keylines on the side faces too.

`--yellow` is deliberately **not** spent on panel furniture. It is held in reserve as
the dark-mode accent and for hover, so the accent always has somewhere louder to
escalate to.

### Depth tiers -- the extrusion must be rationed

| Tier | Depth |
|---|---|
| Hero, featured panel | 12px |
| List rows, secondary cards | 4-6px |
| Blog reading column | 0 -- body text sits flat on the page |

If everything is extruded, depth stops meaning anything and the page reads as noise.

### Hover

Depth collapses 12px -> 3px and the panel translates down-right by the difference: the
panel **presses into the page**. One transform. A real affordance, not an opacity fade.
A robotics site should behave like it has physics.

### Section colour override

Blue-right / red-bottom is the site default so all panels read as one material. A section
may swap the pairing deliberately (e.g. Projects red-right / blue-bottom) so colour
signals *where you are* rather than decorating at random. Yellow stays out of side faces
entirely -- see the reserve rule above.

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
| `app/globals.css` | Palette rewrite (5 tokens, no black); panel/extrusion system; heading extrusion; depth tiers; hover press |
| `components/Kolam.tsx` | Replaced with the plait generator |
| `app/layout.tsx` | Add Inter for utility text |
| `public/logo/favicons/site.webmanifest` | `theme_color` / `background_color` -> `--paper` |
| Image assets | Re-exported as `currentColor` SVG lineart |
| `CLAUDE.md` | Document the system as load-bearing |

The comic-panel legacy CSS (`.comic`, `.panel`, `.affiliations-strip`, `.panel-link-hover`)
is superseded by the extruded panel and should be retired as pages migrate.

## Verification

- `npm run build` and inspect the **minified** CSS. Dev mode hides minifier bugs; a
  `color-mix(... 0%, ...)` collapse to a unitless `0` silently voided
  `background-image` in production once already.
- Check both themes in a real browser, not just dev.
- Confirm no hex outside the five tokens (plus ink/paper alpha derivations) ships.
