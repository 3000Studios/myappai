import fs from 'node:fs/promises'
import path from 'node:path'
import {
  frontendAssetsRoot,
  frontendBackgroundsRoot,
  repoRoot,
} from '../../server/services/platformPaths.js'
import { slugify, writeJson } from '../../server/services/contentService.js'

const PROVIDERS = {
  unsplash: {
    enabled: () => Boolean(process.env.UNSPLASH_ACCESS_KEY),
    async search(query) {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=4&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      )
      const payload = await response.json()
      return (payload.results ?? []).map((item) => ({
        provider: 'Unsplash',
        type: 'image',
        url: item.urls?.regular,
        attribution: `${item.user?.name} via Unsplash`,
        sourceUrl: item.links?.html,
      }))
    },
  },
  pexels: {
    enabled: () => Boolean(process.env.PEXELS_API_KEY),
    async search(query) {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=4&orientation=landscape`,
        {
          headers: {
            Authorization: process.env.PEXELS_API_KEY,
          },
        }
      )
      const payload = await response.json()
      return (payload.photos ?? []).map((item) => ({
        provider: 'Pexels',
        type: 'image',
        url: item.src?.large,
        attribution: `${item.photographer} via Pexels`,
        sourceUrl: item.url,
      }))
    },
  },
  pixabay: {
    enabled: () => Boolean(process.env.PIXABAY_API_KEY),
    async search(query) {
      const response = await fetch(
        `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=4`
      )
      const payload = await response.json()
      return (payload.hits ?? []).map((item) => ({
        provider: 'Pixabay',
        type: 'image',
        url: item.largeImageURL,
        attribution: `${item.user} via Pixabay`,
        sourceUrl: item.pageURL,
      }))
    },
  },
}

function normalizeRelative(targetPath) {
  return path.relative(repoRoot, targetPath).replace(/\\/g, '/')
}

async function ensureDirectory(directory) {
  await fs.mkdir(directory, { recursive: true })
}

function extensionFromContentType(contentType) {
  if (!contentType) {
    return '.jpg'
  }

  if (contentType.includes('png')) return '.png'
  if (contentType.includes('svg')) return '.svg'
  if (contentType.includes('webp')) return '.webp'
  if (contentType.includes('mp4')) return '.mp4'
  return '.jpg'
}

async function downloadAsset(asset, filePrefix) {
  const response = await fetch(asset.url)
  if (!response.ok) {
    throw new Error(`Media download failed with ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const extension = extensionFromContentType(
    response.headers.get('content-type')
  )
  const fileName = `${filePrefix}${extension}`
  const targetPath = path.join(frontendAssetsRoot, fileName)

  await ensureDirectory(frontendAssetsRoot)
  await fs.writeFile(targetPath, Buffer.from(arrayBuffer))

  return {
    ...asset,
    imagePath: asset.type === 'image' ? normalizeRelative(targetPath) : null,
    videoPath: asset.type === 'video' ? normalizeRelative(targetPath) : null,
    storedAt: normalizeRelative(targetPath),
  }
}

async function createPlaceholderAsset(query, variant = 'image') {
  await ensureDirectory(frontendAssetsRoot)
  const slug = slugify(query)
  const fileName = `${slug}-${Date.now()}.svg`
  const targetPath = path.join(frontendAssetsRoot, fileName)
  const text = query.slice(0, 36)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#101736"/><stop offset="50%" stop-color="#ff8a3d"/><stop offset="100%" stop-color="#5be7c4"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><circle cx="320" cy="220" r="180" fill="#ffffff20"/><circle cx="1280" cy="680" r="220" fill="#0d102180"/><text x="120" y="460" font-size="88" fill="#f7f2e8" font-family="Verdana">${text}</text><text x="120" y="560" font-size="36" fill="#f7f2e8" font-family="Verdana">Generated local ${variant} placeholder</text></svg>`
  await fs.writeFile(targetPath, svg, 'utf8')

  return {
    provider: 'LocalFallback',
    type: variant,
    imagePath: variant === 'image' ? normalizeRelative(targetPath) : null,
    videoPath: variant === 'video' ? normalizeRelative(targetPath) : null,
    attribution:
      'Generated placeholder asset stored locally in frontend/assets.',
    storedAt: normalizeRelative(targetPath),
    sourceUrl: null,
  }
}

async function discoverRemoteAssets(query, providerName) {
  const providers = providerName ? [providerName] : Object.keys(PROVIDERS)

  for (const name of providers) {
    const provider = PROVIDERS[name]
    if (!provider || !provider.enabled()) continue

    try {
      const results = await provider.search(query)
      if (results.length > 0) return results
    } catch {
      continue
    }
  }

  return []
}

export async function generateImages({ query, count = 1, provider }) {
  const remoteAssets = await discoverRemoteAssets(query, provider)

  if (remoteAssets.length === 0) {
    const placeholder = await createPlaceholderAsset(query, 'image')
    return [placeholder]
  }

  const selectedAssets = remoteAssets.slice(0, count)
  return Promise.all(
    selectedAssets.map((asset, index) =>
      downloadAsset(asset, `${slugify(query)}-${Date.now()}-${index}`)
    )
  )
}

export async function generateBackground({
  query,
  palette = ['#101736', '#ff8a3d', '#5be7c4'],
}) {
  const [asset] = await generateImages({ query, count: 1 })
  const backgroundDocument = {
    name: `${slugify(query)}-background`,
    query,
    palette,
    assetPath: asset.imagePath,
    attribution: asset.attribution,
    createdAt: new Date().toISOString(),
  }

  const targetPath = path.join(
    frontendBackgroundsRoot,
    `${slugify(query)}.json`
  )
  await writeJson(targetPath, backgroundDocument)

  return {
    ...asset,
    backgroundConfigPath: normalizeRelative(targetPath),
  }
}
