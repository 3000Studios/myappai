import { Readable } from 'node:stream'
import {
  forwardOllamaRequest,
  getConfiguredOllamaModel,
  normalizeOllamaModelName,
} from './ollamaService.js'

const OLLAMA_PROXY_SECRET_HEADER = 'x-ollama-proxy-secret'

function isConfiguredValue(value) {
  const normalized = String(value ?? '').trim()

  return (
    normalized.length > 0 &&
    !normalized.startsWith('your-') &&
    !normalized.startsWith('replace-with-')
  )
}

function getConfiguredEnvironmentValue(...names) {
  for (const name of names) {
    const value = String(process.env[name] ?? '').trim()

    if (isConfiguredValue(value)) {
      return value
    }
  }

  return ''
}

function createHttpError(statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function resolveOllamaUpstreamPath(requestPath) {
  const normalized = String(requestPath ?? '').replace(/\/+$/u, '') || '/ollama'
  const suffix = normalized.startsWith('/ollama')
    ? normalized.slice('/ollama'.length)
    : normalized

  if (!suffix || suffix === '/') {
    return '/api/generate'
  }

  const normalizedSuffix = suffix.startsWith('/') ? suffix : `/${suffix}`

  if (
    normalizedSuffix === '/generate' ||
    normalizedSuffix === '/api/generate'
  ) {
    return '/api/generate'
  }

  if (normalizedSuffix === '/chat' || normalizedSuffix === '/api/chat') {
    return '/api/chat'
  }

  if (normalizedSuffix === '/tags' || normalizedSuffix === '/api/tags') {
    return '/api/tags'
  }

  if (normalizedSuffix === '/status') {
    return '/status'
  }

  throw createHttpError(
    404,
    'Unsupported Ollama proxy path. Use /api/ollama, /api/ollama/chat, /api/ollama/generate, or /api/ollama/tags.'
  )
}

function normalizeOllamaProxyPayload(payload, upstreamPath) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw createHttpError(
      400,
      'Ollama proxy request body must be a JSON object.'
    )
  }

  if (upstreamPath === '/api/tags') {
    return payload
  }

  const normalizedPayload = {
    ...payload,
  }
  const normalizedModel = normalizeOllamaModelName(normalizedPayload.model)

  normalizedPayload.model = normalizedModel || getConfiguredOllamaModel()

  return normalizedPayload
}

function getOllamaProxySecret() {
  return getConfiguredEnvironmentValue('OLLAMA_PROXY_SECRET')
}

function getSuppliedOllamaProxySecret(request) {
  return String(
    request.get?.(OLLAMA_PROXY_SECRET_HEADER) ??
      request.headers?.[OLLAMA_PROXY_SECRET_HEADER] ??
      request.query?.secret ??
      ''
  ).trim()
}

export function getOllamaProxyStatusSummary() {
  return {
    ok: true,
    model: getConfiguredOllamaModel(),
    proxySecretConfigured: Boolean(getOllamaProxySecret()),
  }
}

export function assertOllamaProxyRequest(request) {
  const configuredSecret = getOllamaProxySecret()

  if (!configuredSecret) {
    return
  }

  const suppliedSecret = getSuppliedOllamaProxySecret(request)

  if (suppliedSecret !== configuredSecret) {
    throw createHttpError(403, 'Valid Ollama proxy secret required.')
  }
}

export async function forwardOllamaProxyHttpRequest({
  requestPath,
  method,
  body,
}) {
  const upstreamPath = resolveOllamaUpstreamPath(requestPath)

  if (upstreamPath === '/status') {
    return {
      kind: 'summary',
      payload: getOllamaProxyStatusSummary(),
      status: 200,
    }
  }

  if (method === 'GET' || method === 'HEAD') {
    if (upstreamPath !== '/api/tags') {
      throw createHttpError(
        405,
        'Use GET only with /api/ollama/status or /api/ollama/tags.'
      )
    }

    const upstreamResponse = await forwardOllamaRequest(upstreamPath, {
      method,
    })

    return {
      kind: 'response',
      response: upstreamResponse,
    }
  }

  if (upstreamPath === '/api/tags') {
    throw createHttpError(405, 'Use GET with /api/ollama/tags.')
  }

  const payload = normalizeOllamaProxyPayload(body ?? {}, upstreamPath)
  const upstreamResponse = await forwardOllamaRequest(upstreamPath, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return {
    kind: 'response',
    response: upstreamResponse,
  }
}

export async function pipeOllamaProxyResponse(response, upstreamResponse) {
  response.status(upstreamResponse.status)

  upstreamResponse.headers.forEach((value, key) => {
    const normalizedKey = key.toLowerCase()

    if (
      normalizedKey === 'content-length' ||
      normalizedKey === 'transfer-encoding' ||
      normalizedKey === 'connection'
    ) {
      return
    }

    response.setHeader(key, value)
  })

  if (!upstreamResponse.body) {
    response.end()
    return
  }

  await new Promise((resolve, reject) => {
    const stream = Readable.fromWeb(upstreamResponse.body)

    stream.on('error', reject)
    response.on('error', reject)
    response.on('finish', resolve)
    stream.pipe(response)
  })
}
