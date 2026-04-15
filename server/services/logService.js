import { readSystemDocument, writeSystemDocument } from './contentService.js'

const DEFAULT_PUBLIC_LOGS = {
  entries: [],
  updatedAt: null,
}

const DEFAULT_SECURE_LOGS = {
  entries: [],
  updatedAt: null,
}

const PUBLIC_LOG_LIMIT = 250
const SECURE_LOG_LIMIT = 250

function nowIso() {
  return new Date().toISOString()
}

function normalizeLogEntry(entry = {}) {
  return {
    id:
      entry.id ?? `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    level: entry.level ?? 'info',
    scope: entry.scope ?? 'system',
    title: entry.title ?? 'Log entry',
    message: entry.message ?? '',
    route: entry.route ?? '',
    details: entry.details ?? null,
    actor: entry.actor ?? '',
    createdAt: entry.createdAt ?? nowIso(),
  }
}

async function appendLog(fileName, fallback, limit, entry) {
  const document = await readSystemDocument(fileName, fallback)
  const normalized = normalizeLogEntry(entry)
  document.entries = [normalized, ...(document.entries ?? [])].slice(0, limit)
  document.updatedAt = normalized.createdAt
  await writeSystemDocument(fileName, document)
  return normalized
}

export async function logPublicEvent(entry) {
  return appendLog('logs.json', DEFAULT_PUBLIC_LOGS, PUBLIC_LOG_LIMIT, entry)
}

export async function logSecureEvent(entry) {
  return appendLog(
    'secure-logs.json',
    DEFAULT_SECURE_LOGS,
    SECURE_LOG_LIMIT,
    entry
  )
}

export async function logOperatorEvent(entry) {
  const summary = await logPublicEvent({
    ...entry,
    scope: entry.scope ?? 'operator',
  })

  await logSecureEvent({
    ...entry,
    scope: entry.scope ?? 'operator',
  })

  return summary
}

export async function getPublicLogs(limit = 100) {
  const document = await readSystemDocument('logs.json', DEFAULT_PUBLIC_LOGS)
  return {
    entries: (document.entries ?? []).slice(0, limit),
    updatedAt: document.updatedAt ?? null,
  }
}

export async function getSecureLogs(limit = 100) {
  const document = await readSystemDocument(
    'secure-logs.json',
    DEFAULT_SECURE_LOGS
  )
  return {
    entries: (document.entries ?? []).slice(0, limit),
    updatedAt: document.updatedAt ?? null,
  }
}
