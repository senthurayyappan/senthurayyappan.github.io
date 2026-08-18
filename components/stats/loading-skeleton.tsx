import './stats.css'

/**
 * The placeholder shown while the dashboard chunk loads.
 *
 * Deliberately dependency-free: plain divs, no `cn`, no shadcn `Skeleton`. This
 * module is the one part of the stats page that is imported *eagerly*, so anything
 * it touches from node_modules gets pulled into the single shared vendor chunk that
 * next.config.js builds -- and would then ship on every page of the site. Importing
 * shadcn's Skeleton here costs `tailwind-merge` site-wide to render eight grey
 * rectangles. The real dashboard uses shadcn freely; it lives in the lazy chunk.
 */

const TILES = ['a', 'b', 'c', 'd']

export function StatsSkeleton() {
  return (
    <div className="stats" aria-busy="true" aria-label="Loading coding statistics">
      <div className="stats-skeleton stats-skeleton-filters" />
      <div className="stats-grid stats-grid-tiles">
        {TILES.map((key) => (
          <div key={key} className="stats-skeleton stats-skeleton-tile" />
        ))}
      </div>
      <div className="stats-skeleton stats-skeleton-chart" />
      <div className="stats-skeleton stats-skeleton-heat" />
      <div className="stats-grid stats-grid-halves">
        {TILES.map((key) => (
          <div key={key} className="stats-skeleton stats-skeleton-panel" />
        ))}
      </div>
    </div>
  )
}
