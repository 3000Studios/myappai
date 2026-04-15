import { mirrorConversionToClientAnalytics } from './analyticsClient.js'

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
const SESSION_KEY = 'myappai_session_id'

function getResolvedApiBase() {
  if (API_BASE) {
    return API_BASE
  }

  return canUseSameOriginApi() ? '' : null
}

async function request(path, { method = 'GET', body } = {}) {
  const resolvedApiBase = getResolvedApiBase()

  if (resolvedApiBase == null) {
    if (path === '/api/public/events' && method === 'POST') {
      return { ok: false, skipped: true }
    }

    throw new Error(
      'The public API is not connected to this Pages deployment yet.'
    )
  }

  const response = await fetch(`${resolvedApiBase}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.message ?? 'Request failed.')
  }

  return payload
}

export function getVisitorSessionId() {
  if (typeof window === 'undefined') {
    return 'server-render'
  }

  const existing = window.localStorage.getItem(SESSION_KEY)

  if (existing) {
    return existing
  }

  const nextId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  window.localStorage.setItem(SESSION_KEY, nextId)
  return nextId
}

function getCurrentPath() {
  if (typeof window === 'undefined') {
    return '/'
  }

  return `${window.location.pathname}${window.location.search}`
}

export function getPublicSiteSnapshot() {
  return request('/api/public/site')
}

export function trackSiteEvent(event) {
  return request('/api/public/events', {
    method: 'POST',
    body: event,
  })
}

export function trackConversionEvent(type, details = {}) {
  mirrorConversionToClientAnalytics(type, details)

  return trackSiteEvent({
    type,
    path: details.path ?? getCurrentPath(),
    sessionId: details.sessionId ?? getVisitorSessionId(),
    referrer:
      details.referrer ??
      (typeof document === 'undefined' ? '' : document.referrer),
    ctaId: details.ctaId ?? '',
    offerSlug: details.offerSlug ?? '',
    provider: details.provider ?? '',
    intent: details.intent ?? '',
    stage: details.stage ?? '',
    details: details.details ?? null,
  })
}

export function trackCtaClick(details) {
  return trackConversionEvent('cta_click', details)
}

export function submitLead(lead) {
  return request('/api/public/leads', {
    method: 'POST',
    body: lead,
  })
}
