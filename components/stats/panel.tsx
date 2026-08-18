import { SAPanel } from '@/components/SAPanel'
import { cn } from '@/lib/utils'

/**
 * A dashboard card. Thin wrapper over sa-ui's Panel so every card on this page picks
 * up the site's extruded frame -- accent right face, blue bottom face, both following
 * the theme -- from one place. See `.stats-card` in stats.css.
 */
export function StatsPanel({
  title,
  note,
  className,
  bodyClassName,
  children,
}: {
  title?: string
  note?: string
  className?: string
  bodyClassName?: string
  children: React.ReactNode
}) {
  return (
    <SAPanel className={cn('stats-card', className)} surfaceClassName={bodyClassName}>
      {(title || note) && (
        <div className="stats-card-head">
          {title && <h2 className="stats-card-title">{title}</h2>}
          {note && <span className="stats-card-note">{note}</span>}
        </div>
      )}
      {children}
    </SAPanel>
  )
}
