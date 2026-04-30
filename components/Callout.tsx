import React from 'react'

type CalloutType = 'note' | 'warning' | 'tip'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

const LABELS: Record<CalloutType, string> = {
  note: 'Note',
  warning: 'Warning',
  tip: 'Tip',
}

const ICONS: Record<CalloutType, React.ReactNode> = {
  note: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  warning: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  tip: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2z" />
    </svg>
  ),
}

export default function Callout({
  type = 'note',
  title,
  children,
}: CalloutProps) {
  return (
    <aside className={`callout callout-${type}`}>
      <div className="callout-header">
        <span className="callout-icon">{ICONS[type]}</span>
        <span className="callout-label">{title || LABELS[type]}</span>
      </div>
      <div className="callout-body">{children}</div>
    </aside>
  )
}
