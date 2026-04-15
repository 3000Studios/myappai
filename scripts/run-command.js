import './lib/loadEnvironment.js'
import fs from 'node:fs'
import { executeRepositoryCommand } from '../api/command.js'
import { bootstrapContent } from '../server/services/contentService.js'

function parseJsonPayload(raw) {
  const variants = [raw, raw.replace(/\\"/g, '"')]

  for (const candidate of variants) {
    try {
      return JSON.parse(candidate)
    } catch {
      continue
    }
  }

  return null
}

function parseCommand(argv) {
  const raw = argv.slice(2).join(' ').trim()

  if (!raw) {
    return {
      action: 'homepage_update',
      page: 'homepage',
      field: 'subheadline',
      value: 'MyAppAI operator platform',
      autoDeploy: false,
    }
  }

  if (raw.startsWith('@')) {
    const filePath = raw.slice(1).trim()
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const payload = parseJsonPayload(fileContents)

    if (payload) {
      return payload
    }
  }

  const payload = parseJsonPayload(raw)

  if (payload) {
    return payload
  }

  return {
    command: raw,
  }
}

await bootstrapContent()

const command = parseCommand(process.argv)
const result = await executeRepositoryCommand(command)
console.log(JSON.stringify(result, null, 2))
