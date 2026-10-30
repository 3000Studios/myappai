// Emits static, crawlable documents for /privacy, /about, /contact from the
// React page components (run as part of `postbuild`, after `vite build`).
//
// Why: this app is a pure SPA, so those routes served the bare shell in raw
// HTML — no distinct privacy/about/contact content for crawlers or AdSense
// review (soft-404 class defect, fleet sweep 2026-10-30). The components hold
// real prose copy; this script converts that copy to static HTML inside the
// app shell at dist/<route>/index.html. React still boots and replaces
// #root on mount for JS visitors; no-JS visitors and crawlers get the real
// document. Mirrors the prerender pattern used by the cajun/pondco fixes.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(repoRoot, 'dist')
const shell = fs.readFileSync(path.join(distRoot, 'index.html'), 'utf8')

const DOMAIN = 'myappai.net'
const EMAIL = 'operator@myappai.net'
const BRAND = 'MyAppAI'

const PAGES = [
  { route: 'privacy', file: 'PrivacyPage.jsx', title: `Privacy Policy | ${BRAND}`, desc: `How ${BRAND} (${DOMAIN}) handles your data: what we collect, advertising cookies and Google AdSense, and your rights.` },
  { route: 'about', file: 'AboutPage.jsx', title: `About | ${BRAND}`, desc: `What ${BRAND} is: a public resource of practical guides, honest tool comparisons, and tutorials for using AI applications effectively.` },
  { route: 'contact', file: 'ContactPage.jsx', title: `Contact | ${BRAND}`, desc: `Contact ${BRAND}: questions, corrections, topic requests, and feedback.` },
]

function jsxToHtml(src, isContact) {
  const m = src.match(/<article[\s\S]*<\/article>/)
  if (!m) throw new Error('no <article> found')
  let html = m[0]
  // Drop embedded components (e.g. HeroVideo) — self-closing or paired.
  html = html.replace(/<HeroVideo[\s\S]*?\/>/g, '')
  html = html.replace(/<HeroVideo[\s\S]*?<\/HeroVideo>/g, '')
  // Contact: the {submitted ? success : form} ternary is interactive-only.
  // Remove the whole balanced block; a mailto CTA is appended below.
  if (isContact) {
    const start = html.indexOf('{submitted')
    if (start !== -1) {
      let depth = 0, end = -1
      for (let i = start; i < html.length; i++) {
        if (html[i] === '{') depth++
        else if (html[i] === '}') { depth--; if (depth === 0) { end = i; break } }
      }
      if (end !== -1) html = html.slice(0, start) + html.slice(end + 1)
    }
    html = html.replace(/<\/section>/, `<p>Email us directly at <a href="mailto:${EMAIL}">${EMAIL}</a> — the contact form on this page opens your email client addressed to us.</p></section>`)
  }
  html = html.replace(/<Link\s+to="([^"]+)">/g, '<a href="$1">')
  html = html.replace(/<\/Link>/g, '</a>')
  html = html.replace(/href=\{`mailto:\$\{(?:SUPPORT_EMAIL|CONTACT_EMAIL)\}`\}/g, `href="mailto:${EMAIL}"`)
  html = html.replace(/\{(?:SUPPORT_EMAIL|CONTACT_EMAIL)\}/g, EMAIL)
  html = html.replace(/\{SITE_DISPLAY_NAME\}/g, BRAND)
  html = html.replace(/className=/g, 'class=')
  html = html.replace(/htmlFor=/g, 'for=')
  // Remove any remaining simple JSX expressions.
  let prev
  do { prev = html; html = html.replace(/\{[^{}]*\}/g, '') } while (html !== prev)
  return html.trim()
}

for (const page of PAGES) {
  const srcPath = path.join(repoRoot, 'frontend', 'pages', page.file)
  const article = jsxToHtml(fs.readFileSync(srcPath, 'utf8'), page.route === 'contact')
  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${page.title}</title>`)
    .replace(/<meta[^>]*name="description"[^>]*>/i, `<meta name="description" content="${page.desc}" />`)
    .replace(/(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/i, `$1https://${DOMAIN}/${page.route}$2`)
    .replace(/(<meta[^>]*property="og:url"[^>]*content=")[^"]*(")/i, `$1https://${DOMAIN}/${page.route}$2`)
    .replace(/(<meta[^>]*property="og:title"[^>]*content=")[^"]*(")/i, `$1${page.title}$2`)
    .replace(/(<meta[^>]*name="twitter:title"[^>]*content=")[^"]*(")/i, `$1${page.title}$2`)
  if (!/<div id="root"><\/div>/.test(html)) throw new Error(`no empty #root in shell for ${page.route}`)
  html = html.replace(/<div id="root"><\/div>/, `<div id="root">${article}</div>`)
  const outDir = path.join(distRoot, page.route)
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), html)
  console.log(`generate-static-pages: wrote dist/${page.route}/index.html (${html.length} B)`)
}
