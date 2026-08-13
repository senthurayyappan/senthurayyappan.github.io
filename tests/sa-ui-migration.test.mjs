import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import test from 'node:test'

test('portfolio consumes package CSS without duplicate foundations', async () => {
  const layout = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8')
  const globals = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8')

  assert.match(layout, /@senthur\/sa-ui\/styles\.css/)
  assert.match(layout, /@senthur\/sa-ui\/fonts\.css/)
  assert.match(layout, /sa-root/)
  assert.doesNotMatch(globals, /@font-face/)
  assert.doesNotMatch(globals, /--sa-black:\s*#15130d/)
  assert.doesNotMatch(globals, /--sketch-rule-h:/)
})

test('package enhancer has a TypeScript source entry', async () => {
  const enhancer = await readFile(new URL('../packages/sa-ui/enhance.ts', import.meta.url), 'utf8')

  assert.match(enhancer, /export\s*\{\s*enhance\s*\}/)
})

test('portfolio does not retain the temporary public font', async () => {
  await assert.rejects(
    stat(new URL('../public/fonts/senthur-handwriting.woff', import.meta.url)),
    { code: 'ENOENT' },
  )
})

test('deploy verifies the package distribution before publication', async () => {
  const workflow = await readFile(new URL('../.github/workflows/nextjs.yml', import.meta.url), 'utf8')
  const buildStep = workflow.split('- name: Build with Next.js', 2)[1].split('- name: Upload artifact', 1)[0]

  assert.match(buildStep, /npm run test:ui/)
  assert.match(buildStep, /npm run build/)
  assert.match(buildStep, /git diff --exit-code -- packages\/sa-ui\/dist/)
  assert.doesNotMatch(buildStep, /npx --no-install next build/)
})

test('portfolio rescans sketch links after each client route change', async () => {
  const sketches = await readFile(new URL('../components/LinkSketches.tsx', import.meta.url), 'utf8')

  assert.match(sketches, /import \{ usePathname \} from 'next\/navigation'/)
  assert.match(sketches, /const pathname = usePathname\(\)/)
  assert.match(sketches, /useEffect\(\(\) => enhance\(document\), \[pathname\]\)/)
})
