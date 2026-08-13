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
