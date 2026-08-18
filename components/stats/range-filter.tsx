'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'

import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SAButton } from '@/components/SAButton'
import { CUSTOM_RANGE, RANGES } from '@/lib/stats/aggregate'
import { longDayLabel, plural } from '@/lib/stats/format'
import { toEpoch } from '@/lib/stats/dates'
import type { Slice } from '@/lib/stats/types'

/**
 * The one filter, above everything it scopes. Every tile, chart and panel below reads
 * the same slice, so the numbers on screen always agree with each other.
 *
 * Two rows, and the order is the point. The window itself is stated first, as a
 * sentence you can read and then edit in place; the presets underneath are shortcuts
 * that write into it. So "7 days" is a starting position rather than a mode you are
 * stuck in -- press it, then drag the From date back three more days and keep going.
 * There is no separate "custom" button to find, because every state is the same state.
 */

/** Calendar speaks Date; everything else on this page speaks ISO day strings. */
function toDate(iso: string | null): Date | undefined {
  return iso ? new Date(toEpoch(iso)) : undefined
}

function toISO(date: Date | undefined): string | null {
  if (!date) return null
  const pad = (n: number) => String(n).padStart(2, '0')
  // The Calendar hands back a local-midnight Date, so read the local fields.
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/**
 * Each day carries the site's hover mark, so pointing at one draws the same rough
 * circle the nav links and social icons draw rather than washing the cell grey.
 *
 * No enhancer rescan on open, deliberately. `enhance()` listens on `document`, and
 * pointer events from a portal bubble there like any other, so the animated circle
 * works on a cell the enhancer has never seen. Rescanning would add all 42 cells to
 * its permanent mark set on every open, for nothing. Until the pointer arrives the
 * CSS ellipse stands in, held at opacity 0 by stats.css.
 */
function DayCircle(props: React.ComponentProps<typeof CalendarDayButton>) {
  return (
    <CalendarDayButton
      {...props}
      className={`sa-mark stats-day${props.className ? ` ${props.className}` : ''}`}
      data-sa-mark="circle"
      data-sa-trigger="interaction"
    />
  )
}

/**
 * One editable date in the readout. Styled as a value with an underline, not as a
 * button: it should read as part of the sentence, while still saying it can be
 * changed.
 */
function DateField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: string
  min: string
  max: string
  onChange: (iso: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const selected = toDate(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="stats-date-field"
          aria-label={`${label}: ${longDayLabel(value)} — change`}
        >
          {longDayLabel(value)}
        </button>
      </PopoverTrigger>
      <PopoverContent className="stats-date-popover" align="start">
        {/* The popover is stripped bare and the panel inside it does the work, so the
            calendar sits in the same extruded box as every other surface on the page
            rather than under an offset drop shadow imitating one. */}
        <div className="sa-panel-cell stats-date-cell">
          <div className="sa-panel stats-date-panel">
            <Calendar
              mode="single"
              selected={selected}
              defaultMonth={selected}
              startMonth={toDate(min)}
              endMonth={toDate(max)}
              disabled={{ before: toDate(min)!, after: toDate(max)! }}
              onSelect={(date) => {
                const iso = toISO(date)
                if (iso) {
                  onChange(iso)
                  setOpen(false)
                }
              }}
              components={{ DayButton: DayCircle }}
              autoFocus
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function RangeFilter({
  slice,
  spanDays,
  bounds,
  onPreset,
  onCustom,
}: {
  slice: Slice
  spanDays: number
  bounds: { min: string; max: string }
  onPreset: (key: string) => void
  onCustom: (start: string, end: string) => void
}) {
  const isCustom = slice.key === CUSTOM_RANGE

  return (
    <div className="stats-filters">
      <div className="stats-rangebar" data-custom={isCustom || undefined}>
        <CalendarIcon className="stats-rangebar-icon" aria-hidden="true" />
        <span className="stats-rangebar-key">From</span>
        <DateField
          label="From"
          value={slice.start}
          min={bounds.min}
          max={bounds.max}
          // Dragging one end past the other is a normal way to redraw a window, so it
          // flips rather than refusing: aggregate() orders the pair before slicing.
          onChange={(iso) => onCustom(iso, slice.end)}
        />
        <span className="stats-rangebar-key">to</span>
        <DateField
          label="To"
          value={slice.end}
          min={bounds.min}
          max={bounds.max}
          onChange={(iso) => onCustom(slice.start, iso)}
        />
        <span className="stats-rangebar-span">
          {spanDays.toLocaleString()} {plural(spanDays, 'day')}
        </span>
      </div>

      <div className="stats-presets" role="group" aria-label="Range presets">
        {RANGES.map((preset) => {
          const active = !isCustom && preset.key === slice.key
          return (
            <SAButton
              key={preset.key}
              cellClassName="stats-preset-cell"
              className={active ? 'is-active' : ''}
              aria-pressed={active}
              onClick={() => onPreset(preset.key)}
            >
              {preset.label}
            </SAButton>
          )
        })}
      </div>
    </div>
  )
}
