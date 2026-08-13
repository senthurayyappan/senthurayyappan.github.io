import { rm } from 'node:fs/promises'
import { build } from 'esbuild'

await rm(new URL('dist', import.meta.url), { recursive: true, force: true })

const cssBuild = {
  bundle: true,
  loader: { '.woff': 'file' },
  assetNames: 'fonts/[name]',
  logLevel: 'info',
}

await Promise.all([
  build({ ...cssBuild, entryPoints: ['src/index.css'], outfile: 'dist/sa-ui.css' }),
  build({ ...cssBuild, entryPoints: ['src/fonts.css'], outfile: 'dist/sa-ui-fonts.css' }),
])
