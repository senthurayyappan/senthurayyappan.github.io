'use client'

import { InfoIcon } from 'lucide-react'

import { StatsPanel } from './panel'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { duration, hours, plural } from '@/lib/stats/format'
import type { Stats } from '@/lib/stats/types'

/**
 * One tile shape for all four readings. They are four answers to the same question
 * about the same range, so none of them is chrome around a headline -- they share a
 * figure size, an optional unit, and a supporting line pinned to the panel floor.
 */
function Tile({
  label,
  value,
  unit,
  sub,
  hint,
}: {
  label: string
  value: string
  unit?: string
  sub: string
  hint?: string
}) {
  return (
    <StatsPanel className="stats-tile" bodyClassName="stats-tile-body">
      <h2 className="stats-card-title">
        {label}
        {hint && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="stats-hint" aria-label={`About ${label}`}>
                <InfoIcon aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="stats-hint-content">{hint}</TooltipContent>
          </Tooltip>
        )}
      </h2>
      <p className="stats-tile-value">
        {value}
        {unit && <span className="stats-tile-unit"> {unit}</span>}
      </p>
      <p className="stats-tile-sub">{sub}</p>
    </StatsPanel>
  )
}

export function StatTiles({ stats }: { stats: Stats }) {
  return (
    <div className="stats-grid stats-grid-tiles">
      <Tile
        label="Time tracked"
        value={hours(stats.totalSeconds)}
        unit="hours"
        sub={`across ${stats.activeDays} active ${plural(stats.activeDays, 'day')} of ${stats.spanDays}`}
      />

      <Tile
        label="Daily average"
        value={duration(stats.dailyAverage)}
        sub="on days with any activity"
      />

      <Tile
        label="AI-assisted"
        value={`${stats.aiShare.toFixed(0)}%`}
        sub="of tracked time in this range"
        // The number is real but it measures something narrower than it sounds like,
        // and a reader who sees a month at 100% will otherwise draw the wrong
        // conclusion. Kept to a hint so it does not become a wall of text.
        hint="Editors report this from chat-panel focus, cleared after a typing debounce. A high share means the work ran through an assistant."
      />

      <Tile
        label="Longest streak"
        value={String(stats.longestStreak)}
        unit={plural(stats.longestStreak, 'day')}
        sub={`current streak ${stats.currentStreak} ${plural(stats.currentStreak, 'day')}`}
      />
    </div>
  )
}
