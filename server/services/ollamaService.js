const DEFAULT_OLLAMA_API_URL = 'http://127.0.0.1:11434'
const DEFAULT_OLLAMA_MODEL = 'llama3.2:3b'

function getOllamaApiUrl() {
  return String(process.env.OLLAMA_API_URL ?? DEFAULT_OLLAMA_API_URL).trim()
}

export function normalizeOllamaModelName(model) {
  const normalized = String(model ?? '').trim()

  if (!normalized) {
    return ''
  }

  return normalized.startsWith('ollama/')
    ? normalized.slice('ollama/'.length)
    : normalized
}

export function getConfiguredOllamaModel() {
  return (
    normalizeOllamaModelName(process.env.OLLAMA_MODEL) || DEFAULT_OLLAMA_MODEL
  )
}

function parseModelName(model) {
  return model?.split(':')[0] ?? model
}

export async function listAvailableModels() {
  try {
    const response = await fetch(`${getOllamaApiUrl()}/api/tags`)
    if (!response.ok) {
      throw new Error(`Ollama tags request failed with ${response.status}`)
    }

    const payload = await response.json()
    const models = payload.models ?? []

    return models.map((model) => ({
      name: model.name,
      family: parseModelName(model.name),
      size: model.size,
    }))
  } catch {
    return [
      { name: 'deepseek-coder', family: 'deepseek-coder', size: null },
      { name: 'codellama', family: 'codellama', size: null },
      { name: 'llama3', family: 'llama3', size: null },
    ]
  }
}

function extractJsonBlock(text) {
  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i)
  if (fencedMatch) {
    return fencedMatch[1]
  }

  const objectMatch = text.match(/\{[\s\S]*\}/)
  return objectMatch ? objectMatch[0] : text
}

export async function generateWithOllama({
  model,
  prompt,
  systemPrompt = 'You are a precise JSON generator.',
  format = undefined,
}) {
  const response = await fetch(`${getOllamaApiUrl()}/api/generate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      system: systemPrompt,
      stream: false,
      format,
    }),
  })

  if (!response.ok) {
    throw new Error(`Ollama generation failed with ${response.status}`)
  }

  const payload = await response.json()
  return payload.response?.trim() ?? ''
}

export async function generateJsonWithOllama(options) {
  const text = await generateWithOllama({
    ...options,
    format: 'json',
  })

  return JSON.parse(extractJsonBlock(text))
}

export async function forwardOllamaRequest(pathname, init = {}) {
  const upstreamPath = pathname.startsWith('/')
    ? pathname
    : `/${String(pathname ?? '').trim()}`

  return fetch(`${getOllamaApiUrl()}${upstreamPath}`, init)
}
