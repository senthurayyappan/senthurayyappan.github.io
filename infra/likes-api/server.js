const crypto = require('node:crypto')
const http = require('node:http')
const postgres = require('postgres')

const port = Number(process.env.PORT || 8787)
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://senthurayyappan.com'
const visitorSalt = process.env.VISITOR_SALT
if (!visitorSalt) throw new Error('VISITOR_SALT must be set')

const sql = postgres(process.env.DATABASE_URL, { max: 5 })
const recentRequests = new Map()

function send(response, status, data, origin) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': origin === allowedOrigin ? allowedOrigin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(data))
}

function viewerHash(viewer) {
  return crypto.createHash('sha256').update(`${visitorSalt}:${viewer}`).digest('hex')
}

function rateLimited(request) {
  const forwarded = request.headers['x-forwarded-for']
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || request.socket.remoteAddress || '').split(',')[0].trim()
  const now = Date.now()
  const attempts = (recentRequests.get(ip) || []).filter((time) => now - time < 60_000)
  attempts.push(now)
  recentRequests.set(ip, attempts)
  return attempts.length > 20
}

async function readBody(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > 1024) throw new Error('Request too large')
  }
  return JSON.parse(body || '{}')
}

async function responseFor(slug, viewer) {
  const hash = viewerHash(viewer)
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM post_likes WHERE slug = ${slug}`
  const liked = await sql`SELECT 1 FROM post_likes WHERE slug = ${slug} AND viewer_hash = ${hash} LIMIT 1`
  return { likes: count, liked: liked.length > 0 }
}

async function setup() {
  await sql`CREATE TABLE IF NOT EXISTS post_likes (
    slug text NOT NULL CHECK (slug ~ '^[a-z0-9-]{1,120}$'),
    viewer_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (slug, viewer_hash)
  )`
}

const server = http.createServer(async (request, response) => {
  const origin = request.headers.origin || ''
  if (origin && origin !== allowedOrigin) return send(response, 403, { error: 'Origin not allowed' }, origin)
  if (request.method === 'OPTIONS') return send(response, 204, {}, origin)
  if (rateLimited(request)) return send(response, 429, { error: 'Try again shortly' }, origin)

  const match = new URL(request.url, `http://${request.headers.host}`).pathname.match(/^\/v1\/posts\/([a-z0-9-]{1,120})\/likes$/)
  if (!match) return send(response, 404, { error: 'Not found' }, origin)
  const slug = match[1]

  try {
    if (request.method === 'GET') {
      const viewer = new URL(request.url, `http://${request.headers.host}`).searchParams.get('viewer')
      if (!viewer || viewer.length > 128) return send(response, 400, { error: 'Invalid viewer' }, origin)
      return send(response, 200, await responseFor(slug, viewer), origin)
    }

    if (request.method === 'POST' || request.method === 'DELETE') {
      const { visitor } = await readBody(request)
      if (typeof visitor !== 'string' || !/^[a-f0-9-]{20,128}$/i.test(visitor)) {
        return send(response, 400, { error: 'Invalid visitor' }, origin)
      }
      const hash = viewerHash(visitor)
      if (request.method === 'POST') {
        await sql`INSERT INTO post_likes (slug, viewer_hash) VALUES (${slug}, ${hash}) ON CONFLICT DO NOTHING`
      } else {
        await sql`DELETE FROM post_likes WHERE slug = ${slug} AND viewer_hash = ${hash}`
      }
      return send(response, 200, await responseFor(slug, visitor), origin)
    }
    return send(response, 405, { error: 'Method not allowed' }, origin)
  } catch (error) {
    console.error(error)
    return send(response, 500, { error: 'Internal error' }, origin)
  }
})

setup()
  .then(() => server.listen(port, () => console.log(`Likes API listening on ${port}`)))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
