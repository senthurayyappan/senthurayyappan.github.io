// A sikku plait: two counter-phase strands weaving through a row of pulli
// dots with REAL alternating over/under crossings. The casing that produces
// the under-pass is always the ground colour (--background), so the weave
// inverts for free at night (rice flour on dark earth). Replaces the old
// D4-medallion generator wholesale -- see docs/design/2026-07-14-visual-system.md.
// Footer border ONLY; kolams were tried and rejected everywhere else.

import { useId } from 'react'

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
  // useId keeps the clipPath id unique per instance (it works in server
  // components), so two plaits on one page can't collide.
  const clipId = useId()
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
