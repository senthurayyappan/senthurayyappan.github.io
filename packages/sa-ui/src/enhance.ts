import { annotate } from 'rough-notation'

export type SketchMark = 'underline' | 'circle' | 'highlight'
export type SketchTrigger = 'immediate' | 'interaction'
export type EnhanceRoot = ParentNode & Pick<EventTarget, 'addEventListener' | 'removeEventListener'>

type ActiveMark = {
  annotation: ReturnType<typeof annotate>
  frames: number[]
}

const cleanups = new WeakMap<object, () => void>()

function getNumber(value: string, fallback: number): number {
  const number = Number.parseFloat(value)
  return Number.isFinite(number) ? number : fallback
}

function getDuration(value: string, fallback: number): number {
  const duration = getNumber(value, fallback)
  return value.trim().endsWith('s') && !value.trim().endsWith('ms') ? duration * 1000 : duration
}

function getMark(element: HTMLElement): SketchMark | undefined {
  const mark = element.dataset.saMark
  return mark === 'underline' || mark === 'circle' || mark === 'highlight' ? mark : undefined
}

function getTrigger(element: HTMLElement): SketchTrigger {
  return element.dataset.saTrigger === 'interaction' ? 'interaction' : 'immediate'
}

function isMarkElement(element: Element): element is HTMLElement {
  return element.matches('.sa-mark[data-sa-mark]')
}

function getElement(target: EventTarget | null): HTMLElement | undefined {
  if (!(target instanceof Element)) return undefined
  const element = target.closest<HTMLElement>('.sa-mark[data-sa-mark]')
  return element ?? undefined
}

export function enhance(root: EnhanceRoot = document): () => void {
  const existing = cleanups.get(root)
  if (existing) return existing

  const active = new Map<HTMLElement, ActiveMark>()
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const remove = (element: HTMLElement) => {
    const mark = active.get(element)
    if (!mark) return
    mark.frames.forEach((frame) => window.cancelAnimationFrame(frame))
    mark.annotation.remove()
    element.removeAttribute('data-sa-enhanced')
    active.delete(element)
  }

  const show = (element: HTMLElement) => {
    const mark = getMark(element)
    if (!mark || active.has(element)) return

    const style = window.getComputedStyle(element)
    const interaction = getTrigger(element) === 'interaction'
    const duration = getDuration(
      style.getPropertyValue('--sa-mark-duration'),
      interaction ? (mark === 'circle' ? 900 : 720) : 650,
    )
    const strokeWidth = getNumber(
      style.getPropertyValue('--sa-mark-stroke-width'),
      interaction ? 2.2 : 2.5,
    )
    const padding = getNumber(
      style.getPropertyValue('--sa-mark-padding'),
      interaction && mark === 'circle' ? 5 : interaction ? 2 : 3,
    )
    const color = style.getPropertyValue('--sa-mark-color').trim()
    element.dataset.saEnhanced = 'true'
    const annotation = annotate(element, {
      type: mark,
      color: color || undefined,
      padding,
      strokeWidth,
      iterations: 2,
      animate: !reducedMotion,
      animationDuration: duration,
    })
    const activeMark: ActiveMark = { annotation, frames: [] }

    active.set(element, activeMark)

    if (reducedMotion) {
      annotation.show()
      return
    }

    activeMark.frames.push(window.requestAnimationFrame(() => {
      activeMark.frames.push(window.requestAnimationFrame(() => {
        if (active.get(element) !== activeMark) return
        annotation.show()
      }))
    }))
  }

  const getInteractionTarget = (target: EventTarget | null) => {
    const element = getElement(target)
    return element && getTrigger(element) === 'interaction' ? element : undefined
  }

  const onPointerOver = (event: PointerEvent) => {
    const element = getInteractionTarget(event.target)
    if (!element) return
    if (event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) return
    show(element)
  }

  const onPointerOut = (event: PointerEvent) => {
    const element = getInteractionTarget(event.target)
    if (!element) return
    if (event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) return
    remove(element)
  }

  const onFocusIn = (event: FocusEvent) => {
    const element = getInteractionTarget(event.target)
    if (element) show(element)
  }
  const onFocusOut = (event: FocusEvent) => {
    const element = getInteractionTarget(event.target)
    if (element) remove(element)
  }

  root.addEventListener('pointerover', onPointerOver)
  root.addEventListener('pointerout', onPointerOut)
  root.addEventListener('focusin', onFocusIn)
  root.addEventListener('focusout', onFocusOut)

  const elements = Array.from(root.querySelectorAll<HTMLElement>('.sa-mark[data-sa-mark]'))
  const self = typeof Element !== 'undefined' && root instanceof Element && isMarkElement(root) ? [root] : []
  for (const element of self.concat(elements)) {
    if (getTrigger(element) === 'immediate') show(element)
  }

  const cleanup = () => {
    root.removeEventListener('pointerover', onPointerOver)
    root.removeEventListener('pointerout', onPointerOut)
    root.removeEventListener('focusin', onFocusIn)
    root.removeEventListener('focusout', onFocusOut)
    for (const element of Array.from(active.keys())) remove(element)
    cleanups.delete(root)
  }
  cleanups.set(root, cleanup)
  return cleanup
}
