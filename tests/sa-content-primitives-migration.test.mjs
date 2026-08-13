import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('content components use shared SA primitives', async () => {
  const mdx = await readFile(new URL('../components/mdx.tsx', import.meta.url), 'utf8')
  const explorer = await readFile(new URL('../components/BlogExplorer.tsx', import.meta.url), 'utf8')
  const article = await readFile(new URL('../app/blog/[slug]/page.tsx', import.meta.url), 'utf8')
  const globals = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8')

  assert.match(mdx, /<aside className="sa-callout article-callout" data-sa-tone={tone}>/)
  assert.match(mdx, /<hr className="sa-rule" data-sa-axis="horizontal" \/>/)
  assert.match(explorer, /<span className="blog-panel-image-tags" aria-label="Topics">/)
  assert.match(explorer, /<span className="sa-tag" data-sa-tone="blue" key={tag}>{tag}<\/span>/)
  assert.match(article, /<div className="article-tags">/)
  assert.match(article, /<span className="sa-tag" data-sa-tone="blue" key={tag}>{tag}<\/span>/)

  assert.doesNotMatch(globals, /\.sketch-hr\s*\{/)
  assert.doesNotMatch(globals, /\.article-callout--blue\s*\{/)
  assert.doesNotMatch(globals, /\.article-callout::after\s*\{/)
  assert.doesNotMatch(globals, /\.blog-panel-image-tags > span\s*\{/)
  assert.doesNotMatch(globals, /\.article-tags span\s*\{/)
  assert.match(globals, /--sa-tag-frame-color: var\(--sa-black\)/)
  assert.match(globals, /--sa-tag-frame-opacity: \.92/)
  assert.match(globals, /--sa-callout-frame-color: var\(--sa-black\)/)
  assert.match(globals, /--sa-callout-frame-opacity: 1/)
})
