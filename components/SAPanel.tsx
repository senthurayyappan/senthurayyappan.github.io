import React from 'react'

export interface SAPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  surfaceClassName?: string
}

export const SAPanel = React.forwardRef<HTMLDivElement, SAPanelProps>(
  ({ className = '', surfaceClassName = '', interactive = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`sa-panel-cell${interactive ? ' sa-panel-cell--interactive' : ''}${className ? ` ${className}` : ''}`}
      {...props}
    >
      <div className={`sa-panel${surfaceClassName ? ` ${surfaceClassName}` : ''}`}>
        {children}
      </div>
    </div>
  ),
)

SAPanel.displayName = 'SAPanel'
