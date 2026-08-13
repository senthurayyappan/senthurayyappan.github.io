const assert = require('node:assert/strict')
const http = require('node:http')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const test = require('node:test')

const serverPath = path.join(__dirname, 'server.js')

test('the API module can load without service environment variables', () => {
  const result = spawnSync(process.execPath, ['-e', `const api = require(${JSON.stringify(serverPath)}); if (typeof api.createApp !== 'function') process.exit(2)`], {
    env: { PATH: process.env.PATH },
    encoding: 'utf8',
  })

  assert.equal(result.status, 0, result.stderr)
})

test('a post view counts one browser once', async (context) => {
  const { createApp } = require('./server')
  const views = new Map()
  const store = {
    async getPost(slug) {
      return { likes: 0, liked: false, views: views.get(slug)?.size || 0 }
    },
    async recordView(slug, visitor) {
      const visitors = views.get(slug) || new Set()
      visitors.add(visitor)
      views.set(slug, visitors)
    },
    async setLike() {},
  }
  const server = http.createServer(createApp({ store, allowedOrigin: 'https://senthurayyappan.com' }))
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  context.after(() => new Promise((resolve) => server.close(resolve)))
  const { port } = server.address()
  const url = `http://127.0.0.1:${port}/v1/posts/ballbot-always-wins/views`
  const request = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitor: '00000000-0000-4000-8000-000000000000' }),
  }

  const first = await fetch(url, request)
  const second = await fetch(url, request)

  assert.equal(first.status, 200)
  assert.deepEqual(await first.json(), { likes: 0, liked: false, views: 1 })
  assert.equal(second.status, 200)
  assert.deepEqual(await second.json(), { likes: 0, liked: false, views: 1 })
})
