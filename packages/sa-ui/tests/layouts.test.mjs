import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const cssUrl = new URL('../dist/sa-ui.css', import.meta.url)

test('bundle exports portable layouts and container recipes', async () => {
  const css = await readFile(cssUrl, 'utf8')
  for (const name of [
    'sa-stack',
    'sa-cluster',
    'sa-grid',
    'sa-split',
    'sa-frame',
    'sa-slide',
    'sa-panel-grid',
  ]) {
    assert.match(css, new RegExp(`\\.${name}\\b`))
  }
  assert.match(css, /@container/)
  assert.match(css, /data-sa-layout=(?:['"])?title(?:['"])?/)
  assert.match(css, /data-sa-layout=(?:['"])?split(?:['"])?/)
})
