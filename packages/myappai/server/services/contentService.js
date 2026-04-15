import fs from 'node:fs/promises'
import path from 'node:path'
import {
  blogRoot,
  contentRoot,
  frontendBackgroundsRoot,
  pagesRoot,
  productsRoot,
  repoRoot,
  systemRoot,
} from './platformPaths.js'

const ACTIVE_MARKER = 'myappai'
const ACTIVE_PAGE_SLUGS = new Set(['homepage', 'platform', 'pricing', 'theme'])

const DEFAULT_FILES = {
  pages: {
    'homepage.json': {
      updatedFor: ACTIVE_MARKER,
      headline: 'MyAppAI operator workspace',
      subheadline:
        'Research, plan, edit your repository, and deploy from one browser-based control plane.',
      primaryCta: { label: 'Open admin login', to: '/admin/login' },
      secondaryCta: { label: 'Stay on homepage', to: '/' },
      heroSignals: [
        'Natural-language orchestration',
        'Repo-safe execution',
        'Deploy-ready',
      ],
      heroStats: [
        { label: 'Primary route', value: '/admin/operator' },
        { label: 'Deploy target', value: 'myappai.net' },
        { label: 'Integrations', value: 'Cloudflare · GitHub · OpenAI' },
      ],
      updatedAt: '2026-03-25T00:00:00.000Z',
    },
    'platform.json': {
      updatedFor: ACTIVE_MARKER,
      headline: 'One control plane for research, code, and deployment',
      intro:
        'MyAppAI keeps operator prompts, safe actions, and deploy results in one authenticated workspace.',
      items: [
        {
          slug: 'operator-workspace',
          title: 'Operator Workspace',
          description:
            'Turn plain-language requests into safe repository edits, research, and deploy workflows.',
        },
        {
          slug: 'approved-integrations',
          title: 'Approved Integrations',
          description:
            'Use Cloudflare, GitHub, and OpenAI intentionally instead of leaking into arbitrary external actions.',
        },
      ],
      updatedAt: '2026-03-25T00:00:00.000Z',
    },
    'pricing.json': {
      updatedFor: ACTIVE_MARKER,
      headline: 'Operator pricing is handled off-platform for now',
      tiers: [],
      updatedAt: '2026-03-25T00:00:00.000Z',
    },
    'theme.json': {
      updatedFor: ACTIVE_MARKER,
      name: 'Operator Dark',
      palette: {
        bg: '#0a0a0b',
        surface: '#141417',
        ink: '#e2e2e7',
        accent: '#3b82f6',
        highlight: '#10b981',
        line: 'rgba(255,255,255,0.08)',
      },
      updatedAt: '2026-03-25T00:00:00.000Z',
    },
  },
  blog: {
    'index.json': {
      updatedFor: ACTIVE_MARKER,
      posts: [],
    },
  },
  products: {
    'catalog.json': {
      updatedFor: ACTIVE_MARKER,
      products: [],
    },
  },
  system: {
    'analytics.json': {
      aiActivity: {
        commandsToday: 0,
        deploymentsToday: 0,
        lastAction: 'idle',
        lastMode: 'idle',
      },
      updatedAt: null,
    },
    'traffic.json': {
      queue: [],
      published: [],
      updatedAt: null,
    },
    'deployments.json': {
      history: [
        {
          id: 'bootstrap-20260325',
          status: 'idle',
          message: 'MyAppAI operator platform ready for deploy.',
          branch: 'main',
          commitSha: null,
          startedAt: '2026-03-25T00:00:00.000Z',
          finishedAt: '2026-03-25T00:00:00.000Z',
        },
      ],
    },
    'events.json': {
      events: [],
      updatedAt: null,
    },
    'leads.json': {
      leads: [],
      updatedAt: null,
    },
    'payments.json': {
      payments: [],
      updatedAt: null,
    },
    'state.json': {
      scheduler: {
        status: 'idle',
      },
      tasks: {},
    },
  },
}

function normalize(value) {
  return value.replace(/\\/g, '/')
}

function nowIso() {
  return new Date().toISOString()
}

