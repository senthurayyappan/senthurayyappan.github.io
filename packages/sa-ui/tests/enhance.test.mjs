import assert from 'node:assert/strict'
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
