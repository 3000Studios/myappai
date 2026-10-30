// Emits static, crawlable documents for the public content routes that the
// SPA still served as a bare shell: / (home), /tools, /blog and /blog/<slug>
// (run as part of `postbuild`, after `vite build` and the other generators).
//
// Why: an AdSense reviewer and Googlebot read raw HTML. Those routes served
// an empty <div id="root"></div> — no readable content at all (fleet AdSense
// sweep 2026-11-07; /privacy, /about, /contact were fixed the same way by
// scripts/generate-static-pages.mjs on 2026-10-30).
//
// Every word emitted here is extracted at build time from the site's own
// sources — frontend/pages/HomePage.jsx (apps data + hero/CTA copy),
// frontend/pages/ToolsPage.jsx (TOOLS data + heading/lead/disclosure),
// frontend/pages/BlogIndexPage.jsx (index heading/intro) and
// content/blog/*.json (the articles themselves). Nothing is invented; if an
// extraction fails this script throws and the build fails loudly instead of
// shipping a partial page. React still boots and replaces #root on mount for
// JS visitors; no-JS visitors and crawlers get the real document.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(repoRoot, 'dist')
const shell = fs.readFileSync(path.join(distRoot, 'index.html'), 'utf8')

const DOMAIN = 'myappai.net'
const BRAND = 'MyAppAI'

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
function escAttr(value) {
  return esc(value).replace(/"/g, '&quot;')
}
function must(re, src, label) {
  const m = src.match(re)
  if (!m) throw new Error(`generate-content-pages: could not extract ${label}`)
  return m
}
// Extract a top-level `const NAME = [ ... ]` data literal (plain data only)
// from a component file and evaluate it — the component stays the single
// source of truth for its own catalog data.
function extractArray(src, name, label) {
  const start = src.indexOf(`const ${name} = [`)
  if (start === -1) throw new Error(`generate-content-pages: ${label} not found`)
  const end = src.indexOf('\n]', start)
  if (end === -1) throw new Error(`generate-content-pages: ${label} not terminated`)
  const literal = src.slice(src.indexOf('[', start), end + 2)
  return new Function(`return (${literal})`)()
}

function renderPage({ route, title, desc, bodyHtml }) {
  let html = shell
  if (title) {
    html = html
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`)
      .replace(
        /(<meta[^>]*property="og:title"[^>]*content=")[^"]*(")/i,
        `$1${escAttr(title)}$2`
      )
      .replace(
        /(<meta[^>]*name="twitter:title"[^>]*content=")[^"]*(")/i,
        `$1${escAttr(title)}$2`
      )
  }
  if (desc) {
    html = html
      .replace(
        /<meta[^>]*name="description"[^>]*>/i,
        `<meta name="description" content="${escAttr(desc)}" />`
      )
      .replace(
        /(<meta[^>]*property="og:description"[^>]*content=")[^"]*(")/i,
        `$1${escAttr(desc)}$2`
      )
      .replace(
        /(<meta[^>]*name="twitter:description"[^>]*content=")[^"]*(")/i,
        `$1${escAttr(desc)}$2`
      )
  }
  if (route) {
    html = html
      .replace(
        /(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/i,
        `$1https://${DOMAIN}/${route}$2`
      )
      .replace(
        /(<meta[^>]*property="og:url"[^>]*content=")[^"]*(")/i,
        `$1https://${DOMAIN}/${route}$2`
      )
  }
  if (!/<div id="root"><\/div>/.test(html)) {
    throw new Error(`generate-content-pages: no empty #root in shell for /${route}`)
  }
  html = html.replace(/<div id="root"><\/div>/, `<div id="root">${bodyHtml}</div>`)
  return html
}

function writePage(route, html) {
  const outDir = route ? path.join(distRoot, route) : distRoot
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), html)
  console.log(`generate-content-pages: wrote dist/${route ? `${route}/` : ''}index.html (${html.length} B)`)
}

// ---------------------------------------------------------------- blog data
const blogIndex = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'content', 'blog', 'index.json'), 'utf8')
)
const indexPosts = Array.isArray(blogIndex) ? blogIndex : blogIndex.posts || []
const posts = indexPosts.map((entry) => {
  const file = path.join(repoRoot, 'content', 'blog', `${entry.slug}.json`)
  return JSON.parse(fs.readFileSync(file, 'utf8'))
})
if (!posts.length) throw new Error('generate-content-pages: no blog posts found')

