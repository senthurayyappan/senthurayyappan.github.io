/**
 * Slicing and rollup, done in the browser.
 *
 * This is a deliberate port of the API's `views.py`, and the two have to keep
 * agreeing: /api/stats.json is published as the machine-readable twin of this page,
 * so a number that differs between them is a bug in one of them. Where the shape of
 * a calculation looks fussy here -- walking the calendar instead of the rows for a
 * streak, emitting empty days into the trend -- it is fussy in the same way there,
 * and for the reason noted at the call site.
 *
 * What this file must never do is *classify*. Whether a project is private, an editor
 * is an agent, or a category counts as AI time is decided by the server and arrives
 * attached to the name. See types.ts.
 */

import { addDays, clamp, daysBetween, todayISO, weekday } from './dates'
import { dayLabel, monthLabel, monthOf, percent } from './format'
import type {
  Bar,
  Breakdown,
  BreakdownKey,
  Bucket,
  Bundle,
  DimKey,
  HeatCell,
  NameEntry,
  Row,
  Series,
  Slice,
  Stats,
} from './types'

export interface RangePreset {
  key: string
  label: string
  /** Window length in days; null means "bounded by the data". */
  days: number | null
  bucket: Bucket
}

/**
 * The one filter row, above everything it scopes. The bucket travels with the preset
 * because granularity has to follow the range: a monthly chart over 30 days is one or
 * two columns, which is not a trend.
 */
export const RANGES: RangePreset[] = [
  { key: 'today', label: 'Today', days: 1, bucket: 'day' },
  { key: '7d', label: '7 days', days: 7, bucket: 'day' },
  { key: '14d', label: '2 weeks', days: 14, bucket: 'day' },
  { key: '30d', label: '30 days', days: 30, bucket: 'day' },
  { key: '90d', label: '90 days', days: 90, bucket: 'day' },
  { key: '12mo', label: '12 months', days: 365, bucket: 'month' },
  { key: 'all', label: 'All time', days: null, bucket: 'month' },
]

export const DEFAULT_RANGE = 'all'
export const CUSTOM_RANGE = 'custom'

/** Above this many days a day-bucketed trend stops being readable. */
const DAY_BUCKET_LIMIT = 120

/** Rows a breakdown shows before the tail folds. Eight is the categorical ceiling. */
const BREAKDOWN_LIMIT = 8

const BREAKDOWN_DIMS: BreakdownKey[] = ['language', 'project', 'editor', 'os']

// --------------------------------------------------------------------------- slice

export function resolveSlice(
  bundle: Bundle,
  key: string,
  customStart?: string | null,
  customEnd?: string | null,
): Slice {
  const today = todayISO()
  const lastDay = bundle.last_day ?? today
  const firstDay = bundle.first_day

  if (key === CUSTOM_RANGE && customStart && customEnd) {
    const [start, end] =
      customStart <= customEnd ? [customStart, customEnd] : [customEnd, customStart]
    const span = daysBetween(start, end) + 1
    return {
      key: CUSTOM_RANGE,
      label: `${start} → ${end}`,
      start,
      end,
      bucket: span <= DAY_BUCKET_LIMIT ? 'day' : 'month',
    }
  }

  const preset = RANGES.find((r) => r.key === key) ?? RANGES[RANGES.length - 1]

  if (preset.days === null) {
    // "All time" is bounded by the data, so the heatmap has no dead tail.
    return {
      key: preset.key,
      label: preset.label,
      start: firstDay ?? today,
      end: lastDay,
      bucket: preset.bucket,
    }
  }

  // Bounded presets anchor to the calendar, not to the last day that happens to have
  // data: "7 days" after a week off has to read as a week off. The max() keeps a
  // timezone-skewed future row inside the window rather than hiding it.
  const end = lastDay > today ? lastDay : today
  let start = addDays(end, -(preset.days - 1))
  if (firstDay && start < firstDay) start = firstDay
  return { key: preset.key, label: preset.label, start, end, bucket: preset.bucket }
}

/** The bounds a date picker may offer: never before the data, never after today. */
export function pickableBounds(bundle: Bundle): { min: string; max: string } {
  const today = todayISO()
  const last = bundle.last_day ?? today
  return { min: bundle.first_day ?? today, max: last > today ? last : today }
}

// ----------------------------------------------------------------------- internals

