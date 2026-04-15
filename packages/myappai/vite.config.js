import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendRoot = path.resolve(__dirname, 'frontend')
const distRoot = path.resolve(__dirname, 'dist')
const contentRoot = path.resolve(__dirname, 'content')
const frontendAssetsRoot = path.resolve(__dirname, 'frontend', 'assets')

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) {
    return
  }

  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.cpSync(source, target, { recursive: true, force: true })
}

function syncWorkspaceArtifacts() {
  return {
    name: 'sync-workspace-artifacts',
    closeBundle() {
      copyDirectory(contentRoot, path.join(distRoot, 'content'))
      copyDirectory(frontendAssetsRoot, path.join(distRoot, 'assets'))
    },
  }
}

export default defineConfig({
  root: frontendRoot,
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
    setupFiles: ['./src/vitest.setup.js'],
  },
  publicDir: path.join(frontendRoot, 'public'),
  plugins: [
    react(),
    syncWorkspaceArtifacts(),
    process.env.ANALYZE === 'true'
      ? visualizer({
          filename: path.join(distRoot, 'bundle-analysis.html'),
          open: false,
          gzipSize: true,
        })
      : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      '@content': contentRoot,
      '@frontend': frontendRoot,
      '@src': path.join(frontendRoot, 'src'),
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: [__dirname],
    },
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT || '8787'}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: distRoot,
    emptyOutDir: true,
  },
})
