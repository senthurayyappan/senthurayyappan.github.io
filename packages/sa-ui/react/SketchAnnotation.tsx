'use client'

import React, { useEffect, useRef } from 'react'

import { enhance } from '../src/enhance'

export interface SketchAnnotationProps {
  children: React.ReactNode
  mark?: 'underline' | 'circle' | 'highlight'
  trigger?: 'immediate' | 'interaction'
  className?: string
  color?: string
  padding?: number
}

export function SketchAnnotation({
  children,
  mark = 'underline',
  trigger = 'immediate',
  className = '',
  color,
  padding,
}: SketchAnnotationProps) {
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!elementRef.current) return
    return enhance(elementRef.current)
  }, [color, mark, padding, trigger])

  const style = {
    ...(color ? { '--sa-mark-color': color } : {}),
    ...(padding === undefined ? {} : { '--sa-mark-padding': `${padding}px` }),
  } as React.CSSProperties

  return (
    <span
      ref={elementRef}
      className={`sa-mark${className ? ` ${className}` : ''}`}
      data-sa-mark={mark}
      data-sa-trigger={trigger}
      style={style}
    >
      {children}
    </span>
  )
}
