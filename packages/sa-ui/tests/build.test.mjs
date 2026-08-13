import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import test from 'node:test'

const packageRoot = new URL('../', import.meta.url)

test('package exposes the CSS entry points', async () => {
  const manifest = JSON.parse(await readFile(new URL('package.json', packageRoot), 'utf8'))
  assert.equal(manifest.name, '@senthur/sa-ui')
  assert.equal(manifest.version, '0.1.0')
  assert.equal(manifest.exports['./styles.css'], './dist/sa-ui.css')
  assert.equal(manifest.exports['./fonts.css'], './dist/sa-ui-fonts.css')
  assert.equal(manifest.exports['./tokens.css'], './src/tokens.css')
})

test('build emits core and optional font CSS', async () => {
  const core = await readFile(new URL('dist/sa-ui.css', packageRoot), 'utf8')
  const fonts = await readFile(new URL('dist/sa-ui-fonts.css', packageRoot), 'utf8')
  assert.match(core, /--sa-black:\s*#15130d/)
  assert.match(core, /@layer sa\.tokens/)
  assert.doesNotMatch(core, /@font-face/)
  assert.match(fonts, /font-family:\s*['\"]Senthur Handwriting['\"]/)
  await stat(new URL('dist/fonts/senthur-handwriting.woff', packageRoot))
})

test('public compatibility font matches the package font', async () => {
  const [packageFont, compatibilityFont] = await Promise.all([
    readFile(new URL('assets/senthur-handwriting.woff', packageRoot)),
    readFile(new URL('../../public/fonts/senthur-handwriting.woff', packageRoot)),
  ])
  assert.deepEqual(compatibilityFont, packageFont)
})
