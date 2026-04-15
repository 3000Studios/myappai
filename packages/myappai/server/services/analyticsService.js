import {
  getContentBundle,
  getSystemDefault,
  readSystemDocument,
  writeSystemDocument,
} from './contentService.js'
import { listAvailableModels } from './ollamaService.js'

const DEFAULT_ANALYTICS = {
  aiActivity: {
    commandsToday: 0,
    deploymentsToday: 0,
    lastAction: 'idle',
    lastMode: 'idle',
  },
  updatedAt: null,
}

const DEFAULT_EVENTS = {
  events: [],
  updatedAt: null,
}

const DEFAULT_LEADS = {
  leads: [],
  updatedAt: null,
}

const EVENT_TYPES = new Set([
  'page_view',
  'cta_click',
  'lead_submit',
  'operator_prompt',
  'operator_result',
])

function nowIso() {
  return new Date().toISOString()
}

function normalizeActivityValue(value, fallback = 'idle') {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (value && typeof value === 'object') {
    if (typeof value.action === 'string' && value.action.trim()) {
      return value.action.trim()
    }

    if (typeof value.mode === 'string' && value.mode.trim()) {
      return value.mode.trim()
    }

    return fallback
  }

  return fallback
}

function normalizeEventType(type) {
  return EVENT_TYPES.has(type) ? type : 'page_view'
}

export async function recordAiActivity(action, mode = 'safe_action') {
  const analytics = await readSystemDocument(
    'analytics.json',
    DEFAULT_ANALYTICS
  )
  analytics.aiActivity = analytics.aiActivity ?? DEFAULT_ANALYTICS.aiActivity
  analytics.aiActivity.commandsToday += 1
  analytics.aiActivity.lastAction = normalizeActivityValue(
    action,
    'safe_action'
  )
  analytics.aiActivity.lastMode = normalizeActivityValue(mode, 'safe_action')
  analytics.updatedAt = nowIso()
  await writeSystemDocument('analytics.json', analytics)
  return analytics
}

export async function recordDeploymentActivity() {
  const analytics = await readSystemDocument(
    'analytics.json',
    DEFAULT_ANALYTICS
  )
  analytics.aiActivity = analytics.aiActivity ?? DEFAULT_ANALYTICS.aiActivity
  analytics.aiActivity.deploymentsToday += 1
  analytics.updatedAt = nowIso()
  await writeSystemDocument('analytics.json', analytics)
  return analytics
}

export async function recordSiteEvent(eventPayload) {
  const events = await readSystemDocument('events.json', DEFAULT_EVENTS)
  const nextEvent = {
    id: `${eventPayload.type ?? 'event'}-${Date.now()}`,
    type: normalizeEventType(eventPayload.type),
    path: eventPayload.path ?? '/',
    sessionId: eventPayload.sessionId ?? 'anonymous',
    referrer: eventPayload.referrer ?? '',
    ctaId: eventPayload.ctaId ?? '',
    intent: eventPayload.intent ?? '',
    stage: eventPayload.stage ?? '',
    details: eventPayload.details ?? null,
    createdAt: nowIso(),
  }

  events.events = [nextEvent, ...(events.events ?? [])].slice(0, 5000)
  events.updatedAt = nextEvent.createdAt
  await writeSystemDocument('events.json', events)
  return nextEvent
}

export async function recordLead(leadPayload) {
  if (!leadPayload.email || !String(leadPayload.email).includes('@')) {
    throw new Error('A valid email address is required.')
  }

  const leads = await readSystemDocument('leads.json', DEFAULT_LEADS)
  const createdAt = nowIso()
  const nextLead = {
    id: `lead-${Date.now()}`,
    name: String(leadPayload.name ?? '').trim(),
    email: String(leadPayload.email ?? '')
      .trim()
      .toLowerCase(),
    company: String(leadPayload.company ?? '').trim(),
    interest: String(leadPayload.interest ?? '').trim(),
    notes: String(leadPayload.notes ?? '').trim(),
    sourcePath: String(leadPayload.sourcePath ?? '/').trim() || '/',
    ctaId: String(leadPayload.ctaId ?? '').trim(),
    intent: String(leadPayload.intent ?? 'operator_interest').trim(),
    stage: String(leadPayload.stage ?? 'new').trim(),
    status: 'open',
    createdAt,
    updatedAt: createdAt,
  }

  leads.leads = [nextLead, ...(leads.leads ?? [])].slice(0, 1000)
  leads.updatedAt = nextLead.createdAt
  await writeSystemDocument('leads.json', leads)
  return nextLead
}

export async function getLeadSnapshot(limit = 100) {
  const leads = await readSystemDocument('leads.json', DEFAULT_LEADS)
  return (leads.leads ?? []).slice(0, limit)
}

export async function updateLeadStage(leadId, patch) {
  const leads = await readSystemDocument('leads.json', DEFAULT_LEADS)
  const leadIndex = (leads.leads ?? []).findIndex(
    (entry) => entry.id === leadId
  )

  if (leadIndex < 0) {
    throw new Error(`Lead "${leadId}" was not found.`)
  }

  const updatedAt = nowIso()
  leads.leads[leadIndex] = {
    ...leads.leads[leadIndex],
    stage: patch.stage
      ? String(patch.stage).trim()
      : leads.leads[leadIndex].stage,
    status: patch.status
      ? String(patch.status).trim()
      : leads.leads[leadIndex].status,
    notes:
      typeof patch.notes === 'string'
        ? patch.notes.trim()
        : leads.leads[leadIndex].notes,
    updatedAt,
  }

  leads.updatedAt = updatedAt
  await writeSystemDocument('leads.json', leads)
  return leads.leads[leadIndex]
}

export async function getAnalyticsSnapshot() {
  const [analytics, bundle, models, traffic, events, leads] = await Promise.all(
    [
      readSystemDocument('analytics.json', DEFAULT_ANALYTICS),
      getContentBundle(),
      listAvailableModels(),
      readSystemDocument('traffic.json', getSystemDefault('traffic.json')),
      readSystemDocument('events.json', DEFAULT_EVENTS),
      readSystemDocument('leads.json', DEFAULT_LEADS),
    ]
  )

  const pageViewEvents = (events.events ?? []).filter(
    (entry) => entry.type === 'page_view'
  )
  const ctaClickEvents = (events.events ?? []).filter(
    (entry) => entry.type === 'cta_click'
  )
  const visitorIds = new Set(
    pageViewEvents.map((entry) => entry.sessionId).filter(Boolean)
  )

  return {
    ...analytics,
    aiActivity: {
      ...(analytics.aiActivity ?? DEFAULT_ANALYTICS.aiActivity),
      lastAction: normalizeActivityValue(
        analytics.aiActivity?.lastAction,
        'idle'
      ),
      lastMode: normalizeActivityValue(analytics.aiActivity?.lastMode, 'idle'),
    },
    visitors: visitorIds.size,
    pageViews: pageViewEvents.length,
    leads: (leads.leads ?? []).length,
    purchases: 0,
    ctaClicks: ctaClickEvents.length,
    conversionRate: 0,
    revenue: 0,
    contentCounts: {
      pages: bundle.pages.length,
      blog: bundle.blog.length,
      products: bundle.products.length,
      system: bundle.system.length,
    },
    traffic: {
      queuedTopics: traffic.queue?.length ?? 0,
      publishedPages: traffic.published?.length ?? 0,
      topQueuedTopic: traffic.queue?.[0] ?? null,
    },
    models,
    dataSources: {
      visitors: 'content/system/events.json',
      leads: 'content/system/leads.json',
      deployments: 'content/system/deployments.json',
    },
  }
}