function seriesOf(bundle: Bundle, categoryIndex: number): Series {
  return bundle.dims.category[categoryIndex]?.series ?? 'other'
}

/** Quartile thresholds over the non-zero days, so the ramp adapts to the workload. */
function heatThresholds(values: number[]): [number, number, number] {
  const nonzero = values.filter((v) => v > 0).sort((a, b) => a - b)
  if (!nonzero.length) return [1, 1, 1]
  const q = (f: number) => nonzero[Math.min(nonzero.length - 1, Math.floor(f * nonzero.length))]
  return [q(0.25), q(0.5), q(0.75)]
}

function buildHeatmap(
  byDay: Map<string, number>,
  start: string,
  end: string,
): (HeatCell | null)[][] {
  const thresholds = heatThresholds(Array.from(byDay.values()))
  const level = (seconds: number) =>
    seconds <= 0 ? 0 : 1 + thresholds.filter((t) => seconds > t).length

  // Start the grid on the Sunday on or before `start` so every column is a full week.
  let cursor = addDays(start, -weekday(start))
  const weeks: (HeatCell | null)[][] = []
  while (cursor <= end) {
    const column: (HeatCell | null)[] = []
    for (let i = 0; i < 7; i += 1) {
      if (cursor >= start && cursor <= end) {
        const seconds = byDay.get(cursor) ?? 0
        column.push({ day: cursor, seconds, level: level(seconds) })
      } else {
        column.push(null)
      }
      cursor = addDays(cursor, 1)
    }
    weeks.push(column)
  }
  return weeks
}

/** Current and longest run of consecutive days with recorded time. */
function streaks(active: Set<string>, end: string): { current: number; longest: number } {
  if (!active.size) return { current: 0, longest: 0 }

  // Walk the calendar, not the rows. Counting consecutive rows would bridge a day
  // missing from the data entirely and report a streak that never happened.
  const sorted = Array.from(active).sort()
  let longest = 0
  let run = 0
  for (let cursor = sorted[0]; cursor <= sorted[sorted.length - 1]; cursor = addDays(cursor, 1)) {
    run = active.has(cursor) ? run + 1 : 0
    if (run > longest) longest = run
  }

  // "Current" tolerates today being empty: a streak measured before you have opened
  // an editor should not read as broken at 00:01.
  let cursor = active.has(end) ? end : addDays(end, -1)
  let current = 0
  while (active.has(cursor)) {
    current += 1
    cursor = addDays(cursor, -1)
  }
  return { current, longest }
}

function foldBreakdown(
  totals: Map<number, number>,
  names: NameEntry[],
  grandTotal: number,
  /**
   * Names that fold regardless of how large they are. Used for editors, where the
   * question the panel answers is "which editor", and the eight self-reporting AI
   * agents would otherwise crowd out the two real ones. This is a category decision,
   * not a ranking one, so it is kept separate from the top-N cut below.
   */
  alwaysFold?: (entry: NameEntry) => boolean,
): Breakdown {
  const sorted = Array.from(totals.entries())
    .filter(([, seconds]) => seconds > 0)
    .sort((a, b) => b[1] - a[1] || (names[a[0]]?.name ?? '').localeCompare(names[b[0]]?.name ?? ''))

  const ranked = alwaysFold ? sorted.filter(([i]) => !alwaysFold(names[i])) : sorted
  const categoryFolded = alwaysFold ? sorted.filter(([i]) => alwaysFold(names[i])) : []

  const head = ranked.slice(0, BREAKDOWN_LIMIT)
  const rankFolded = ranked.slice(BREAKDOWN_LIMIT)
  const tail = [...rankFolded, ...categoryFolded]
  const tailSeconds = tail.reduce((sum, [, seconds]) => sum + seconds, 0)

  const rows: Row[] = head.map(([index, seconds]) => ({
    label: names[index]?.name ?? '—',
    seconds,
    share: percent(seconds, grandTotal),
    isPrivate: Boolean(names[index]?.private),
    isFold: false,
  }))

  if (tailSeconds > 0) {
    rows.push({
      label: `other (${tail.length})`,
      seconds: tailSeconds,
      share: percent(tailSeconds, grandTotal),
      isPrivate: false,
      isFold: true,
    })
  }

  const distinct = sorted.length
  const shown = rows.filter((r) => !r.isFold).length
  return {
    rows,
    distinct,
    folded: tailSeconds > 0 ? tail.length : 0,
    shown,
    // Only a *ranking* cut earns "top N of M". When the tail is a category rather
    // than a long tail, the fold row already says how many it holds, and claiming a
    // top-N would misdescribe what was left out.
    note: rankFolded.length ? `top ${shown} of ${distinct}` : distinct ? String(distinct) : '',
  }
}

