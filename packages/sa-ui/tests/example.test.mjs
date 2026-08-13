import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

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

test('example server rejects a symbolic link outside its root', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'sa-ui-server-'))
  const target = join(directory, 'outside.txt')
  const link = new URL('../examples/.sa-ui-test-link', import.meta.url)
  await writeFile(target, 'private')
  await symlink(target, link)
  const server = spawn(process.execPath, [fileURLToPath(new URL('../examples/serve.mjs', import.meta.url))], {
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('example server did not start')), 5000)
      server.stdout.once('data', () => {
        clearTimeout(timer)
        resolve()
      })
      server.once('error', reject)
      server.once('exit', (code) => reject(new Error(`example server exited with ${code}`)))
    })
    const response = await fetch('http://127.0.0.1:4173/examples/.sa-ui-test-link')
    assert.equal(response.status, 403)
  } finally {
    server.kill()
    await rm(link, { force: true })
    await rm(directory, { recursive: true, force: true })
  }
})
