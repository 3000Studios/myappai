// Emits dist/404.html from the built SPA shell (run as `postbuild`, after
// `vite build`).
//
// Why: while no 404.html exists, Cloudflare Pages' asset server answers
// every unmatched path with /index.html and HTTP 200 (a soft-404 — an
// infinite set of duplicate "homepage" 200s for crawlers and AdSense
// review), and a _redirects catch-all cannot fix it: Pages' validator
// ignores splat -> /index.html rules as infinite loops (`wrangler pages
// dev` parses the old frontend/public/_redirects as 0 valid + 1 invalid).
// With this file present, the asset server (reached via _worker.js ->
// env.ASSETS.fetch) serves it with a genuine 404 status for unmatched
// paths. It is the app shell (so the React app still boots and renders
// its own NotFoundPage) carrying crawlable not-found content inside
// #root for no-JS visitors — React replaces #root's children on mount.
//
// The genuine app routes keep their 200 + shell via explicit rewrites
// in frontend/public/_redirects; this file only ever answers for paths
// that match no real route.
//
// Same fix pattern as findmerates.com (commit 9ded7f4) and
// thecajunmenu.site (commit 129cc1d), fleet soft-404 sweep 2026-10-27.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(repoRoot, 'dist')
const shellPath = path.join(distRoot, 'index.html')

const shell = fs.readFileSync(shellPath, 'utf8')

const NOT_FOUND_TITLE = 'Page Not Found | MyAppAI'
const NOT_FOUND_DESCRIPTION =
  'That page could not be found. Browse the MyAppAI AI tools directory, guides, and blog.'

let html = shell
  .replace(/<title>[\s\S]*?<\/title>/i, `<title>${NOT_FOUND_TITLE}</title>`)
  .replace(
    /<meta[^>]*name="description"[^>]*>/i,
    `<meta name="description" content="${NOT_FOUND_DESCRIPTION}" />`,
  )
  // A 404 page must not pose as a real page: drop the canonical and
  // og:url, retitle the social cards, and mark the page noindex.
  .replace(/\s*<link[^>]*rel="canonical"[^>]*>/i, '')
  .replace(/\s*<meta[^>]*property="og:url"[^>]*>/i, '')
  .replace(
    /(<meta[^>]*property="og:title"[^>]*content=")[^"]*(")/i,
    `$1${NOT_FOUND_TITLE}$2`,
  )
  .replace(
    /(<meta[^>]*name="twitter:title"[^>]*content=")[^"]*(")/i,
    `$1${NOT_FOUND_TITLE}$2`,
  )
  .replace(
    /(<meta[^>]*property="og:description"[^>]*content=")[^"]*(")/i,
    `$1${NOT_FOUND_DESCRIPTION}$2`,
  )
  .replace(
    /(<meta[^>]*name="twitter:description"[^>]*content=")[^"]*(")/i,
    `$1${NOT_FOUND_DESCRIPTION}$2`,
  )
  // The shell carries no robots meta — add the noindex marker.
  .replace(/<\/head>/i, '    <meta name="robots" content="noindex, follow" />\n  </head>')

// Crawlable not-found content, inside #root so React replaces it on mount.
const inner = `<main>
      <h1>Page not found</h1>
      <p>The page you were looking for doesn't exist or has moved. Try one of these instead:</p>
      <p><a href="/">Home</a> · <a href="/tools">Tools</a> · <a href="/blog">Blog</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></p>
    </main>`
if (!/<div id="root"><\/div>/.test(html)) {
  throw new Error('generate-404: could not find the empty #root div in dist/index.html')
}
html = html.replace(/<div id="root"><\/div>/, `<div id="root">${inner}</div>`)

fs.writeFileSync(path.join(distRoot, '404.html'), html)
console.log('generate-404: wrote dist/404.html')
