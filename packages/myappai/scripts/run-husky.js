import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

function shouldSkipHusky() {
  return process.env.NODE_ENV === 'production' || process.env.CI === 'true'
}

if (shouldSkipHusky()) {
  process.exit(0)
}

let huskyBin = ''

try {
  huskyBin = require.resolve('husky/bin.js')
} catch {
  process.exit(0)
}

const result = spawnSync(process.execPath, [huskyBin], {
  stdio: 'inherit',
})

process.exit(result.status ?? 0)
