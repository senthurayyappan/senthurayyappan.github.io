/**
 * ISO-date arithmetic that cannot drift by a day.
 *
 * Every date in the bundle is a bare `YYYY-MM-DD` in the timezone the heartbeats were
 * recorded in. Passing one to `new Date('2026-03-04')` parses it as UTC midnight, and
 * the local getters then read it back a day earlier for anyone west of Greenwich --
 * which would shift the whole heatmap by one column. So arithmetic here happens in
 * UTC and only ever comes back out as a string.
 *
 * `todayISO` is the one exception: it deliberately reads the *local* calendar, because
 * "today" on this page means the reader's today.
 */

const DAY_MS = 86_400_000

const pad = (n: number) => String(n).padStart(2, '0')

/** ISO day -> epoch ms at UTC midnight. */
export function toEpoch(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

export function fromEpoch(ms: number): string {
  const d = new Date(ms)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

export function addDays(iso: string, days: number): string {
  return fromEpoch(toEpoch(iso) + days * DAY_MS)
}

/** Whole days from `a` to `b`; negative when `b` is earlier. */
export function daysBetween(a: string, b: string): number {
  return Math.round((toEpoch(b) - toEpoch(a)) / DAY_MS)
}

/** 0 = Sunday, matching the heatmap's row order. */
export function weekday(iso: string): number {
  return new Date(toEpoch(iso)).getUTCDay()
}

/** The reader's local calendar date, never a UTC round trip. */
export function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function clamp(iso: string, min: string, max: string): string {
  if (iso < min) return min
  if (iso > max) return max
  return iso
}

/** True for a well-formed `YYYY-MM-DD` that is also a real calendar date. */
export function isValidISO(value: string | null | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  return fromEpoch(toEpoch(value)) === value
}
