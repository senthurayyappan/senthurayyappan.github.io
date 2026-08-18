'use client'

import dynamic from 'next/dynamic'

import { StatsSkeleton } from './loading-skeleton'

/**
 * Loads the dashboard lazily, and only in the browser.
 *
 * Recharts and react-day-picker are around 150 kB together. Without this boundary
 * they land in the shared vendor chunk that next.config.js builds, which would put
 * them on the critical path of every page on the site -- the blog included -- to
 * serve one page that fetches its data client-side anyway.
 *
 * `ssr: false` is honest rather than a workaround: there is nothing to prerender.
 * The data arrives from a cross-origin API after mount, so a server render can only
 * ever produce the skeleton below.
 */
const StatsDashboard = dynamic(
  () => import('./stats-dashboard').then((m) => m.StatsDashboard),
  { ssr: false, loading: () => <StatsSkeleton /> },
)

export function StatsClient() {
  return <StatsDashboard />
}
