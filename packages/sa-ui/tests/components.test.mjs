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

/** Map a byte offset in the bundle to the name of the @layer block containing it. */
function layerAt(css, index) {
  const open = /@layer\s+([\w.]+)\s*\{/g
  let match
  while ((match = open.exec(css))) {
    let cursor = match.index + match[0].length
    let depth = 1
    while (depth > 0 && cursor < css.length) {
      if (css[cursor] === '{') depth += 1
      else if (css[cursor] === '}') depth -= 1
      cursor += 1
    }
    if (index >= match.index && index < cursor) return match[1]
  }
  return null
}

test('enabled buttons expand on keyboard focus and hover', async () => {
  const css = await readFile(new URL('../dist/sa-ui.css', import.meta.url), 'utf8')

  assert.match(css, /\.sa-control:has\(\.sa-button:not\(:disabled\):focus-visible\)/)
  assert.match(css, /\.sa-control:not\(:has\(\.sa-button:disabled\)\):hover/)
  assert.doesNotMatch(css, /\.sa-control:focus-within/)
})

test('control interaction rules are in a layer that can win', async () => {
  // The bug this guards: these three rules lived in sa.components while the
  // `.sa-control` rest declaration lives in sa.effects, a later layer. The cascade
  // sorts by layer BEFORE specificity, so the rest rule won and no button extruded
  // on hover anywhere on the site. Asserting the rule merely EXISTS cannot catch
  // that -- it existed the whole time. Only its layer was wrong.
  const css = await readFile(new URL('../dist/sa-ui.css', import.meta.url), 'utf8')
  const order = css.match(/@layer\s+([^;]+);/)[1].split(',').map((name) => name.trim())

  const rest = css.indexOf('--sa-extrude-current-depth: var(--sa-extrude-depth-rest')
  assert.ok(rest > 0, 'could not find the .sa-control rest declaration')
  const restLayer = order.indexOf(layerAt(css, rest))
  assert.ok(restLayer >= 0, 'rest declaration is outside every declared layer')

  for (const selector of [
    '.sa-control:has(.sa-button:not(:disabled):focus-visible)',
    '.sa-control:has(+ [popover]:popover-open)',
    '.sa-control:not(:has(.sa-button:disabled)):hover',
  ]) {
    const at = css.indexOf(selector)
    assert.ok(at > 0, `missing ${selector}`)
    const layer = order.indexOf(layerAt(css, at))
    assert.ok(
      layer >= restLayer,
      `${selector} is in layer ${order[layer]}, which loses to ${order[restLayer]} `
      + 'no matter how specific it is',
    )
  }
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