function emptyBreakdown(): Breakdown {
  return { rows: [], distinct: 0, folded: 0, shown: 0, note: '' }
}

// --------------------------------------------------------------------------- build

export function aggregate(bundle: Bundle, slice: Slice): Stats {
  const rows = bundle.days.filter(([day]) => day >= slice.start && day <= slice.end)

  const byDay = new Map<string, number>()
  const active = new Set<string>()
  let totalSeconds = 0
  let bestDay: { day: string; seconds: number } | null = null

  for (const [day, total] of rows) {
    byDay.set(day, total)
    totalSeconds += total
    if (total > 0) {
      active.add(day)
      if (!bestDay || total > bestDay.seconds) bestDay = { day, seconds: total }
    }
  }

  // --- trend -----------------------------------------------------------------
  //
  // Day buckets emit an entry for every day in the range including empty ones, so a
  // quiet week reads as a gap in the axis rather than silently closing up.
  const split = new Map<string, { human: number; ai: number; other: number }>()
  const emptyBar = () => ({ human: 0, ai: 0, other: 0 })

  if (slice.bucket === 'day') {
    for (let day = slice.start; day <= slice.end; day = addDays(day, 1)) {
      split.set(day, emptyBar())
    }
  }
  for (const [day, , dims] of rows) {
    const bucketKey = slice.bucket === 'month' ? monthOf(day) : day
    let entry = split.get(bucketKey)
    if (!entry) {
      entry = emptyBar()
      split.set(bucketKey, entry)
    }
    for (const [index, seconds] of dims.category ?? []) {
      entry[seriesOf(bundle, index)] += seconds
    }
  }

  const trend: Bar[] = Array.from(split.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, v]) => {
      const total = v.human + v.ai + v.other
      const coded = v.human + v.ai
      return {
        key,
        label: slice.bucket === 'month' ? monthLabel(key) : dayLabel(key),
        ...v,
        total,
        aiShare: coded ? percent(v.ai, coded) : 0,
      }
    })

  // --- breakdowns ------------------------------------------------------------
  const totalsByDim = new Map<DimKey, Map<number, number>>()
  for (const dim of BREAKDOWN_DIMS) totalsByDim.set(dim, new Map())
  for (const [, , dims] of rows) {
    for (const dim of BREAKDOWN_DIMS) {
      const target = totalsByDim.get(dim)!
      for (const [index, seconds] of dims[dim] ?? []) {
        target.set(index, (target.get(index) ?? 0) + seconds)
      }
    }
  }

  // Editors: the agents tag themselves in the same field real editors use, so the
  // server marks them and they fold here. Whether a name is an agent is the server's
  // call -- this only decides what to do about it.
  const alwaysFold: Partial<Record<BreakdownKey, (e: NameEntry) => boolean>> = {
    editor: (entry) => entry.ai === true,
  }

  const breakdowns = Object.fromEntries(
    BREAKDOWN_DIMS.map((dim) => [
      dim,
      bundle.dims[dim]
        ? foldBreakdown(totalsByDim.get(dim)!, bundle.dims[dim], totalSeconds, alwaysFold[dim])
        : emptyBreakdown(),
    ]),
  ) as Record<BreakdownKey, Breakdown>

  const { current, longest } = streaks(active, slice.end)
  const aiTotal = trend.reduce((sum, b) => sum + b.ai, 0)
  const codedTotal = trend.reduce((sum, b) => sum + b.human + b.ai, 0)

  return {
    slice,
    totalSeconds,
    activeDays: active.size,
    spanDays: daysBetween(slice.start, slice.end) + 1,
    dailyAverage: active.size ? Math.floor(totalSeconds / active.size) : 0,
    bestDay,
    currentStreak: current,
    longestStreak: longest,
    aiShare: percent(aiTotal, codedTotal),
    trend,
    heatmap: buildHeatmap(byDay, slice.start, slice.end),
    breakdowns,
  }
}

export { clamp }
