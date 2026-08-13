import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

function relativeLuminance(color) {
  const channels = color.slice(1).match(/../g).map((value) => Number.parseInt(value, 16) / 255)
  const [red, green, blue] = channels.map((value) => (
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ))
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrastRatio(first, second) {
  const values = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

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

test('enabled buttons expand on keyboard focus without hover support', async () => {
  const css = await readFile(new URL('../src/components/button.css', import.meta.url), 'utf8')
  const keyboardRules = css.slice(0, css.indexOf('@media (hover: hover)'))

  assert.match(keyboardRules, /\.sa-control:has\(\.sa-button:not\(:disabled\):focus-visible\)/)
  assert.doesNotMatch(keyboardRules, /\.sa-control:focus-within/)
})

test('select fields keep a forced-colors keyboard focus indicator', async () => {
  const css = await readFile(new URL('../dist/sa-ui.css', import.meta.url), 'utf8')
  const forcedColorsRules = css.slice(css.indexOf('@media (forced-colors: active)'))

  assert.match(forcedColorsRules, /\.sa-select__field:focus-visible/)
  assert.match(forcedColorsRules, /outline:\s*2px solid Highlight/)
})

test('direct callout CSS defines every supported tone', async () => {
  const css = await readFile(new URL('../src/components/callout.css', import.meta.url), 'utf8')

  for (const [tone, surface] of [
    ['yellow', 'yellow'],
    ['blue', 'blue'],
    ['red', 'red'],
  ]) {
    assert.match(
      css,
      new RegExp(
        `\\.sa-callout\\[data-sa-tone='${tone}'\\]\\s*\\{\\s*--sa-tone-surface: var\\(--sa-${surface}\\);\\s*--sa-tone-text: var\\(--sa-${tone}-text\\);`,
      ),
    )
  }
})

test('all tag and callout tone pairs meet normal-text contrast', async () => {
  const tokens = await readFile(new URL('../src/tokens.css', import.meta.url), 'utf8')
  const tag = await readFile(new URL('../src/components/tag.css', import.meta.url), 'utf8')
  const callout = await readFile(new URL('../src/components/callout.css', import.meta.url), 'utf8')
  const colors = Object.fromEntries(
    [...tokens.matchAll(/--(sa-[\w-]+):\s*(#[\da-f]{6});/gi)].map((match) => match.slice(1)),
  )

  for (const tone of ['yellow', 'blue', 'red']) {
    assert.ok(colors[`sa-${tone}-text`], `${tone} needs a text token`)
    assert.ok(contrastRatio(colors[`sa-${tone}`], colors[`sa-${tone}-text`]) >= 4.5, tone)
    for (const css of [tag, callout]) {
      assert.match(css, new RegExp(`--sa-tone-text: var\\(--sa-${tone}-text\\)`))
    }
  }
})

test('active tags use native state and a forced-colors structural cue', async () => {
  const css = await readFile(new URL('../src/components/tag.css', import.meta.url), 'utf8')
  const activeSelector = /\.sa-tag:is\(\[data-sa-active='true'\], \[aria-pressed='true'\], \[aria-current\]:not\(\[aria-current='false'\]\)\)/

  assert.match(css, activeSelector)
  assert.match(css, new RegExp(`${activeSelector.source}\\s*\\{[^}]*text-decoration:`, 's'))
  const forcedColors = css.slice(css.indexOf('@media (forced-colors: active)'))
  assert.match(forcedColors, activeSelector)
  assert.match(forcedColors, /outline:\s*2px solid Highlight/)
})

test('button masks retain the baseline vertical path', async () => {
  const css = await readFile(new URL('../src/components/button.css', import.meta.url), 'utf8')

  assert.match(css, /M3\.27 0 C2\.6 18 3\.47 31 2\.87 48 S3\.53 77 2\.93 100/)
  assert.doesNotMatch(css, /S3\.53 77 3\.53 100 2\.93/)
})
