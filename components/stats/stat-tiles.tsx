'use client'

import { InfoIcon } from 'lucide-react'

import { StatsPanel } from './panel'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { dayLabel, duration, hours, plural } from '@/lib/stats/format'
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
        // Measured days only, wherever the range has any, so the tile has to say which
        // days it is speaking for rather than implying the whole range.
        sub={
          stats.aiShareBasis === 'producer' && stats.aiShareSince
            ? `of tracked time since ${dayLabel(stats.aiShareSince)}`
            : 'of tracked time in this range'
        }
        // Which ruler produced the number. `panel-focus` is the weaker one and
        // overstates AI, so it says so outright rather than letting the reader assume
        // both halves of the history were measured the same way.
        hint={
          stats.aiShareBasis === 'producer'
            ? 'Measured from which process wrote each heartbeat: agent sessions carry the model that ran them, an editor does not. Typing counts as yours, including completions you accept.'
            : 'Inferred from the editor\u2019s category field, which reports AI whenever an AI panel held focus \u2014 so it overstates it. This range predates the heartbeat evidence.'
        }
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
