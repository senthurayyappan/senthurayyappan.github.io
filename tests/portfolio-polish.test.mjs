import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import test from 'node:test'
import { build } from 'esbuild'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)

const nextStubs = {
  'next/link': `import React from 'react'; export default function Link({ children, legacyBehavior, ...props }) { return <a {...props}>{children}</a> }`,
  'next/image': `import React from 'react'; export default function Image({ fill, priority, unoptimized, ...props }) { return <img {...props} /> }`,
  'next/navigation': `export function usePathname() { return '/' }`,
  'next-themes': `export function useTheme() { return { theme: 'light', resolvedTheme: 'light', setTheme() {} } }`,
}

async function renderComponent(entryPoint, exportName = 'default', props = {}) {
  const result = await build({
    entryPoints: [new URL(entryPoint, import.meta.url).pathname],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    write: false,
    external: ['react', 'react/jsx-runtime'],
    plugins: [{
      name: 'next-stubs',
      setup(plugin) {
        plugin.onResolve({ filter: /^next\/(link|image|navigation)$/ }, (args) => ({ path: args.path, namespace: 'next-stub' }))
        plugin.onResolve({ filter: /^next-themes$/ }, (args) => ({ path: args.path, namespace: 'next-stub' }))
        plugin.onLoad({ filter: /.*/, namespace: 'next-stub' }, (args) => ({ contents: nextStubs[args.path], loader: 'tsx' }))
      },
    }],
  })
  const componentModule = { exports: {} }
  new Function('require', 'module', 'exports', 'React', result.outputFiles[0].text)(require, componentModule, componentModule.exports, React)
  return renderToStaticMarkup(React.createElement(componentModule.exports[exportName], props))
}

test('compiled about page groups the experience panels in the requested order', async () => {
  const markup = await renderComponent('../app/about/page.tsx')

  assert.match(
    markup,
    /about-experience[^>]*>.*Research Intern @ DRDO \| DEBEL.*Research Intern @ IIT Madras.*Consultant @ Robotics and AI Institute.*Team Lead @ Spider Tronix, NITT/s,
  )
  assert.match(markup, /about-experience[^\"]*gap-4[^\"]*md:gap-\[22px\]/)
  assert.match(markup, /md:col-span-2 md:row-span-2[^>]*>.*Consultant @ Robotics and AI Institute/s)
  assert.match(markup, /md:col-span-3[^>]*>.*Team Lead @ Spider Tronix, NITT/s)
})

test('compiled navigation uses the shared SAButton control for both drawer actions', async () => {
  const markup = await renderComponent('../components/nav.tsx', 'Navbar')

  assert.match(markup, /sa-control[^>]*>.*aria-label="Open navigation"/s)
  assert.match(markup, /sa-control[^>]*>.*aria-label="Close navigation"/s)
})

test('portfolio polish CSS keeps the required visual contracts', async () => {
  const globals = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8')

  assert.match(globals, /\.panel \.text\s*\{[^}]*background-color:\s*var\(--sa-white\)[^}]*color:\s*var\(--sa-black\)/s)
  assert.match(globals, /\.panel \.text::after\s*\{\s*color:\s*var\(--sa-black\)/)
  assert.doesNotMatch(globals, /\.dark \.panel \.text\s*\{/)
  assert.match(globals, /\.sidenav::after\s*\{[^}]*bottom:\s*-56px/s)
  assert.doesNotMatch(globals, /\.comic-menu-button\s*\{[^}]*box-shadow/s)
  assert.match(globals, /\.article-engagement\s*\{[^}]*width:\s*100%/s)
  assert.match(globals, /\.blog-panel-details\s*\{[^}]*justify-content:\s*space-between/s)
  assert.match(globals, /\.blog-panel-image-tags\s*\{[^}]*position:\s*absolute[^}]*bottom:\s*100%/s)
  assert.match(globals, /@media \(max-width: 767px\)[\s\S]*?\.blog-panel-dateline\s*\{\s*white-space:\s*normal/)
  assert.match(
    globals,
    /\.footer-handwriting,\s*\.site-footer \.sa-link\s*\{[^}]*font-family:\s*var\(--font-display\)[^}]*font-synthesis:\s*none[^}]*font-variant-ligatures:\s*common-ligatures contextual[^}]*letter-spacing:\s*\.08em[^}]*word-spacing:\s*\.16em/s,
  )
})

test('blog cards overlay tags above a one-row metadata footer', async () => {
  const markup = await renderComponent('../components/BlogExplorer.tsx', 'BlogExplorer', {
    posts: [{
      slug: 'ballbot-always-wins',
      formattedDate: 'April 26, 2025',
      metadata: {
        title: 'The Ballbot Always Wins',
        publishedAt: '2025-04-26',
        summary: 'Origin story',
        image: '/projects/ballbot.jpg',
        readingTime: 1,
        tags: ['robotics', 'build log'],
      },
    }],
  })

  assert.match(markup, /blog-panel-image-tags.*blog-panel-dateline.*blog-engagement-counts/s)
  assert.doesNotMatch(markup, /blog-panel-details[^>]*>.*blog-panel-image-tags/s)
  assert.match(markup, /aria-label="0 views"/)
  assert.match(markup, /aria-label="0 likes"/)
})

test('article engagement follows the prose and table-of-contents layout', async () => {
  const article = await readFile(new URL('../app/blog/[slug]/page.tsx', import.meta.url), 'utf8')

  assert.match(
    article,
    /<div className="article-layout">[\s\S]*?<\/aside>[\s\S]*?<\/div>\s*<div className="article-engagement">/,
  )
})

test('the article engagement control includes its post view count', async () => {
  const priorApiUrl = process.env.NEXT_PUBLIC_LIKES_API_URL
  process.env.NEXT_PUBLIC_LIKES_API_URL = 'https://api.example.com'
  const markup = await renderComponent(
    '../components/ArticleLikeButton.tsx',
    'ArticleLikeButton',
    { slug: 'ballbot-always-wins' },
  )
  if (priorApiUrl === undefined) delete process.env.NEXT_PUBLIC_LIKES_API_URL
  else process.env.NEXT_PUBLIC_LIKES_API_URL = priorApiUrl

  assert.match(markup, /aria-label="0 views"/)
  assert.match(markup, /aria-label="Like this post"/)
})

test('the view icon matches the heart size and has a filled pupil', async () => {
  const globals = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8')
  const markup = await renderComponent('../components/EyeIcon.tsx', 'EyeIcon', {
    className: 'engagement-eye-icon',
  })

  assert.match(globals, /\.engagement-eye-icon\s*\{[^}]*width:\s*1\.35rem[^}]*height:\s*1\.35rem/s)
  assert.match(markup, /<circle[^>]*fill="currentColor"/)
})
