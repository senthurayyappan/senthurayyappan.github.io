/**
 * Regenerates lib/stats/language-icons.ts from simple-icons.
 *
 *   npm i -D simple-icons && node scripts/gen-language-icons.mjs && npm rm simple-icons
 *
 * Paths are copied VERBATIM. Do not add a coordinate-rounding pass: it reads like free
 * savings and it silently corrupts arcs. simple-icons minifies elliptical arcs with
 * compacted flags -- `A1.73 1.73 0 01 0 17.66`, where `01` is the large-arc and sweep
 * flags jammed together -- so any regex treating a digit run as one number collapses
 * those two flags into `1` and shifts every argument after it. The damage is invisible
 * in a diff and total on screen: Markdown and JSON rendered as nothing at all. That
 * pass bought 2.4 kB gzipped and broke every icon containing a curve.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const SRC = 'node_modules/simple-icons/icons'

/** wakapi language name (lowercased) -> simple-icons slug */
const MAP = {
  python: 'python', bash: 'gnubash', c: 'c', 'c++': 'cplusplus', cmake: 'cmake',
  css: 'css', html: 'html5', javascript: 'javascript', json: 'json',
  markdown: 'markdown', rust: 'rust', tex: 'latex', toml: 'toml', tsx: 'react',
  typescript: 'typescript', xml: 'xml', yaml: 'yaml',
}

const rows = []
for (const [lang, slug] of Object.entries(MAP)) {
  const file = `${SRC}/${slug}.svg`
  if (!existsSync(file)) { console.warn(`missing ${slug}`); continue }
  const svg = readFileSync(file, 'utf8')
  const paths = [...svg.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1])
  if (paths.length !== 1) { console.warn(`${slug}: ${paths.length} paths, skipped`); continue }
  rows.push([lang, slug, paths[0]])
}
rows.sort((a, b) => a[0].localeCompare(b[0]))

writeFileSync('lib/stats/language-icons.ts', `/**
 * Language glyphs, inlined.
 *
 * Official marks from simple-icons (CC0), extracted once at authoring time so the
 * 3,400-file package is not a dependency of this site. Regenerate with
 * scripts/gen-language-icons.mjs -- do not hand-edit.
 *
 * They render in \`currentColor\`, deliberately. Brand colours here would put a dozen
 * competing hues beside a chart whose entire colour system is two hues carrying
 * meaning. The glyph is wayfinding, not an encoding, so it wears text ink like the
 * label next to it.
 */

/** Lowercased wakapi language name -> one SVG path on a 0 0 24 24 viewBox. */
const LANGUAGE_ICONS: Record<string, string> = {
${rows.map(([l, s, p]) => `  ${JSON.stringify(l)}: '${p}', // ${s}`).join('\n')}
}

export function languageIcon(name: string): string | undefined {
  return LANGUAGE_ICONS[name.trim().toLowerCase()]
}
`)
console.log(`wrote ${rows.length} icons`)
