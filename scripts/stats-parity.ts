/**
 * Does this page's rollup agree with the API it mirrors?
 *
 * `lib/stats/aggregate.ts` is a deliberate port of the dashboard's `views.py`, and
 * /api/stats.json is published as the machine-readable twin of what this page draws.
 * A number that differs between them is a bug in one of them, so this fetches both
 * and compares them field for field.
 *
 *   npm run stats:parity
 *
 * Windows are given explicitly rather than by range preset on purpose. The two sides
 * resolve a *relative* range ("last 7 days") against different clocks -- the server
 * against its own process timezone, the browser against the viewer's -- so those
 * windows disagree by a day for reasons that have nothing to do with the rollup.
 * Comparing fixed windows isolates the arithmetic, which is what this checks.
 */

import { aggregate } from '../lib/stats/aggregate'
import type { Bucket, Bundle, Slice } from '../lib/stats/types'

const BASE = process.env.STATS_BASE ?? 'https://stats.senthurayyappan.com'

/** Chosen to cover every basis the split can report, including their boundaries. */
const WINDOWS: [string, string][] = [
  ['2026-09-01', '2026-09-08'], // producer throughout
  ['2026-08-05', '2026-08-20'], // straddles the day the evidence begins
  ['2026-02-01', '2026-02-28'], // panel-focus throughout
  ['2025-08-09', '2026-09-08'], // month buckets across both eras
  ['2020-08-24', '2026-09-08'], // plus the collapsed multi-year gap
]

async function json(path: string) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`)
  return res.json()
}

async function main() {
  const bundle: Bundle = await json('/api/bundle.json')
  const measured = Object.keys(bundle.producers ?? {}).length
  console.log(`bundle schema ${bundle.schema}; ${measured} day(s) carry producer evidence`)
  if (bundle.schema >= 2 && measured === 0) {
    console.log('  warning: schema 2 with no producer days -- every bucket will fall back')
  }

  let failed = 0
  for (const [start, end] of WINDOWS) {
    const api = await json(`/api/stats.json?from=${start}&to=${end}`)
    const bucket: Bucket = api.trend.bucket
    const slice: Slice = { key: 'custom', label: 'Custom', start, end, bucket }
    const mine = aggregate(bundle, slice)

    const diffs: string[] = []
    const eq = (name: string, a: unknown, b: unknown) => {
      if (a !== b) diffs.push(`${name}: page=${a} api=${b}`)
    }
    eq('totalSeconds', mine.totalSeconds, api.totals.seconds)
    eq('activeDays', mine.activeDays, api.totals.active_days)
    eq('currentStreak', mine.currentStreak, api.totals.current_streak)
    eq('longestStreak', mine.longestStreak, api.totals.longest_streak)
    eq('aiShare', mine.aiShare, api.totals.ai_share_pct)
    eq('aiShareBasis', mine.aiShareBasis, api.totals.ai_share_basis)
    eq('aiShareSince', mine.aiShareSince, api.totals.ai_share_since)
    eq('trendColumns', mine.trend.length, api.trend.points.length)

    mine.trend.forEach((bar, i) => {
      const p = api.trend.points[i]
      if (!p) return
      eq(`${bar.key}.human`, bar.human, p.human_seconds)
      eq(`${bar.key}.ai`, bar.ai, p.ai_seconds)
      eq(`${bar.key}.aiShare`, bar.aiShare, p.ai_share_pct)
      eq(`${bar.key}.basis`, bar.basis, p.basis)
      eq(`${bar.key}.gapMonths`, bar.gapMonths, p.gap_months)
    })

    for (const [dim, panel] of Object.entries(mine.breakdowns)) {
      const theirs = api.breakdowns[dim]
      if (!theirs) continue
      eq(`${dim}.rows`, panel.rows.length, theirs.rows.length)
      panel.rows.forEach((row, i) => {
        const r = theirs.rows[i]
        if (!r) return
        eq(`${dim}[${i}].label`, row.label, r.name)
        eq(`${dim}[${i}].seconds`, row.seconds, r.seconds)
      })
    }

    const bases = Array.from(new Set(mine.trend.map((b) => b.basis || 'none'))).join('+')
    if (diffs.length === 0) {
      console.log(
        `  OK  ${start}..${end} ${bucket.padEnd(5)} ${String(mine.trend.length).padStart(3)} cols` +
          `  ai ${String(mine.aiShare).padStart(5)}% (${mine.aiShareBasis || 'none'})  bases: ${bases}`,
      )
    } else {
      failed++
      console.log(`  MISMATCH ${start}..${end}`)
      for (const d of diffs.slice(0, 10)) console.log(`      ${d}`)
      if (diffs.length > 10) console.log(`      ... and ${diffs.length - 10} more`)
    }
  }

  console.log(failed ? `\n${failed} window(s) disagree with the API` : '\nevery window agrees, field for field')
  process.exit(failed ? 1 : 0)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
