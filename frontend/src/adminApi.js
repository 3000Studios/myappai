function normalizeApiBase(value) {
  const trimmed = String(value ?? '')
    .trim()
    .replace(/\/$/, '')

  if (/campdreamga/i.test(trimmed)) {
    return ''
  }

  return trimmed
}

function canUseSameOriginApi() {
  if (typeof window === 'undefined') {
    return false
  }

  const { hostname, protocol } = window.location

  if (['localhost', '127.0.0.1'].includes(hostname)) {
    return true
  }

  if (protocol !== 'https:') {
    return false
  }

  return (
    hostname === 'myappai.net' ||
    hostname === 'www.myappai.net' ||
    hostname.endsWith('.pages.dev')
  )
}

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL)

function getResolvedApiBase() {
  if (API_BASE) {
    return API_BASE
  }

  return canUseSameOriginApi() ? '' : null
}

async function request(
  path,
  { adminEmail, adminCode, adminKey, method = 'GET', body } = {}
) {
  const resolvedApiBase = getResolvedApiBase()

  if (resolvedApiBase == null) {
    throw new Error(
      'The operator API is not connected to this Pages deployment yet.'
    )
  }

  const response = await fetch(`${resolvedApiBase}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      'x-admin-email': adminEmail ?? '',
      'x-admin-code': adminCode ?? '',
      'x-admin-key': adminKey ?? '',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.message ?? 'Request failed.')
  }

  return payload
}

export function loginAdmin(credentials) {
  return request('/api/admin/login', {
    method: 'POST',
    body: credentials,
  })
}

export function getAdminSessionState() {
  return request('/api/admin/session')
}

export function logoutAdmin() {
  return request('/api/admin/logout', {
    method: 'POST',
  })
}

export function getAnalytics(adminSession) {
  return request('/api/analytics', adminSession)
}

export function getDeployments(adminSession) {
  return request('/api/deployments', adminSession)
}

export function getContent(adminSession) {
  return request('/api/content', adminSession)
}

export function getMetrics(adminSession) {
  return request('/api/metrics', adminSession)
}

export function getLogs(adminSession) {
  return request('/api/logs', adminSession)
}

export function getSecureLogsWithCode(adminSession, code) {
  return request(
    `/api/logs/secure?code=${encodeURIComponent(code)}`,
    adminSession
  )
}

export function postClientLog(adminSession, payload) {
  return request('/api/logs/client', {
    ...adminSession,
    method: 'POST',
    body: payload,
  })
}

export function runSelfHeal(adminSession) {
  return request('/api/heal', {
    ...adminSession,
    method: 'POST',
  })
}

export function getRevenueQueue(adminSession) {
  return request('/api/revenue', adminSession)
}

export function updateLeadStage(adminSession, leadId, patch) {
  return request(`/api/revenue/leads/${encodeURIComponent(leadId)}`, {
    ...adminSession,
    method: 'PATCH',
    body: patch,
  })
}

export function sendCommand(adminSession, command) {
  return request('/api/command', {
    ...adminSession,
    method: 'POST',
    body: command,
  })
}

export function transcribeWhisper(adminSession, payload) {
  return request('/api/transcription/whisper', {
    ...adminSession,
    method: 'POST',
    body: payload,
  })
}

export function askGemini(adminSession, payload) {
  return request('/api/gemini', {
    ...adminSession,
    method: 'POST',
    body: payload,
  })
}

export async function askGeminiStream(adminSession, payload, onChunk) {
  const resolvedApiBase = getResolvedApiBase()
  if (resolvedApiBase == null) {
    throw new Error(
      'The operator API is not connected to this Pages deployment yet.'
    )
  }

  const response = await fetch(`${resolvedApiBase}/api/gemini/stream`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      'x-admin-email': adminSession?.adminEmail ?? '',
      'x-admin-code': adminSession?.adminCode ?? '',
      'x-admin-key': adminSession?.adminKey ?? '',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok || !response.body) {
    const payloadError = await response.json().catch(() => ({}))
    throw new Error(
      payloadError.message ?? payloadError.error ?? 'Stream request failed.'
    )
  }

  const decoder = new TextDecoder()
  const reader = response.body.getReader()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''

    for (const eventBlock of events) {
      const lines = eventBlock.split('\n')
      const eventTypeLine = lines.find((line) => line.startsWith('event:'))
      const dataLine = lines.find((line) => line.startsWith('data:'))
      const eventType = eventTypeLine?.replace('event:', '').trim() || 'message'
      const dataText = dataLine?.replace('data:', '').trim()
      if (!dataText) {
        continue
      }
      const data = JSON.parse(dataText)

      if (eventType === 'error') {
        throw new Error(data.error ?? 'Gemini stream failed.')
      }
      if (eventType === 'done') {
        return
      }
      if (
        typeof data.chunk === 'string' &&
        data.chunk &&
        typeof onChunk === 'function'
      ) {
        onChunk(data.chunk)
      }
    }
  }
}
