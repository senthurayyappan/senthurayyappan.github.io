import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('portfolio panels use the generic extrusion contract', async () => {
  const globals = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8')
  const recent = await readFile(new URL('../components/RecentUpdates.tsx', import.meta.url), 'utf8')
  const like = await readFile(new URL('../components/ArticleLikeButton.tsx', import.meta.url), 'utf8')
  const article = await readFile(new URL('../app/blog/[slug]/page.tsx', import.meta.url), 'utf8')

  assert.doesNotMatch(globals, /@property --(?:post|like|pagination)-depth/)
  assert.doesNotMatch(globals, /\.latest-post-cell::before/)
  assert.doesNotMatch(globals, /\.article-like-cell::before/)
  assert.doesNotMatch(globals, /\.article-pagination-cell::before/)

  for (const source of [recent, like, article]) {
    assert.match(source, /sa-extrude/)
    assert.match(source, /sa-extrude__face/)
  }
})
