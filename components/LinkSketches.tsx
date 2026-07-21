'use client'

import { annotate } from 'rough-notation'
import { useEffect } from 'react'

export function LinkSketches() {
  useEffect(() => {
    const active = new Map<HTMLAnchorElement, ReturnType<typeof annotate>>()
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
        animationDuration: 360,
      })

      active.set(link, annotation)
      annotation.show()
    }

    const hide = (link: HTMLAnchorElement | null) => {
      if (!link) return
      const annotation = active.get(link)
      if (!annotation) return
      annotation.remove()
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
      active.forEach((annotation) => annotation.remove())
      active.clear()
    }
  }, [])

  return null
}
