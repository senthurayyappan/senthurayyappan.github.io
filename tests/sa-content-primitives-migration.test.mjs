import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('content components use shared SA primitives', async () => {
  const mdx = await readFile(new URL('../components/mdx.tsx', import.meta.url), 'utf8')
  const explorer = await readFile(new URL('../components/BlogExplorer.tsx', import.meta.url), 'utf8')
  const article = await readFile(new URL('../app/blog/[slug]/page.tsx', import.meta.url), 'utf8')
  const globals = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8')

  assert.match(mdx, /sa-callout/)
  assert.match(mdx, /data-sa-tone/)
  assert.match(mdx, /sa-rule/)
  assert.match(mdx, /data-sa-axis="horizontal"/)
  assert.match(explorer, /sa-tag/)
  assert.match(article, /sa-tag/)
  assert.doesNotMatch(globals, /\.sketch-hr\s*\{/)
})
