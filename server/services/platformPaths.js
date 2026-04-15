import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const repoRoot = path.resolve(__dirname, '../..')
export const contentRoot = path.join(repoRoot, 'content')
export const pagesRoot = path.join(contentRoot, 'pages')
export const blogRoot = path.join(contentRoot, 'blog')
export const productsRoot = path.join(contentRoot, 'products')
export const systemRoot = path.join(contentRoot, 'system')
export const frontendRoot = path.join(repoRoot, 'frontend')
export const frontendAssetsRoot = path.join(frontendRoot, 'assets')
export const frontendBackgroundsRoot = path.join(frontendRoot, 'backgrounds')
