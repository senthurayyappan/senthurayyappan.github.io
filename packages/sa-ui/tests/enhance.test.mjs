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
