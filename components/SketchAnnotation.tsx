'use client'

import { annotate } from 'rough-notation'
import React, { useEffect, useRef } from 'react'

type RoughAnnotationType = 'underline' | 'box' | 'circle' | 'highlight' | 'strike-through' | 'crossed-off' | 'bracket'

interface SketchAnnotationProps {
  children: React.ReactNode
  type?: RoughAnnotationType
  color?: string
  className?: string
  padding?: number
}

export function SketchAnnotation({
  children,
  type = 'underline',
  color = '#ef2841',
  className = '',
  padding = 3,
}: SketchAnnotationProps) {
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const annotation = annotate(elementRef.current, {
      type,
      color,
      padding,
      strokeWidth: 2.5,
      iterations: 2,
      animate: !reduceMotion,
      animationDuration: 650,
    })

    const frame = window.requestAnimationFrame(() => annotation.show())
    return () => {
      window.cancelAnimationFrame(frame)
      annotation.remove()
    }
  }, [color, padding, type])

  return (
    <span ref={elementRef} className={`sketch-annotation ${className}`}>
      {children}
    </span>
  )
}
