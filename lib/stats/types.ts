/**
 * The wire format served by stats.senthurayyappan.com/api/bundle.json.
 *
 * The API ships the whole day-level history in one response (~8 kB gzipped for a
 * year) rather than a payload per range. That is what lets this page switch ranges
 * and pick custom dates without a round trip, which matters because the site is a
 * static export and has no server of its own to ask.
 *
 * Names are interned into per-dimension tables and referenced by index from the day
 * rows. The classification a name carries -- whether a project is a pseudonym,
 * whether an editor is an AI agent, which series a category belongs to -- is decided
 * on the server and travels with the name. This file must never re-derive any of it:
 * the server is the only place that knows, and a private project's real name never
 * crosses the wire at all.
 */

export type Series = 'human' | 'ai'

/**
 * How a bucket's human/AI split was arrived at. Published with every bucket because
 * the two are not the same measurement, and drawing them identically would claim a
 * precision the older half of the history does not have.
 *
 * - `producer`   measured: which process actually wrote the heartbeat.
 * - `panel-focus` inferred from WakaTime's `category`, which reports AI whenever an
 *   AI panel held focus and therefore overstates it -- often wildly. The fallback for
 *   days before the server held its own heartbeats.
 * - `mixed`      a month straddling the day the evidence starts.
 * - `''`         nothing recorded, or a collapsed-gap marker.
 */
export type Basis = 'producer' | 'panel-focus' | 'mixed' | ''

export type DimKey = 'category' | 'language' | 'project' | 'editor' | 'os'

/** The dimensions that get their own breakdown panel. `category` feeds the trend. */
export type BreakdownKey = Exclude<DimKey, 'category'>

export interface NameEntry {
  name: string
  /** project only: true when `name` is a stable pseudonym, not the real name. */
  private?: boolean
  /** editor only: true when the "editor" is actually an AI agent reporting itself. */
  ai?: boolean
  /** category only: which of the two series this category rolls up into. */
  series?: Series
}

/** `[nameIndex, seconds]` into the matching dimension table. */
export type DimPair = [number, number]

/** `[day, totalSeconds, {dim: pairs}]`. Only days with recorded time appear. */
export type DayRow = [string, number, Partial<Record<DimKey, DimPair[]>>]

export interface Bundle {
  schema: number
  first_day: string | null
  last_day: string | null
  last_sync_at: string
  stale: boolean
  dims: Record<DimKey, NameEntry[]>
  days: DayRow[]
  /**
   * `{day: [agentSeconds, editorSeconds]}` -- the evidence for how a day splits.
   *
   * Apply the day's *ratio* to its `totalSeconds` from `days`; never sum these as
   * durations. They are a ratio estimator built on a single global timeline and run
   * well below wakapi's own per-dimension durations, which is why the server applies
   * the ratio to the summaries total instead of publishing these as time.
   *
   * A day absent here has no evidence and must fall back to `category`, marked
   * `panel-focus`. Optional so a bundle from a server predating schema 2 still
   * renders -- every day falls back, exactly as it did before.
   */
  producers?: Record<string, [number, number]>
  note: string
  /** Plain-language statement of the above, for the page to show the reader. */
  classification?: string
}

// --------------------------------------------------------------------- view model

export type Bucket = 'day' | 'month'

export interface Slice {
  key: string
  label: string
  /** Inclusive ISO bounds. */
  start: string
  end: string
  bucket: Bucket
}

/** One column of the trend chart. */
export interface Bar {
  key: string
  label: string
  human: number
  ai: number
  total: number
  aiShare: number
  /** How this bucket's split was measured. Anything but `producer` needs a caveat. */
  basis: Basis
  /**
   * 0 for a real bucket. Above zero this is not a bucket at all but a marker
   * standing in for that many consecutive empty months, so a history with years
   * missing from the middle neither fills the chart with whitespace nor closes the
   * hole and implies 2020 sat next to 2025. Never first or last: only interior runs
   * collapse, so the axis still begins and ends on real data.
   */
  gapMonths: number
}

export interface HeatCell {
  day: string
  seconds: number
  /** 0..4, where 0 means no recorded time. */
  level: number
}

/** One column of the calendar: a week, or a marker for a collapsed empty run. */
export interface HeatColumn {
  /** Seven entries for a real week (null is calendar padding); empty for a marker. */
  cells: (HeatCell | null)[]
  /** 0 for a real week; otherwise how many days the marker stands for. */
  gapDays: number
}

/** One bar in a breakdown panel. */
export interface Row {
  label: string
  seconds: number
  share: number
  isPrivate: boolean
  /** The synthetic "other (n)" row, which is not a real name. */
  isFold: boolean
}

export interface Breakdown {
  rows: Row[]
  /** How many real names exist in this slice. */
  distinct: number
  /** How many of them are hidden inside the fold row. */
  folded: number
  shown: number
  /** "12" or "top 8 of 31" -- a chart that truncates has to say so. */
  note: string
}

export interface Stats {
  slice: Slice
  totalSeconds: number
  activeDays: number
  spanDays: number
  dailyAverage: number
  bestDay: { day: string; seconds: number } | null
  currentStreak: number
  longestStreak: number
  aiShare: number
  /**
   * Which ruler produced `aiShare`. It covers every day in the range that recorded
   * time, so a range spanning both eras reads 'mixed' and `aiMeasuredSince` marks
   * where the trustworthy half begins -- null when nothing in range was measured.
   * Everything before that date is inferred from `category` and overstates AI.
   */
  aiShareBasis: Basis
  aiMeasuredSince: string | null
  trend: Bar[]
  /** Week columns x weekday rows; row 0 is Sunday, null is calendar padding. */
  heatmap: HeatColumn[]
  breakdowns: Record<BreakdownKey, Breakdown>
}
