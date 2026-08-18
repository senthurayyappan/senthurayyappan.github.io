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

export type Series = 'human' | 'ai' | 'other'

export type DimKey = 'category' | 'language' | 'project' | 'editor' | 'os'

/** The dimensions that get their own breakdown panel. `category` feeds the trend. */
export type BreakdownKey = Exclude<DimKey, 'category'>

export interface NameEntry {
  name: string
  /** project only: true when `name` is a stable pseudonym, not the real name. */
  private?: boolean
  /** editor only: true when the "editor" is actually an AI agent reporting itself. */
  ai?: boolean
  /** category only: which of the three series this category rolls up into. */
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
  note: string
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
  other: number
  total: number
  aiShare: number
}

export interface HeatCell {
  day: string
  seconds: number
  /** 0..4, where 0 means no recorded time. */
  level: number
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
  trend: Bar[]
  /** Week columns x weekday rows; row 0 is Sunday, null is calendar padding. */
  heatmap: (HeatCell | null)[][]
  breakdowns: Record<BreakdownKey, Breakdown>
}
