'use client'

import * as React from 'react'
import Link from 'next/link'

import './stats.css'
import { ActivityHeatmap } from './activity-heatmap'
import { BreakdownPanel } from './breakdown-panel'
import { StatsSkeleton } from './loading-skeleton'
import { StatsPanel } from './panel'
import { RangeFilter } from './range-filter'
import { StatTiles } from './stat-tiles'
import { TrendChart, TrendLegend } from './trend-chart'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
  CUSTOM_RANGE,
  DEFAULT_RANGE,
  aggregate,
  pickableBounds,
  resolveSlice,
} from '@/lib/stats/aggregate'
import { isValidISO } from '@/lib/stats/dates'
import { syncStamp } from '@/lib/stats/format'
import type { Bundle } from '@/lib/stats/types'

/**
 * Coding statistics, read from a self-hosted wakapi through a small public API.
 *
 * The site is a static export, so there is no server here to slice data per request.
 * Instead the API ships the whole day-level history in one cacheable response and
 * this component does the slicing, which is why changing the range is instant and
 * why a custom date pair needs no round trip. See lib/stats/aggregate.ts.
 */

const API_BASE = process.env.NEXT_PUBLIC_STATS_API ?? 'https://stats.senthurayyappan.com'

type Load =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'ready'; bundle: Bundle }

interface RangeState {
  key: string
  start: string | null
  end: string | null
}

/**
 * The range lives in the query string as well as in state.
 *
 * The server-rendered version of this page used plain `?range=` links, which made a
 * view shareable and let it survive a reload. Moving the slicing into the browser
 * would have quietly dropped that, so it is put back by hand -- `replaceState`, not
 * `push`, because clicking through five presets should not mean five taps of Back to
 * leave the page.
 */
function readRangeFromUrl(): RangeState {
  if (typeof window === 'undefined') return { key: DEFAULT_RANGE, start: null, end: null }
  const params = new URLSearchParams(window.location.search)
  const from = params.get('from')
  const to = params.get('to')
  if (isValidISO(from) && isValidISO(to)) return { key: CUSTOM_RANGE, start: from, end: to }
  return { key: params.get('range') ?? DEFAULT_RANGE, start: null, end: null }
}

function writeRangeToUrl(range: RangeState) {
  const params = new URLSearchParams(window.location.search)
  params.delete('range')
  params.delete('from')
  params.delete('to')
  if (range.key === CUSTOM_RANGE && range.start && range.end) {
    params.set('from', range.start)
    params.set('to', range.end)
  } else if (range.key !== DEFAULT_RANGE) {
    params.set('range', range.key)
  }
  const query = params.toString()
  window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
}

export function StatsDashboard() {
  const [load, setLoad] = React.useState<Load>({ state: 'loading' })
  // Lazily initialised, so the query string is read once on mount rather than during
  // the static prerender, where there is no location to read.
  const [range, setRange] = React.useState<RangeState>(readRangeFromUrl)

  const selectRange = React.useCallback((next: RangeState) => {
    setRange(next)
    writeRangeToUrl(next)
  }, [])

  React.useEffect(() => {
    const controller = new AbortController()
    fetch(`${API_BASE}/api/bundle.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`the stats API answered ${response.status}`)
        return response.json() as Promise<Bundle>
      })
      .then((bundle) => setLoad({ state: 'ready', bundle }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        // The reason goes to the console, not the page. A visitor cannot act on
        // "Load failed"; whoever is debugging this still needs it.
        console.warn('[stats] could not reach the stats API:', error)
        setLoad({ state: 'error' })
      })
    return () => controller.abort()
  }, [])

  // Everything below derives from (bundle, range), so the whole page is consistent by
  // construction: there is no second copy of a total to fall out of step.
  const view = React.useMemo(() => {
    if (load.state !== 'ready') return null
    const slice = resolveSlice(load.bundle, range.key, range.start, range.end)
    return {
      slice,
      stats: aggregate(load.bundle, slice),
      bounds: pickableBounds(load.bundle),
    }
  }, [load, range])

  if (load.state === 'loading') return <StatsSkeleton />

  if (load.state === 'error') {
    return (
      <div className="stats">
        <StatsPanel title="Coding statistics">
          <p className="stats-empty">
            My VPS is probably down, please stay tuned.{' '}
            <Link
              href="/blog"
              className="sa-mark"
              data-sa-mark="underline"
              data-sa-trigger="interaction"
            >
              Read one of my blogs
            </Link>{' '}
            maybe?
          </p>
        </StatsPanel>
      </div>
    )
  }

  const { bundle } = load
  const { slice, stats, bounds } = view!

  return (
    <TooltipProvider delayDuration={150}>
      <div className="stats">
        <RangeFilter
          slice={slice}
          spanDays={stats.spanDays}
          bounds={bounds}
          onPreset={(key) => selectRange({ key, start: null, end: null })}
          onCustom={(start, end) => selectRange({ key: CUSTOM_RANGE, start, end })}
        />

        <StatTiles stats={stats} />

        <StatsPanel
          title={`Coding time by ${slice.bucket}`}
          note="hours"
          className="stats-span"
        >
          <TrendLegend />
          <TrendChart bars={stats.trend} bucket={slice.bucket} />
        </StatsPanel>

        <StatsPanel title="Daily activity" note={slice.label.toLowerCase()} className="stats-span">
          <ActivityHeatmap weeks={stats.heatmap} bestDay={stats.bestDay} />
        </StatsPanel>

        <div className="stats-grid stats-grid-halves">
          <BreakdownPanel title="Languages" breakdown={stats.breakdowns.language} glyphs />
          <BreakdownPanel
            title="Projects"
            breakdown={stats.breakdowns.project}
            footnote="Projects that are not public repositories are shown under a stable pseudonym."
          />
          <BreakdownPanel
            title="Editors"
            breakdown={stats.breakdowns.editor}
            footnote="AI agents report themselves in the same field editors do; they are folded into other."
          />
          <BreakdownPanel
            title="Operating systems"
            breakdown={stats.breakdowns.os}
            footnote="Machine hostnames are never collected by this dashboard."
          />
        </div>

        <p className="stats-foot">
          Collected by{' '}
          <a href="https://github.com/muety/wakapi" target="_blank" rel="noopener noreferrer">
            wakapi
          </a>
          , self-hosted, and rendered from a local daily routine.{' '}
          {bundle.last_sync_at ? (
            <>
              Last synced {syncStamp(bundle.last_sync_at)}
              {bundle.stale && <span className="stats-stale"> (stale)</span>}.
            </>
          ) : (
            <span className="stats-stale">Never synced.</span>
          )}
        </p>
      </div>
    </TooltipProvider>
  )
}
