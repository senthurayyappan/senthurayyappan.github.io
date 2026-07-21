'use client'

import { annotate } from 'rough-notation'
import { useEffect } from 'react'

export function LinkSketches() {
  useEffect(() => {
    type ActiveSketch = {
      annotation: ReturnType<typeof annotate>
      frame: number
    }

    const active = new Map<HTMLAnchorElement, ActiveSketch>()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
        animate: !reducedMotion,
        animationDuration: hasText ? 720 : 900,
      })

      // Rough Notation creates the SVG when annotate() runs. Showing it on the
      // following paint guarantees the browser presents the initial dashed
      // stroke before transitioning it to the completed drawing.
      const frame = window.requestAnimationFrame(() => {
        if (active.get(link)?.annotation === annotation) annotation.show()
      })
      active.set(link, { annotation, frame })
    }

    const hide = (link: HTMLAnchorElement | null) => {
      if (!link) return
      const sketch = active.get(link)
      if (!sketch) return
      window.cancelAnimationFrame(sketch.frame)
      sketch.annotation.remove()
      active.delete(link)
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
      active.forEach(({ annotation, frame }) => {
        window.cancelAnimationFrame(frame)
        annotation.remove()
      })
      active.clear()
    }
  }, [])

  return null
}
