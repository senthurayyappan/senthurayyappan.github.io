type SketchArrowProps = {
  direction?: 'right' | 'up-right'
  className?: string
}

export function SketchArrow({ direction = 'right', className = '' }: SketchArrowProps) {
  const primary = direction === 'up-right'
    ? 'M2.4 13.3 C6.8 10.1 11.3 6.2 18.8 2.3 M11.6 2.2 C14.1 2 16.4 2.1 18.9 2.3 C18.6 4.5 18.6 6.8 18.8 9.1'
    : 'M2.1 8.3 C6.5 7.7 12.1 8.4 19.2 7.8 M13.2 2.8 C15.1 4.7 17.3 6.6 19.3 7.8 C17.1 9.5 15.3 11.4 13.1 13.2'

  const echo = direction === 'up-right'
    ? 'M2.8 14 C7.5 10.2 12 6.8 19.4 2.7 M12.1 1.7 C14.6 1.6 16.8 1.8 19.4 2.5 C19 4.9 19.1 7 19.3 9.4'
    : 'M1.8 8.9 C7.1 8.1 12.7 8.8 19.7 8.2 M13.6 2.3 C15.6 4.4 17.8 6.2 19.8 8 C17.7 9.8 15.8 11.8 13.5 13.7'

  return (
    <svg
      className={`sketch-arrow ${className}`}
      viewBox="0 0 22 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={primary} />
      <path className="sketch-arrow-echo" d={echo} />
    </svg>
  )
}
