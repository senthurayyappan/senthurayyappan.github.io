import assert from 'node:assert/strict'
import http from 'node:http'
import { createRequire } from 'node:module'
import test from 'node:test'
import { build } from 'esbuild'

const require = createRequire(import.meta.url)

async function loadLikeStorage() {
  const result = await build({
    entryPoints: [new URL('../components/likeStorage.ts', import.meta.url).pathname],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    write: false,
  })
  const componentModule = { exports: {} }
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, componentModule, componentModule.exports)
  return componentModule.exports
}

test('the article client records a view with its automatic visitor ID', async (context) => {
  let requestData = null
  const server = http.createServer(async (request, response) => {
    let body = ''
    for await (const chunk of request) body += chunk
    requestData = { method: request.method, url: request.url, body: JSON.parse(body) }
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ likes: 4, liked: false, views: 12 }))
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  context.after(() => new Promise((resolve) => server.close(resolve)))
  const { port } = server.address()
  const visitor = '00000000-0000-4000-8000-000000000000'
  const values = new Map()
  const priorWindow = globalThis.window
  const priorCrypto = Object.getOwnPropertyDescriptor(globalThis, 'crypto')
  globalThis.window = {
    localStorage: {
      getItem: (key) => values.get(key) || null,
      setItem: (key, value) => values.set(key, value),
    },
  }
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { randomUUID: () => visitor } })
  context.after(() => {
    globalThis.window = priorWindow
    if (priorCrypto) Object.defineProperty(globalThis, 'crypto', priorCrypto)
  })
  const likeStorage = await loadLikeStorage()

  assert.equal(typeof likeStorage.recordPostView, 'function')
  const result = await likeStorage.recordPostView(`http://127.0.0.1:${port}`, 'ballbot-always-wins')

  assert.deepEqual(result, { likes: 4, liked: false, views: 12 })
  assert.deepEqual(requestData, {
    method: 'POST',
    url: '/v1/posts/ballbot-always-wins/views',
    body: { visitor },
  })
})
