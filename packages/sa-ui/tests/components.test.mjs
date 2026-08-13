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

test('interactive extrusions expand on keyboard focus without hover support', async () => {
  const css = await readFile(new URL('../dist/sa-ui.css', import.meta.url), 'utf8')
  const hoverMediaIndex = css.indexOf('@media (hover: hover)')
  const keyboardRules = css.slice(0, hoverMediaIndex)

  assert.match(keyboardRules, /\.sa-extrude\[data-sa-extrude=interactive\]:focus-within/)
  assert.match(keyboardRules, /\.sa-panel-cell\[data-sa-extrude=interactive\]:focus-within/)
  assert.match(keyboardRules, /\.sa-panel-cell--interactive:focus-within/)
})

test('select fields keep a forced-colors keyboard focus indicator', async () => {
  const css = await readFile(new URL('../dist/sa-ui.css', import.meta.url), 'utf8')
  const forcedColorsRules = css.slice(css.indexOf('@media (forced-colors: active)'))

  assert.match(forcedColorsRules, /\.sa-select__field:focus-visible/)
  assert.match(forcedColorsRules, /outline:\s*2px solid Highlight/)
})

test('direct callout CSS defines every supported tone', async () => {
  const css = await readFile(new URL('../src/components/callout.css', import.meta.url), 'utf8')

  for (const [tone, surface, text] of [
    ['yellow', 'yellow', 'black'],
    ['blue', 'blue', 'white'],
    ['red', 'red', 'white'],
  ]) {
    assert.match(
      css,
      new RegExp(
        `\\.sa-callout\\[data-sa-tone='${tone}'\\]\\s*\\{\\s*--sa-tone-surface: var\\(--sa-${surface}\\);\\s*--sa-tone-text: var\\(--sa-${text}\\);`,
      ),
    )
  }
})
