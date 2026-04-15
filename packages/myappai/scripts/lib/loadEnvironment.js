import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { repoRoot } from '../../server/services/platformPaths.js'

const ENV_FILES = [
  '.secrets/myappai.local.env',
  '.secrets/shared.local.env',
  '.env.local',
  '.env',
  '.dev.vars.local',
  '.dev.vars',
]

let loadedFiles = null

function clearLegacyEndpointLeak(name) {
  const value = process.env[name]

  if (!value || !/campdreamga/i.test(String(value))) {
    return
  }

  delete process.env[name]
}

function aliasEnvironmentVariable(sourceName, targetName) {
  if (process.env[sourceName] && !process.env[targetName]) {
    process.env[targetName] = process.env[sourceName]
  }
}

export function loadEnvironment() {
  if (loadedFiles) {
    return loadedFiles
  }

  const applied = []

  for (const relativePath of ENV_FILES) {
    const absolutePath = path.join(repoRoot, relativePath)

    if (!fs.existsSync(absolutePath)) {
      continue
    }

    const result = dotenv.config({
      path: absolutePath,
      override: relativePath.startsWith('.secrets/'),
    })

    if (!result.error) {
      applied.push(relativePath)
    }
  }

  loadedFiles = applied

  aliasEnvironmentVariable(
    'CLOUDFLARE_MASTERR_TOKEN',
    'CLOUDFLARE_MASTER_TOKEN'
  )
  aliasEnvironmentVariable('CLOUD_FLARE_API_TOKEN', 'CLOUDFLARE_API_TOKEN')
  aliasEnvironmentVariable('CLOUD_FLARE_ACCOUNT_ID', 'CLOUDFLARE_ACCOUNT_ID')
  ;['ADMIN_API_ORIGIN', 'API_BASE_URL', 'VITE_API_BASE_URL'].forEach(
    clearLegacyEndpointLeak
  )

  return loadedFiles
}

export function getPagesProjectName() {
  return (
    process.env.CLOUDFLARE_PAGES_PROJECT_NAME?.trim() ||
    process.env.APP_NAME?.trim() ||
    'myappai'
  )
}

export function getProductionBranch() {
  return (
    process.env.CLOUDFLARE_PAGES_BRANCH?.trim() ||
    process.env.GH_BASE_BRANCH?.trim() ||
    'main'
  )
}

loadEnvironment()