// --------------------------------------------------------------------- home
{
  const src = fs.readFileSync(
    path.join(repoRoot, 'frontend', 'pages', 'HomePage.jsx'),
    'utf8'
  )
  const apps = extractArray(src, 'apps', 'home apps data')
  const statusBlock = must(
    /const statusConfig = \{([\s\S]*?)\n\}/,
    src,
    'home statusConfig'
  )[1]
  const statusLabels = {}
  for (const m of statusBlock.matchAll(/'?([\w-]+)'?:\s*\{\s*label:\s*'([^']+)'/g)) {
    statusLabels[m[1]] = m[2]
  }
  const accent = must(
    /storefront-headline--accent">([^<]+)</,
    src,
    'home hero accent'
  )[1]
  const subhead = must(/storefront-subhead">\s*([^<]+?)\s*</, src, 'home subhead')[1]
  const ctaHeading = must(
    /<h2>([^<]+)<\/h2>\s*<p>([^<]+)<\/p>\s*<Link to="\/contact"[^>]*>([^<]+)<\/Link>/,
    src,
    'home footer CTA'
  )

  const cards = apps
    .map((app) => {
      const status = statusLabels[app.status] || app.status
      const cta = app.url
        ? `<a href="${escAttr(app.url)}" target="_blank" rel="noopener noreferrer" class="app-card__cta">Open app →</a>`
        : `<span class="app-card__cta app-card__cta--disabled">${app.status === 'coming-soon' ? 'Coming soon' : 'In development'}</span>`
      const tags = (app.tags || [])
        .map((tag) => `<span class="app-tag">${esc(tag)}</span>`)
        .join('')
      return `<div class="app-card"><div class="app-card__header"><div class="app-card__icon">${esc(app.icon)}</div><span class="app-card__status">${esc(status)}</span></div><div class="app-card__body"><h3 class="app-card__name">${esc(app.name)}</h3><p class="app-card__tagline">${esc(app.tagline)}</p><p class="app-card__desc">${esc(app.description)}</p></div><div class="app-card__footer"><div class="app-card__tags">${tags}</div>${cta}</div></div>`
    })
    .join('\n')

  const blogItems = posts
    .map(
      (post) =>
        `<div class="article-section section-card"><span class="meta-line">${esc(post.publishedAt)}</span><h3>${esc(post.title)}</h3><p>${esc(post.excerpt)}</p><p><a class="button button--primary" href="/blog/${escAttr(post.slug)}">Read article</a></p></div>`
    )
    .join('\n')

  const bodyHtml = `<div class="storefront"><section class="storefront-hero"><div class="storefront-hero__inner"><h1 class="storefront-headline">Apps built by<br /><span class="storefront-headline--accent">${esc(accent)}</span></h1><p class="storefront-subhead">${esc(subhead)}</p></div></section><section class="storefront-grid-section"><div class="storefront-grid">${cards}</div></section><section class="stack-xl"><h2>Guides &amp; Tutorials</h2>${blogItems}</section><section class="storefront-cta"><div class="storefront-cta__inner"><h2>${esc(ctaHeading[1])}</h2><p>${esc(ctaHeading[2])}</p><a href="/contact" class="cta-btn">${esc(ctaHeading[3])}</a></div></section></div>`

  // Home keeps the shell's own title/description (they are the site's real
  // ones); only the body is injected, written over dist/index.html itself.
  writePage('', renderPage({ route: '', bodyHtml }))
}

// -------------------------------------------------------------------- tools
{
  const src = fs.readFileSync(
    path.join(repoRoot, 'frontend', 'pages', 'ToolsPage.jsx'),
    'utf8'
  )
  const tools = extractArray(src, 'TOOLS', 'tools data')
  const h1 = must(/<h1>([^<]+)<\/h1>/, src, 'tools h1')[1]
  const lead = must(/prose-lead">\s*([^<]+?)\s*</, src, 'tools lead')[1]
  const disclosure = must(
    /tools-disclosure">\s*<p><em>([^<]+)<\/em><\/p>/,
    src,
    'tools disclosure'
  )[1]

  const groups = tools
    .map((group) => {
      const items = group.items
        .map(
          (tool) => `<div class="tool-card"><div class="tool-card__header"><h3>${esc(tool.name)}</h3><span class="tool-card__badge">${esc(tool.badge)}</span></div><p class="tool-card__tagline">${esc(tool.tagline)}</p><p class="tool-card__desc">${esc(tool.description)}</p><div class="tool-card__tags">${(tool.tags || []).map((tag) => `<span class="tool-tag">${esc(tag)}</span>`).join('')}</div><a href="${escAttr(tool.affiliate)}" target="_blank" rel="noopener noreferrer sponsored" class="button button--primary tool-card__cta">Visit ${esc(tool.name)} →</a></div>`
        )
        .join('\n')
      return `<section class="tools-group"><h2>${esc(group.category)}</h2><div class="tools-grid">${items}</div></section>`
    })
    .join('\n')

  const bodyHtml = `<article class="prose-page tools-page"><header class="prose-header"><h1>${esc(h1)}</h1><p class="prose-lead">${esc(lead)}</p></header>${groups}<section class="prose-section tools-disclosure"><p><em>${esc(disclosure)}</em></p></section></article>`

  writePage(
    'tools',
    renderPage({ route: 'tools', title: `${h1} | ${BRAND}`, desc: lead, bodyHtml })
  )
}

// --------------------------------------------------------------- blog index
{
  const src = fs.readFileSync(
    path.join(repoRoot, 'frontend', 'pages', 'BlogIndexPage.jsx'),
    'utf8'
  )
  const metaLine = must(/meta-line">([^<]+)</, src, 'blog index meta line')[1]
  const heading = must(/PrismHeadline text="([^"]+)"/, src, 'blog index heading')[1]
  const intro = must(/section-intro">\s*([^<]+?)\s*</, src, 'blog index intro')[1]

  const cards = posts
    .map(
      (post) => `<div class="article-section section-card"><span class="meta-line">${esc(post.publishedAt)}</span><h2>${esc(post.title)}</h2><p>${esc(post.excerpt)}</p><div class="hero__actions"><a class="button button--primary" href="/blog/${escAttr(post.slug)}">Read article</a></div></div>`
    )
    .join('\n')

  const bodyHtml = `<article class="stack-2xl"><section class="section-card article-hero"><span class="meta-line">${esc(metaLine)}</span><h1>${esc(heading)}</h1><p class="section-intro">${esc(intro)}</p></section><section class="stack-xl article-stack">${cards}</section></article>`

  writePage(
    'blog',
    renderPage({ route: 'blog', title: `${heading} | ${BRAND}`, desc: intro, bodyHtml })
  )
}

// --------------------------------------------------------------- blog posts
for (const post of posts) {
  const sections = (post.sections || [])
    .map((section) => {
      const paragraphs = String(section.body || '')
        .split(/\n\n+/)
        .map((para) => `<p>${esc(para.replace(/\n/g, ' '))}</p>`)
        .join('')
      return `<div class="article-section section-card"><h2>${esc(section.heading)}</h2>${paragraphs}</div>`
    })
    .join('\n')

  let ctaHtml = ''
  if (post.cta) {
    ctaHtml = `<section class="section-card cta-band"><div><span class="eyebrow">${esc(post.cta.eyebrow)}</span><h2>${esc(post.cta.heading)}</h2><p class="section-intro">${esc(post.cta.body)}</p></div><div class="hero__actions"><a class="button button--primary" href="${escAttr(post.cta.primaryHref)}">${esc(post.cta.primaryLabel)}</a></div></section>`
  }

  const bodyHtml = `<article class="stack-2xl"><section class="section-card article-hero"><span class="meta-line">${esc(post.publishedAt)}</span><h1>${esc(post.title)}</h1><p class="section-intro">${esc(post.excerpt)}</p></section><section class="stack-xl article-stack">${sections}</section>${ctaHtml}</article>`

  writePage(
    `blog/${post.slug}`,
    renderPage({
      route: `blog/${post.slug}`,
      title: `${post.title} | ${BRAND}`,
      desc: post.description || post.excerpt,
      bodyHtml,
    })
  )
}
