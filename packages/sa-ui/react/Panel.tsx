import React from 'react'

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  surfaceClassName?: string
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className = '', surfaceClassName = '', interactive = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`sa-panel-cell${interactive ? ' sa-panel-cell--interactive' : ''}${className ? ` ${className}` : ''}`}
      {...props}
    >
      <div className={`sa-panel${surfaceClassName ? ` ${surfaceClassName}` : ''}`}>{children}</div>
    </div>
  ),
)

Panel.displayName = 'Panel'
