'use client'

import { annotate } from 'rough-notation'
import { useEffect } from 'react'

export function LinkSketches() {
  useEffect(() => {
    type ActiveSketch = {
      annotation: ReturnType<typeof annotate>
      frames: number[]
    }

    const active = new Map<HTMLAnchorElement, ActiveSketch>()

    const getLink = (target: EventTarget | null) =>
      target instanceof Element ? target.closest<HTMLAnchorElement>('a[href]') : null

    const show = (link: HTMLAnchorElement | null) => {
      if (!link || active.has(link) || link.dataset.sketch === 'off') return
      if (link.classList.contains('panel-link-hover')) return

      const explicitTarget = link.querySelector<HTMLElement>('[data-sketch-target]')
      const hasText = Boolean((explicitTarget ?? link).textContent?.trim())
      const hasGraphic = Boolean(link.querySelector('img, svg'))
      if (!hasText && !hasGraphic) return

      const target = explicitTarget ?? link
      const isDark = document.documentElement.classList.contains('dark')
      const annotation = annotate(target, {
        type: hasText ? 'underline' : 'circle',
        color: isDark ? '#f9c90a' : '#ef2841',
        padding: hasText ? 2 : 5,
        strokeWidth: 2.2,
        iterations: 2,
        multiline: true,
        animate: true,
        animationDuration: hasText ? 720 : 900,
      })

      // Rough Notation inserts an SVG during annotate() and then applies a
      // stroke-dash animation during show(). Waiting for two paints keeps
      // Chromium from collapsing those steps into an already-finished stroke.
      const frames: number[] = []
      frames.push(window.requestAnimationFrame(() => {
        frames.push(window.requestAnimationFrame(() => {
          if (active.get(link)?.annotation !== annotation) return
          target.getBoundingClientRect()
          annotation.show()
        }))
      }))
      active.set(link, { annotation, frames })
    }

    const cancelFrames = (sketch: ActiveSketch) => {
      sketch.frames.forEach((frame) => window.cancelAnimationFrame(frame))
      sketch.frames.length = 0
    }

    const hide = (link: HTMLAnchorElement | null) => {
      if (!link) return
      const sketch = active.get(link)
      if (!sketch) return
      cancelFrames(sketch)
      sketch.annotation.remove()
      active.delete(link)
    }

    const removeAll = () => {
      active.forEach((sketch) => {
        cancelFrames(sketch)
        sketch.annotation.remove()
      })
      active.clear()
    }

    const onPointerOver = (event: PointerEvent) => {
      const link = getLink(event.target)
      if (link && event.relatedTarget instanceof Node && link.contains(event.relatedTarget)) return
      show(link)
    }

    const onPointerOut = (event: PointerEvent) => {
      const link = getLink(event.target)
      if (link && event.relatedTarget instanceof Node && link.contains(event.relatedTarget)) return
      hide(link)
    }

    const onFocusIn = (event: FocusEvent) => show(getLink(event.target))
    const onFocusOut = (event: FocusEvent) => hide(getLink(event.target))

    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('pointerout', onPointerOut)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)

    return () => {
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      removeAll()
    }
  }, [])

  return null
}
