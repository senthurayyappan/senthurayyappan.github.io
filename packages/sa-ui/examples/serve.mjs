import { createReadStream } from 'node:fs'
import { realpath, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = await realpath(resolve(fileURLToPath(new URL('../', import.meta.url))))
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.woff': 'font/woff' }

createServer(async (request, response) => {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
  } catch {
    response.writeHead(400).end('Bad request')
    return
  }
  const file = resolve(root, `.${pathname}`)
  if (file !== root && !file.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end('Forbidden')
    return
  }
  try {
    const target = await realpath(file)
    if (target !== root && !target.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end('Forbidden')
      return
    }
    const info = await stat(target)
    if (!info.isFile()) throw new Error('Not a file')
    response.writeHead(200, { 'content-type': types[extname(target)] ?? 'application/octet-stream' })
    createReadStream(target).pipe(response)
  } catch {
    response.writeHead(404).end('Not found')
  }
}).listen(4173, '127.0.0.1', () => console.log('http://localhost:4173/examples/slides.html'))
