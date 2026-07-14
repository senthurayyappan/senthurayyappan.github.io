// A sikku plait: two counter-phase strands weaving through a row of pulli
// dots with REAL alternating over/under crossings. The casing that produces
// the under-pass is always the ground colour (--background), so the weave
// inverts for free at night (rice flour on dark earth). Replaces the old
// D4-medallion generator wholesale -- see docs/design/2026-07-14-visual-system.md.
// Footer border ONLY; kolams were tried and rejected everywhere else.
//
// This is the OPEN weave (brainstorm option A). The whole thing lives or dies
// on A/P = 0.75: at that ratio the strands rise into rope; flatten it and the
// plait collapses into a chain of beads, which is precisely what a sikku kolam
// is not. Keep the constants in that proportion.

import { useId } from 'react'

// The OPEN weave (the brainstorm's option A, full period 40 -> crossings every
// 20). A tight variant was drawn too and NOT chosen: its eyes shrink and the
// dots crowd the strands at footer scale. What matters is the ratio A/P = 0.75
// -- flatten that and the plait stops reading as a rope and starts reading as
// a chain of beads, which is the exact thing a sikku kolam is not.
const P = 20 // px between crossings (HALF the sine period, not the period)
const A = 15 // strand amplitude
const STROKE = 2
const CASING = STROKE * 3.5
const DOT_R = 2.3
// Reclaim radius at alternate crossings. Must exceed CASING/2 (3.5) to undo
// the casing damage, and stay under P/2 (10) so it can't reach the peaks or
// the neighbouring crossings.
const CLIP_R = 7

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

export function KolamPlait({
  segments = 19,
  fill = false,
}: {
  segments?: number
  // fill: render as a full-width divider. The SVG fills its container at the
  // weave's true 1:1 scale and clips the overflow on the right (slice), left-
  // aligned -- so the height, and therefore the A/P proportion, never changes
  // with the container width. Pass enough `segments` to overflow the widest
  // container it will sit in (the footer uses 60 => 1200px, past the ~904px
  // content column). Without fill the plait is centred at its natural size.
  fill?: boolean
}) {
  // useId keeps the clipPath id unique per instance (it works in server
  // components), so two plaits on one page can't collide.
  const clipId = useId()
  const n = Math.max(2, segments)
  // half-height: the peak, plus the casing (wider than the ink), plus 1px.
  // Sizing off STROKE instead would clip the casing at the peaks.
  const y = A + CASING / 2 + 1
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
      preserveAspectRatio={fill ? 'xMinYMid slice' : 'xMidYMid meet'}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
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
      <g clipPath={`url(#${clipId})`}>
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
