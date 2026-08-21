'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'

import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart'
import { duration } from '@/lib/stats/format'
import type { Bar as TrendBar, Bucket } from '@/lib/stats/types'

/**
 * The headline chart: coding time per day or per month, split into human time and
 * AI-agent time. Two series only -- the non-coding categories (docs, tests,
 * debugging, unknown) are the human working too, so they count as human rather
 * than as a third series belonging to nobody.
 *
 * Recharts owns the plumbing -- scales, responsive sizing, axis ticks, tooltip
 * placement. It does not own the mark, because the house spec for a stacked bar is
 * specific in ways a library default is not: a 24px cap on width, a 4px radius on the
 * data end only with a square baseline, and a 2px gap of *surface* between segments
 * rather than a stroke. `Segment` below draws exactly that and hands it back to
 * Recharts as the bar's shape.
 */

/** Bottom to top, matching the order the <Bar> elements are declared in. */
const STACK_ORDER = ['human', 'ai'] as const
type SeriesKey = (typeof STACK_ORDER)[number]

const BAR_MAX_WIDTH = 24
const CAP_RADIUS = 4
const SEGMENT_GAP = 2

/** Beyond this many columns the axis thins its labels rather than overlapping them. */
const MAX_AXIS_LABELS = 14

// "human" and "ai" rather than "coding" and "ai coding": the pair is the whole point
// of this page, and the shorter words let the contrast land without the reader parsing
// two labels that share a word.
const CONFIG = {
  human: { label: 'human', color: 'var(--stats-human)' },
  ai: { label: 'ai', color: 'var(--stats-ai)' },
} satisfies ChartConfig

interface Datum {
  key: string
  label: string
  human: number
  ai: number
  humanSeconds: number
  aiSeconds: number
  totalSeconds: number
  aiShare: number
  /** >0 when this column is a marker for collapsed months, not a bucket. */
  gapMonths: number
}

/** Square baseline, rounded data end. Radius collapses on a segment too short for it. */
function barPath(x: number, y: number, w: number, h: number, radius: number): string {
  const r = Math.max(0, Math.min(radius, w / 2, h))
  if (r === 0) return `M${x},${y}h${w}v${h}h${-w}Z`
  return (
    `M${x},${y + r}` +
    `Q${x},${y} ${x + r},${y}` +
    `L${x + w - r},${y}` +
    `Q${x + w},${y} ${x + w},${y + r}` +
    `L${x + w},${y + h}` +
    `L${x},${y + h}Z`
  )
}

interface SegmentProps {
  series?: SeriesKey
  lastIndex?: number
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  payload?: Datum
}

function Segment(props: SegmentProps) {
  const { series, lastIndex, x = 0, y = 0, width = 0, height = 0, index, payload } = props
  if (!series || !payload || height <= 0 || width <= 0) return null

  // Which segments this column actually has decides both the cap and the gaps. A
  // column of pure AI time gets one rounded bar, not a rounded bar sitting on an
  // invisible zero-height one.
  const present = STACK_ORDER.filter((k) => payload[k] > 0)
  const position = present.indexOf(series)
  if (position === -1) return null
  const isTop = position === present.length - 1

  // The gap comes off this segment's top edge, so it reads as surface showing
  // through. A stroke would inset the fill on all four sides and narrow the mark.
  const top = isTop ? y : y + SEGMENT_GAP
  const h = isTop ? height : height - SEGMENT_GAP
  if (h <= 0.25) return null

  const path = isTop
    ? barPath(x, top, width, h, CAP_RADIUS)
    : `M${x},${top}h${width}v${h}h${-width}Z`

  // One direct label, on the endpoint. The arc of this chart is the AI share
  // climbing, so that is the number that earns a label; the rest live in the axis
  // and the tooltip.
  const showLabel = isTop && index === lastIndex && payload.totalSeconds > 0

  return (
    <g className={`stats-seg stats-seg-${series}`}>
      <path d={path} />
      {showLabel && (
        <text className="stats-direct-label" x={x + width / 2} y={top - 7} textAnchor="middle">
          {Math.round(payload.aiShare)}% ai
        </text>
      )}
    </g>
  )
}

function TrendTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: Datum }[]
}) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  const parts: [SeriesKey, number][] = [
    ['human', row.humanSeconds],
    ['ai', row.aiSeconds],
  ]

  return (
    <div className="stats-tip" role="status">
      <div className="stats-tip-head">
        {row.gapMonths > 0 ? `${row.label} not shown` : row.label}
      </div>
      {row.gapMonths > 0 ? (
        <div className="stats-tip-name">no recorded time in this stretch</div>
      ) : row.totalSeconds === 0 ? (
        <div className="stats-tip-name">no recorded time</div>
      ) : (
        <>
          {parts
            .filter(([, seconds]) => seconds > 0)
            .map(([key, seconds]) => (
              <div className="stats-tip-row" key={key}>
                <i className={`stats-key stats-key-${key}`} aria-hidden="true" />
                <span className="stats-tip-val">{duration(seconds)}</span>
                <span className="stats-tip-name">{CONFIG[key].label}</span>
              </div>
            ))}
          <div className="stats-tip-total">
            {duration(row.totalSeconds)} total · {row.aiShare.toFixed(0)}% ai
          </div>
        </>
      )}
    </div>
  )
}

export function TrendChart({ bars, bucket }: { bars: TrendBar[]; bucket: Bucket }) {
  const data: Datum[] = React.useMemo(
    () =>
      bars.map((b) => ({
        key: b.key,
        label: b.label,
        // Hours drive the scale so the axis lands on readable ticks; the raw seconds
        // ride along for the tooltip, which should not show a rounded value.
        human: b.human / 3600,
        ai: b.ai / 3600,
        humanSeconds: b.human,
        aiSeconds: b.ai,
        totalSeconds: b.total,
        aiShare: b.aiShare,
        gapMonths: b.gapMonths,
      })),
    [bars],
  )

  // Columns that stand in for collapsed history, marked on the axis so the jump is
  // visible. Without this the chart would put 2020 next to 2025 and read as though
  // they were consecutive months.
  const breaks = React.useMemo(() => data.filter((d) => d.gapMonths > 0), [data])

  const lastIndex = data.length - 1
  const interval = Math.max(0, Math.ceil(data.length / MAX_AXIS_LABELS) - 1)

  if (!data.length) {
    return <p className="stats-empty">No recorded time in this range.</p>
  }

  return (
    <ChartContainer config={CONFIG} className="stats-chart">
      {/* The right margin is for the direct label, not the bars. It sits centred over
          the final column, so on a daily range -- where bands are narrow and the last
          bar is close to the edge -- it gets clipped without room reserved for it. */}
      <BarChart data={data} margin={{ top: 22, right: 26, bottom: 0, left: 0 }} barCategoryGap="16%">
        <CartesianGrid vertical={false} stroke="var(--stats-grid)" strokeDasharray="0" />
        {/* allowDecimals={false} rather than rounding in the formatter. On a short
            range Recharts picks fractional ticks (0, 0.75, 1.5, 2.25, 3) and rounding
            them for display prints "0 1 1 2 3" -- two identical labels at different
            heights, which makes the axis unreadable. Constraining the ticks
            themselves keeps the labels distinct and the gridlines meaningful. */}
        <YAxis tickLine={false} axisLine={false} width={34} tickMargin={4} allowDecimals={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          interval={interval}
          tickMargin={7}
          stroke="var(--stats-axis)"
          minTickGap={4}
        />
        <ChartTooltip
          cursor={{ fill: 'var(--stats-hover)' }}
          content={<TrendTooltip />}
          animationDuration={110}
        />
        {breaks.map((d) => (
          <ReferenceLine
            key={d.key}
            x={d.label}
            stroke="var(--stats-axis)"
            strokeDasharray="3 4"
            strokeWidth={1.5}
            opacity={0.55}
            label={{
              value: d.label,
              position: 'insideTop',
              className: 'stats-trend-break-label',
              offset: -14,
            }}
          />
        ))}
        {STACK_ORDER.map((series) => (
          <Bar
            key={series}
            dataKey={series}
            stackId="time"
            maxBarSize={BAR_MAX_WIDTH}
            isAnimationActive={false}
            shape={<Segment series={series} lastIndex={lastIndex} />}
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

/** Identity never rests on colour alone, so the legend is always present. */
export function TrendLegend() {
  return (
    <p className="stats-legend" role="list">
      {STACK_ORDER.map((key) => (
        <span role="listitem" key={key}>
          <i className={`stats-key stats-key-${key}`} aria-hidden="true" />
          {CONFIG[key].label}
        </span>
      ))}
    </p>
  )
}
