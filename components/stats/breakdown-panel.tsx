'use client'

import { LockIcon } from 'lucide-react'

import { StatsPanel } from './panel'
import { duration } from '@/lib/stats/format'
import { languageIcon } from '@/lib/stats/language-icons'
import type { Breakdown, Row } from '@/lib/stats/types'

/**
 * A nominal breakdown: one hue for every bar.
 *
 * These categories have no natural order and bar length already encodes the value, so
 * colouring each bar by its own size would spend the identity channel re-encoding
 * what the length already shows. The fold row is the one exception -- it is not a
 * name, so it is drawn in the recessive neutral to say so.
 */

function LanguageGlyph({ name }: { name: string }) {
  const path = languageIcon(name)
  return (
    <span className="stats-glyph" aria-hidden="true">
      {path ? (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d={path} />
        </svg>
      ) : (
        // Languages without an official mark still get a slot, so every label starts
        // at the same x and the column of names stays straight.
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.5 8.5 6 12l3.5 3.5M14.5 8.5 18 12l-3.5 3.5" strokeLinecap="round" />
        </svg>
      )}
    </span>
  )
}

function BarRow({ row, showGlyph }: { row: Row; showGlyph: boolean }) {
  return (
    <li className="stats-bar" data-fold={row.isFold || undefined}>
      <span className="stats-bar-name">
        {showGlyph && !row.isFold && <LanguageGlyph name={row.label} />}
        {row.isPrivate && (
          <LockIcon
            className="stats-bar-lock"
            aria-label="Private project, shown under a stable pseudonym"
          />
        )}
        <span className="stats-bar-text">{row.label}</span>
      </span>
      <span className="stats-bar-value">{duration(row.seconds)}</span>
      <span className="stats-bar-track">
        <span className="stats-bar-fill" style={{ width: `${row.share}%` }} />
      </span>
    </li>
  )
}

export function BreakdownPanel({
  title,
  breakdown,
  footnote,
  glyphs = false,
}: {
  title: string
  breakdown: Breakdown
  footnote?: string
  /** Show a language mark beside each label. Only meaningful for the language panel. */
  glyphs?: boolean
}) {
  return (
    <StatsPanel title={title} note={breakdown.note} bodyClassName="stats-panel-column">
      {breakdown.rows.length === 0 ? (
        <p className="stats-empty">No recorded time in this range.</p>
      ) : (
        <ul className="stats-bars">
          {breakdown.rows.map((row) => (
            <BarRow key={row.label} row={row} showGlyph={glyphs} />
          ))}
        </ul>
      )}
      {/* Pinned to the bottom of the panel rather than trailing the last bar, so a
          panel holding four rows still reads as a finished block instead of a list
          with a stray sentence stuck to it. */}
      {footnote && <p className="stats-card-footnote">{footnote}</p>}
    </StatsPanel>
  )
}
