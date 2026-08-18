/**
 * Number and label formatting. Mirrors the API's own formatters so a value reads the
 * same here as it does in /api/stats.json.
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

/** `3465` -> `57m`; `1092369` -> `303h 26m`. */
export function duration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  if (hours && minutes) return `${hours.toLocaleString()}h ${minutes}m`
  if (hours) return `${hours.toLocaleString()}h`
  return `${minutes}m`
}

export function hours(seconds: number): string {
  return (seconds / 3600).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

export function percent(part: number, whole: number): number {
  return whole ? Math.round((1000 * part) / whole) / 10 : 0
}

/** `2026-03` -> `Mar 26`. */
export function monthLabel(month: string): string {
  const [y, m] = month.split('-')
  return `${MONTHS[Number(m) - 1]} ${y.slice(2)}`
}

/** `2026-03-04` -> `4 Mar`. */
export function dayLabel(day: string): string {
  const [, m, d] = day.split('-')
  return `${Number(d)} ${MONTHS[Number(m) - 1]}`
}

/** `2026-03-04` -> `4 Mar 2026`, for tooltips and the busiest-day note. */
export function longDayLabel(day: string): string {
  const [y, m, d] = day.split('-')
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`
}

export function monthOf(day: string): string {
  return day.slice(0, 7)
}

/** `2026-08-17T15:16:25+00:00` -> `2026-08-17 15:16 UTC`. */
export function syncStamp(iso: string): string {
  if (!iso || iso.length < 16) return iso || ''
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return n === 1 ? one : many
}
