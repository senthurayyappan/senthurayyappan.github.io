const crypto = require('node:crypto')
const http = require('node:http')

function send(response, status, data, origin, allowedOrigin) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': origin === allowedOrigin ? allowedOrigin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(data))
}

function createRateLimiter() {
  const recentRequests = new Map()
  return (request) => {
    const forwarded = request.headers['x-forwarded-for']
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || request.socket.remoteAddress || '').split(',')[0].trim()
    const now = Date.now()
    const attempts = (recentRequests.get(ip) || []).filter((time) => now - time < 60_000)
    attempts.push(now)
    recentRequests.set(ip, attempts)
    return attempts.length > 20
  }
}

async function readBody(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > 1024) throw new Error('Request too large')
  }
  return JSON.parse(body || '{}')
}

function validVisitor(visitor) {
  return typeof visitor === 'string' && /^[a-f0-9-]{20,128}$/i.test(visitor)
}

function createApp({ store, allowedOrigin }) {
  const rateLimited = createRateLimiter()

  return async (request, response) => {
    const origin = request.headers.origin || ''
    if (origin && origin !== allowedOrigin) return send(response, 403, { error: 'Origin not allowed' }, origin, allowedOrigin)
    if (request.method === 'OPTIONS') return send(response, 204, {}, origin, allowedOrigin)
    if (rateLimited(request)) return send(response, 429, { error: 'Try again shortly' }, origin, allowedOrigin)

    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname
    const match = pathname.match(/^\/v1\/posts\/([a-z0-9-]{1,120})\/(likes|views)$/)
    if (!match) return send(response, 404, { error: 'Not found' }, origin, allowedOrigin)
    const [, slug, resource] = match

    try {
      if (resource === 'likes' && request.method === 'GET') {
        const viewer = new URL(request.url, `http://${request.headers.host}`).searchParams.get('viewer')
        if (!viewer || viewer.length > 128) return send(response, 400, { error: 'Invalid viewer' }, origin, allowedOrigin)
        return send(response, 200, await store.getPost(slug, viewer), origin, allowedOrigin)
      }

      if (resource === 'views' && request.method === 'POST') {
        const { visitor } = await readBody(request)
        if (!validVisitor(visitor)) return send(response, 400, { error: 'Invalid visitor' }, origin, allowedOrigin)
        await store.recordView(slug, visitor)
        return send(response, 200, await store.getPost(slug, visitor), origin, allowedOrigin)
      }

      if (resource === 'likes' && (request.method === 'POST' || request.method === 'DELETE')) {
        const { visitor } = await readBody(request)
        if (!validVisitor(visitor)) return send(response, 400, { error: 'Invalid visitor' }, origin, allowedOrigin)
        await store.setLike(slug, visitor, request.method === 'POST')
        return send(response, 200, await store.getPost(slug, visitor), origin, allowedOrigin)
      }

      return send(response, 405, { error: 'Method not allowed' }, origin, allowedOrigin)
    } catch (error) {
      console.error(error)
      return send(response, 500, { error: 'Internal error' }, origin, allowedOrigin)
    }
  }
}

function createPostgresStore(sql, visitorSalt) {
  const viewerHash = (viewer) => crypto.createHash('sha256').update(`${visitorSalt}:${viewer}`).digest('hex')

  return {
    async setup() {
      await sql`CREATE TABLE IF NOT EXISTS post_likes (
        slug text NOT NULL CHECK (slug ~ '^[a-z0-9-]{1,120}$'),
        viewer_hash text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (slug, viewer_hash)
      )`
      await sql`CREATE TABLE IF NOT EXISTS post_views (
        slug text NOT NULL CHECK (slug ~ '^[a-z0-9-]{1,120}$'),
        viewer_hash text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (slug, viewer_hash)
      )`
    },

    async getPost(slug, viewer) {
      const hash = viewerHash(viewer)
      const [likeRows, likedRows, viewRows] = await Promise.all([
        sql`SELECT count(*)::int AS count FROM post_likes WHERE slug = ${slug}`,
        sql`SELECT 1 FROM post_likes WHERE slug = ${slug} AND viewer_hash = ${hash} LIMIT 1`,
        sql`SELECT count(*)::int AS count FROM post_views WHERE slug = ${slug}`,
      ])
      return { likes: likeRows[0].count, liked: likedRows.length > 0, views: viewRows[0].count }
    },

    async recordView(slug, viewer) {
      const hash = viewerHash(viewer)
      await sql`INSERT INTO post_views (slug, viewer_hash) VALUES (${slug}, ${hash}) ON CONFLICT DO NOTHING`
    },

    async setLike(slug, viewer, liked) {
      const hash = viewerHash(viewer)
      if (liked) {
        await sql`INSERT INTO post_likes (slug, viewer_hash) VALUES (${slug}, ${hash}) ON CONFLICT DO NOTHING`
      } else {
        await sql`DELETE FROM post_likes WHERE slug = ${slug} AND viewer_hash = ${hash}`
      }
    },
  }
}

async function start() {
  const postgres = require('postgres')
  const port = Number(process.env.PORT || 8787)
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://senthurayyappan.com'
  const visitorSalt = process.env.VISITOR_SALT
  if (!visitorSalt) throw new Error('VISITOR_SALT must be set')

  const sql = postgres(process.env.DATABASE_URL, { max: 5 })
  const store = createPostgresStore(sql, visitorSalt)
  await store.setup()
  http.createServer(createApp({ store, allowedOrigin })).listen(port, () => {
    console.log(`Blog engagement API listening on ${port}`)
  })
}

if (require.main === module) {
  start().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

module.exports = { createApp, createPostgresStore }