export function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function mergeObjects(base, patch) {
  if (!isObject(base) || !isObject(patch)) {
    return patch
  }

  const merged = { ...base }

  for (const [key, value] of Object.entries(patch)) {
    if (Array.isArray(value)) {
      merged[key] = value
      continue
    }

    if (isObject(value)) {
      merged[key] = mergeObjects(base[key] ?? {}, value)
      continue
    }

    merged[key] = value
  }

  return merged
}

async function ensureDirectory(directory) {
  await fs.mkdir(directory, { recursive: true })
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

export async function readJson(filePath, fallback = null) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    if (error.code === 'ENOENT' && fallback !== null) {
      await writeJson(filePath, fallback)
      return fallback
    }

    throw error
  }
}

export async function writeJson(filePath, payload) {
  await ensureDirectory(path.dirname(filePath))
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

async function ensureDefaultFiles() {
  const directories = [
    contentRoot,
    pagesRoot,
    blogRoot,
    productsRoot,
    systemRoot,
    frontendBackgroundsRoot,
  ]
  await Promise.all(directories.map(ensureDirectory))

  for (const [bucket, files] of Object.entries(DEFAULT_FILES)) {
    const bucketRoot =
      bucket === 'pages'
        ? pagesRoot
        : bucket === 'blog'
          ? blogRoot
          : bucket === 'products'
            ? productsRoot
            : systemRoot

    for (const [fileName, contents] of Object.entries(files)) {
      const filePath = path.join(bucketRoot, fileName)
      if (!(await pathExists(filePath))) {
        await writeJson(filePath, contents)
      }
    }
  }
}

function isActiveContentRecord(directory, slug, data) {
  if (directory === systemRoot) {
    return true
  }

  if (data?.updatedFor === ACTIVE_MARKER) {
    return true
  }

  if (directory === pagesRoot) {
    return ACTIVE_PAGE_SLUGS.has(slug)
  }

  return false
}

async function listJsonDirectory(directory) {
  await ensureDirectory(directory)

  const entries = await fs.readdir(directory, { withFileTypes: true })
  const jsonEntries = entries.filter(
    (entry) => entry.isFile() && entry.name.endsWith('.json')
  )

  const records = []

  for (const entry of jsonEntries) {
    const filePath = path.join(directory, entry.name)
    const data = await readJson(filePath)
    const slug = entry.name.replace(/\.json$/i, '')

    if (!isActiveContentRecord(directory, slug, data)) {
      continue
    }

    records.push({
      slug,
      filePath: normalize(path.relative(repoRoot, filePath)),
      data,
    })
  }

  return records.sort((left, right) => left.slug.localeCompare(right.slug))
}

function resolveRepoPath(targetPath) {
  const resolvedPath = path.resolve(repoRoot, targetPath)

  if (!resolvedPath.startsWith(repoRoot)) {
    throw new Error('Target path must stay inside the repository.')
  }

  return resolvedPath
}

function setByPath(target, pathExpression, value) {
  const segments = pathExpression.split('.').filter(Boolean)
  if (segments.length === 0) {
    throw new Error('Field path is required.')
  }

  let pointer = target

  for (const segment of segments.slice(0, -1)) {
    if (!isObject(pointer[segment])) {
      pointer[segment] = {}
    }

    pointer = pointer[segment]
  }

  pointer[segments.at(-1)] = value
}

export async function bootstrapContent() {
  await ensureDefaultFiles()
}

export async function getContentBundle(section = 'all') {
  await bootstrapContent()

  const bundle = {
    pages: await listJsonDirectory(pagesRoot),
    blog: await listJsonDirectory(blogRoot),
    products: await listJsonDirectory(productsRoot),
    system: await listJsonDirectory(systemRoot),
  }

  if (section === 'all') {
    return bundle
  }

  if (!bundle[section]) {
    throw new Error(`Unknown content section "${section}".`)
  }

  return { [section]: bundle[section] }
}

export async function createPage(pageName, pagePayload) {
  await bootstrapContent()
  const slug = slugify(pageName)
  const filePath = path.join(pagesRoot, `${slug}.json`)
  const current = (await pathExists(filePath)) ? await readJson(filePath) : {}
  const nextPage = mergeObjects(current, {
    slug,
    updatedFor: ACTIVE_MARKER,
    ...pagePayload,
    updatedAt: nowIso(),
  })

  await writeJson(filePath, nextPage)

  return {
    slug,
    filePath: normalize(path.relative(repoRoot, filePath)),
    data: nextPage,
  }
}

export async function updatePageContent(pageName, field, value) {
  await bootstrapContent()
  const slug = slugify(pageName)
  const filePath = path.join(pagesRoot, `${slug}.json`)
  const page = await readJson(filePath, {
    slug,
    updatedFor: ACTIVE_MARKER,
  })

  setByPath(page, field, value)
  page.updatedFor = ACTIVE_MARKER
  page.updatedAt = nowIso()

  await writeJson(filePath, page)

  return {
    slug,
    filePath: normalize(path.relative(repoRoot, filePath)),
    data: page,
  }
}

export async function saveBlogPost(postPayload) {
  await bootstrapContent()
  const slug = slugify(
    postPayload.slug ??
      postPayload.title ??
      postPayload.topic ??
      `post-${Date.now()}`
  )
  const filePath = path.join(blogRoot, `${slug}.json`)
  const post = {
    ...postPayload,
    slug,
    updatedFor: ACTIVE_MARKER,
    updatedAt: nowIso(),
  }

  await writeJson(filePath, post)

  const indexPath = path.join(blogRoot, 'index.json')
  const indexData = await readJson(indexPath, {
    updatedFor: ACTIVE_MARKER,
    posts: [],
  })
  const summary = {
    slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt ?? nowIso().slice(0, 10),
    tags: post.tags ?? [],
  }

  indexData.updatedFor = ACTIVE_MARKER
  indexData.posts = [
    summary,
    ...indexData.posts.filter((entry) => entry.slug !== slug),
  ]
  await writeJson(indexPath, indexData)

  return {
    slug,
    filePath: normalize(path.relative(repoRoot, filePath)),
    data: post,
  }
}

export async function upsertFeatureSection(featureSection) {
  await bootstrapContent()
  const filePath = path.join(pagesRoot, 'platform.json')
  const featurePage = await readJson(
    filePath,
    DEFAULT_FILES.pages['platform.json']
  )
  const nextItem = {
    slug: slugify(
      featureSection.slug ??
        featureSection.title ??
        featureSection.product ??
        `feature-${Date.now()}`
    ),
    ...featureSection,
  }

  featurePage.updatedFor = ACTIVE_MARKER
  featurePage.items = [
    nextItem,
    ...featurePage.items.filter((item) => item.slug !== nextItem.slug),
  ]
  featurePage.updatedAt = nowIso()

  await writeJson(filePath, featurePage)

  return {
    slug: nextItem.slug,
    filePath: normalize(path.relative(repoRoot, filePath)),
    data: featurePage,
  }
}

export async function updateTheme(themePatch) {
  await bootstrapContent()
  const filePath = path.join(pagesRoot, 'theme.json')
  const currentTheme = await readJson(
    filePath,
    DEFAULT_FILES.pages['theme.json']
  )
  const nextTheme = mergeObjects(currentTheme, themePatch)
  nextTheme.updatedFor = ACTIVE_MARKER
  nextTheme.updatedAt = nowIso()

  await writeJson(filePath, nextTheme)

  return {
    slug: 'theme',
    filePath: normalize(path.relative(repoRoot, filePath)),
    data: nextTheme,
  }
}

export async function editWorkspaceFile({
  targetPath,
  contents,
  append = false,
}) {
  const resolvedPath = resolveRepoPath(targetPath)

  if (resolvedPath.endsWith('.json')) {
    JSON.parse(contents)
  }

  await ensureDirectory(path.dirname(resolvedPath))

  if (append) {
    await fs.appendFile(resolvedPath, contents, 'utf8')
  } else {
    await fs.writeFile(resolvedPath, contents, 'utf8')
  }

  return {
    filePath: normalize(path.relative(repoRoot, resolvedPath)),
    bytesWritten: Buffer.byteLength(contents),
  }
}

export async function readSystemDocument(fileName, fallback) {
  await bootstrapContent()
  return readJson(path.join(systemRoot, fileName), fallback)
}

export async function writeSystemDocument(fileName, payload) {
  await bootstrapContent()
  await writeJson(path.join(systemRoot, fileName), payload)
}

export function getSystemDefault(fileName) {
  return DEFAULT_FILES.system[fileName]
}
