import React from 'react'

export interface SAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  cellClassName?: string
  icon?: React.ReactNode
}

export const SAButton = React.forwardRef<HTMLButtonElement, SAButtonProps>(
  ({ cellClassName = '', className = '', icon, children, type = 'button', ...props }, ref) => (
    <span className={`sa-control${cellClassName ? ` ${cellClassName}` : ''}`}>
      <button
        ref={ref}
        type={type}
        className={`sa-button${className ? ` ${className}` : ''}`}
        {...props}
      >
        {icon && <span className="sa-button__icon" aria-hidden="true">{icon}</span>}
        {children && <span className="sa-button__label">{children}</span>}
      </button>
    </span>
  ),
)

SAButton.displayName = 'SAButton'
