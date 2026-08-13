import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { enhance } from '../dist/sa-ui.js'

test('enhance is idempotent and cleanup removes listeners', () => {
  const events = new Map()
  const root = {
    querySelectorAll: () => [],
    addEventListener: (name, handler) => events.set(name, handler),
    removeEventListener: (name) => events.delete(name),
  }
  const first = enhance(root)
  const second = enhance(root)
  assert.equal(first, second)
  assert.deepEqual([...events.keys()].sort(), ['focusin', 'focusout', 'pointerout', 'pointerover'])
  first()
  assert.equal(events.size, 0)
})

test('repeated enhance calls initialize new marks without duplicate listeners', () => {
  const previousWindow = globalThis.window
  const previousElement = globalThis.Element
  const listeners = new Map()
  const marks = []

  class Element {
    constructor() {
      this.dataset = { saMark: 'underline', saTrigger: 'interaction' }
    }

    removeAttribute(name) {
      const key = name.replace(/^data-/, '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      delete this.dataset[key]
    }
  }

  globalThis.Element = Element
  globalThis.window = { matchMedia: () => ({ matches: false }) }

  try {
    const root = {
      querySelectorAll: () => marks,
      addEventListener: (name, handler) => {
        assert.equal(listeners.has(name), false, `${name} was added twice`)
        listeners.set(name, handler)
      },
      removeEventListener: (name) => listeners.delete(name),
    }
    const first = enhance(root)
    const added = new Element()
    marks.push(added)
    const second = enhance(root)

    assert.equal(second, first)
    assert.equal(added.dataset.saEnhanced, 'idle')
    assert.equal(listeners.size, 4)
    first()
  } finally {
    globalThis.window = previousWindow
    globalThis.Element = previousElement
  }
})

test('enhance keeps an interaction mark during focus moves between descendants', () => {
  const previousWindow = globalThis.window
  const previousNode = globalThis.Node
  const previousElement = globalThis.Element
  const events = new Map()

  class Node {}
  class Element extends Node {
    constructor(mark) {
      super()
      this.mark = mark ?? this
      this.dataset = mark ? {} : { saMark: 'underline', saTrigger: 'interaction' }
      this.children = []
    }

    closest() {
      return this.mark
    }

    contains(target) {
      return target === this || this.children.includes(target)
    }

    removeAttribute(name) {
      const key = name.replace(/^data-/, '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      delete this.dataset[key]
    }
  }

  globalThis.Node = Node
  globalThis.Element = Element
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  }

  try {
    const mark = new Element()
    const first = new Element(mark)
    const second = new Element(mark)
    mark.children = [first, second]
    const root = {
      querySelectorAll: () => [],
      addEventListener: (name, handler) => events.set(name, handler),
      removeEventListener: (name) => events.delete(name),
    }
    const cleanup = enhance(root)

    events.get('focusin')({ target: first })
    events.get('focusout')({ target: first, relatedTarget: second })

    assert.equal(mark.dataset.saEnhanced, 'true')
    cleanup()
  } finally {
    globalThis.window = previousWindow
    globalThis.Node = previousNode
    globalThis.Element = previousElement
  }
})

test('interaction fallbacks follow the enhancer lifecycle', async () => {
  const previousWindow = globalThis.window
  const previousNode = globalThis.Node
  const previousElement = globalThis.Element
  const events = new Map()

  class Node {}
  class Element extends Node {
    constructor() {
      super()
      this.dataset = { saMark: 'circle', saTrigger: 'interaction' }
    }

    closest() { return this }
    contains(target) { return target === this }
    matches() { return true }
    removeAttribute(name) {
      const key = name.replace(/^data-/, '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      delete this.dataset[key]
    }
  }

  globalThis.Node = Node
  globalThis.Element = Element
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  }

  try {
    const mark = new Element()
    assert.equal(mark.dataset.saEnhanced, undefined, 'no JavaScript keeps the fallback visible')
    const root = {
      querySelectorAll: () => [mark],
      addEventListener: (name, handler) => events.set(name, handler),
      removeEventListener: (name) => events.delete(name),
    }
    const cleanup = enhance(root)

    assert.equal(mark.dataset.saEnhanced, 'idle', 'initialization hides the idle fallback')
    events.get('focusin')({ target: mark })
    assert.equal(mark.dataset.saEnhanced, 'true')
    events.get('focusout')({ target: mark, relatedTarget: null })
    assert.equal(mark.dataset.saEnhanced, 'idle')
    events.get('pointerover')({ target: mark, relatedTarget: null })
    assert.equal(mark.dataset.saEnhanced, 'true')
    events.get('pointerout')({ target: mark, relatedTarget: null })
    assert.equal(mark.dataset.saEnhanced, 'idle')
    cleanup()
    assert.equal(mark.dataset.saEnhanced, undefined, 'cleanup restores the fallback')

    globalThis.window.matchMedia = () => ({ matches: true })
    const reducedMark = new Element()
    const reducedRoot = {
      querySelectorAll: () => [reducedMark],
      addEventListener: () => assert.fail('reduced motion must use the static fallback'),
      removeEventListener: () => {},
    }
    enhance(reducedRoot)()
    assert.equal(reducedMark.dataset.saEnhanced, undefined)

    const css = await readFile(new URL('../dist/sa-ui.css', import.meta.url), 'utf8')
    assert.match(css, /\.sa-mark\[data-sa-enhanced\]::after\s*\{\s*display:\s*none/)
  } finally {
    globalThis.window = previousWindow
    globalThis.Node = previousNode
    globalThis.Element = previousElement
  }
})
