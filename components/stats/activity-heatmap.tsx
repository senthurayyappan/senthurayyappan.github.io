'use client'

import * as React from 'react'

import { duration, longDayLabel, monthOf } from '@/lib/stats/format'
import type { HeatCell } from '@/lib/stats/types'

/**
 * GitHub-style calendar: one column per week, Sunday at the top.
 *
 * Hand-drawn SVG rather than a chart library, because no library models a calendar
 * grid well and the geometry is twenty lines. The level on each cell is a quartile
 * rank computed upstream, so the ramp adapts to the workload instead of being pinned
 * to an absolute hour count that would flatten out during a busy month.
 */

const CELL = 11
const GAP = 3
const STEP = CELL + GAP
const LEFT_GUTTER = 24 // weekday labels
const TOP_GUTTER = 14 // month labels

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

/** Only alternate rows are labelled; seven labels at 11px would collide. */
const WEEKDAY_ROWS: [number, string][] = [
  [1, 'Mon'],
  [3, 'Wed'],
  [5, 'Fri'],
]

interface Hover {
  cell: HeatCell
  x: number
  y: number
}

export function ActivityHeatmap({
  weeks,
  bestDay,
}: {
  weeks: (HeatCell | null)[][]
  bestDay: { day: string; seconds: number } | null
}) {
  const [hover, setHover] = React.useState<Hover | null>(null)
  const width = LEFT_GUTTER + weeks.length * STEP
  const height = TOP_GUTTER + 7 * STEP

  // A month tick sits above the first column that contains a day of that month.
  const monthTicks = React.useMemo(() => {
    const ticks: { x: number; label: string }[] = []
    let previous = ''
    weeks.forEach((column, index) => {
      const first = column.find((c): c is HeatCell => c !== null)
      if (!first) return
      const month = monthOf(first.day)
      if (month === previous) return
      previous = month
      ticks.push({
        x: LEFT_GUTTER + index * STEP,
        label: MONTHS[Number(month.slice(5, 7)) - 1],
      })
    })
    // Drop a tick that would collide with the next one on a short range.
    return ticks.filter((t, i) => i === 0 || t.x - ticks[i - 1].x >= 26)
  }, [weeks])

  return (
    <div className="stats-heat-wrap">
      <div className="stats-heat-scroll">
        <svg
          className="stats-heat"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Calendar heatmap of daily coding time. Darker cells are longer days."
          onMouseLeave={() => setHover(null)}
        >
          {monthTicks.map((tick) => (
            <text key={tick.label + tick.x} x={tick.x} y={9}>
              {tick.label}
            </text>
          ))}
          {WEEKDAY_ROWS.map(([row, label]) => (
            <text key={label} x={0} y={TOP_GUTTER + row * STEP + CELL - 1}>
              {label}
            </text>
          ))}
          {weeks.map((column, columnIndex) =>
            column.map((cell, rowIndex) =>
              cell ? (
                <rect
                  key={cell.day}
                  className="stats-heat-cell"
                  data-level={cell.level}
                  x={LEFT_GUTTER + columnIndex * STEP}
                  y={TOP_GUTTER + rowIndex * STEP}
                  width={CELL}
                  height={CELL}
                  tabIndex={0}
                  role="img"
                  aria-label={`${cell.day}: ${
                    cell.seconds ? duration(cell.seconds) : 'no activity'
                  }`}
                  onMouseEnter={(event) => {
                    const box = event.currentTarget.getBoundingClientRect()
                    setHover({ cell, x: box.left + box.width / 2, y: box.top })
                  }}
                  onFocus={(event) => {
                    const box = event.currentTarget.getBoundingClientRect()
                    setHover({ cell, x: box.left + box.width / 2, y: box.top })
                  }}
                  onBlur={() => setHover(null)}
                />
              ) : null,
            ),
          )}
        </svg>
      </div>

      {hover && (
        <div
          className="stats-tip stats-tip-floating"
          style={{ left: hover.x, top: hover.y }}
          role="status"
        >
          <div className="stats-tip-head">{longDayLabel(hover.cell.day)}</div>
          <div className="stats-tip-val">
            {hover.cell.seconds ? duration(hover.cell.seconds) : 'no recorded time'}
          </div>
        </div>
      )}

      <p className="stats-heat-legend">
        <span>less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <i key={level} data-level={level} aria-hidden="true" />
        ))}
        <span>more</span>
        {bestDay && (
          <span className="stats-heat-best">
            busiest {longDayLabel(bestDay.day)} · {duration(bestDay.seconds)}
          </span>
        )}
      </p>
    </div>
  )
}
