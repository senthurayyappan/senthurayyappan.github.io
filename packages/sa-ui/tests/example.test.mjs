import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('slide example uses only package distribution assets', async () => {
  const html = await readFile(new URL('../examples/slides.html', import.meta.url), 'utf8')
  assert.match(html, /\.\.\/dist\/sa-ui\.css/)
  assert.match(html, /\.\.\/dist\/sa-ui-fonts\.css/)
  assert.match(html, /from ['"]\.\.\/dist\/sa-ui\.js['"]/)
  assert.match(html, /class="sa-slide/)
  assert.match(html, /data-sa-layout="title"/)
  assert.match(html, /data-sa-layout="split"/)
  assert.doesNotMatch(html, /react|next\/|tailwind/i)
})

test('slide example expands its split layout on a narrow screen', async () => {
  const html = await readFile(new URL('../examples/slides.html', import.meta.url), 'utf8')
  assert.match(html, /@media \(max-width: 48rem\)/)
  assert.match(html, /\.sa-slide\[data-sa-layout='split'\]\s*\{\s*aspect-ratio: auto;\s*overflow: visible;/)
})

test('example server rejects malformed percent encoding', async () => {
  const server = await readFile(new URL('../examples/serve.mjs', import.meta.url), 'utf8')
  assert.match(server, /try \{\s*pathname = decodeURIComponent/)
  assert.match(server, /catch \{\s*response\.writeHead\(400\)\.end\('Bad request'\)/)
})
