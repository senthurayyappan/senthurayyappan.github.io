import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('bundle exports shared components and effects', async () => {
  const css = await readFile(new URL('../dist/sa-ui.css', import.meta.url), 'utf8')
  for (const name of [
    'sa-extrude',
    'sa-extrude__face',
    'sa-control',
    'sa-button',
    'sa-select',
    'sa-panel',
    'sa-tag',
    'sa-callout',
    'sa-rule',
    'sa-mark',
  ]) {
    assert.match(css, new RegExp(`\\.${name}\\b`))
  }
  assert.match(css, /data-sa-extrude=(?:['"])?interactive(?:['"])?/)
  assert.match(css, /prefers-reduced-motion:\s*reduce/)
  assert.match(css, /forced-colors:\s*active/)
})
