import {
  canHandleRemoteOperator,
  getRemoteCommandUnavailableReason,
  handleRemoteOperatorCommand,
} from './remoteOperator.js'

const SESSION_COOKIE = 'myappai_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 12
const DEFAULT_OLLAMA_MODEL = 'llama3.2:3b'
const TELEGRAM_API_ORIGIN = 'https://api.telegram.org'
const TELEGRAM_SECRET_HEADER = 'x-telegram-bot-api-secret-token'
const OLLAMA_PROXY_SECRET_HEADER = 'x-ollama-proxy-secret'
const MAX_TELEGRAM_REPLY_LENGTH = 3900
const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
}
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function jsonResponse(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...headers,
    },
  })
}

function toBase64Url(value) {
  const bytes =
    typeof value === 'string'
      ? textEncoder.encode(value)
      : new Uint8Array(value)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function fromBase64Url(value) {
  const normalized = String(value)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=')

  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

async function importSigningKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
}

async function signValue(value, secret) {
  const key = await importSigningKey(secret)
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    textEncoder.encode(value)
  )

  return toBase64Url(signature)
}

async function verifySignedValue(value, signature, secret) {
  const expected = await signValue(value, secret)
  return signature === expected
}

function parseCookies(request) {
  const header = request.headers.get('cookie') ?? ''

  return Object.fromEntries(
    header
      .split(';')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [key, ...rest] = entry.split('=')
        return [key, rest.join('=')]
      })
  )
}

function createSetCookie(value, maxAge) {
  const parts = [
    `${SESSION_COOKIE}=${value}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Secure',
    `Max-Age=${maxAge}`,
  ]

  return parts.join('; ')
}

function isConfiguredValue(value) {
  const normalized = String(value ?? '').trim()

  return (
    normalized.length > 0 &&
    !normalized.startsWith('your-') &&
    !normalized.startsWith('replace-with-')
  )
}

function getConfiguredEnvironmentValue(env, ...names) {
  for (const name of names) {
    const value = String(env[name] ?? '').trim()

    if (isConfiguredValue(value)) {
      return value
    }
  }

  return ''
}

function getAdminEmail(env) {
  return String(env.ADMIN_EMAIL ?? '')
    .trim()
    .toLowerCase()
}

function getAdminPasscode(env) {
  return String(env.ADMIN_PASSCODE ?? '5555').trim()
}

function getAdminApiKey(env) {
  return String(env.ADMIN_API_KEY ?? env.X_ADMIN_KEY ?? '').trim()
}

function getSessionSecret(env) {
  return String(env.ADMIN_SESSION_SECRET ?? '').trim()
}

function getSecureLogsCode(env) {
  return String(env.LOGS_ACCESS_CODE ?? '8888').trim()
}

async function createSignedSession(email, env) {
  const secret = getSessionSecret(env)

  if (!secret) {
    throw new Error(
      'ADMIN_SESSION_SECRET must be configured to enable admin login.'
    )
  }

  const payload = {
    email,
    authMode: 'session',
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }
  const encodedPayload = toBase64Url(JSON.stringify(payload))
  const signature = await signValue(encodedPayload, secret)

  return `${encodedPayload}.${signature}`
}

async function readSignedSession(request, env) {
  const secret = getSessionSecret(env)

  if (!secret) {
    return null
  }

  const cookies = parseCookies(request)
  const signedToken = cookies[SESSION_COOKIE]

  if (!signedToken) {
    return null
  }

  const [encodedPayload, signature] = signedToken.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const valid = await verifySignedValue(encodedPayload, signature, secret)

  if (!valid) {
    return null
  }

  try {
    const payload = JSON.parse(
      textDecoder.decode(fromBase64Url(encodedPayload))
    )

    if (!payload?.email || !payload?.exp) {
      return null
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }

    return {
      email: String(payload.email).trim().toLowerCase(),
      authMode: payload.authMode ?? 'session',
    }
  } catch {
    return null
  }
}

function validateInlineAdminAuth(request, env) {
  const configuredEmail = getAdminEmail(env)
  const configuredCode = getAdminPasscode(env)
  const configuredKey = getAdminApiKey(env)
  const adminKey = String(request.headers.get('x-admin-key') ?? '').trim()
  const email = String(request.headers.get('x-admin-email') ?? '')
    .trim()
    .toLowerCase()
  const code = String(request.headers.get('x-admin-code') ?? '').trim()

  if (configuredKey && adminKey && configuredKey === adminKey) {
    return {
      ok: true,
      email: configuredEmail || 'api-key-admin',
      authMode: 'api-key',
    }
  }

  if (!configuredEmail || !configuredCode) {
    return {
      ok: false,
      message:
        'ADMIN_EMAIL and ADMIN_PASSCODE must be configured before admin login can be used.',
    }
  }

  if (email !== configuredEmail || code !== configuredCode) {
    return {
      ok: false,
      message: 'Valid admin credentials are required.',
    }
  }

  return {
    ok: true,
    email: configuredEmail,
    authMode: 'email-passcode',
  }
}

async function requireAdmin(request, env) {
  const session = await readSignedSession(request, env)

  if (session) {
    return { ok: true, admin: session }
  }

  const fallback = validateInlineAdminAuth(request, env)

  if (!fallback.ok) {
    return {
      ok: false,
      response: jsonResponse(
        {
          error: 'Admin access required',
          message: fallback.message,
        },
        403
      ),
    }
  }

  return {
    ok: true,
    admin: {
      email: fallback.email,
      authMode: fallback.authMode,
    },
  }
}

function buildAnalyticsSnapshot() {
  return {
    visitors: 0,
    pageViews: 0,
    leads: 0,
    purchases: 0,
    conversionRate: 0,
    revenue: 0,
    dataSources: {
      visitors: 'edge-fallback',
      leads: 'edge-fallback',
      revenue: 'edge-fallback',
    },
    models: [],
    traffic: {
      queuedTopics: 0,
      publishedPages: 0,
    },
    aiActivity: {
      commandsToday: 0,
      deploymentsToday: 0,
      lastAction: 'idle',
    },
    contentCounts: {
      pages: 0,
      blog: 0,
      products: 0,
      system: 0,
    },
  }
}

function buildPublicSiteSnapshot(env) {
  return {
    analytics: buildAnalyticsSnapshot(),
    brand: {
      displayName: env.APP_NAME ?? 'MyAppAI',
      url: env.SITE_URL ?? 'https://myappai.net',
      category: 'AI operator platform for research, code, and deployment',
    },
    proof: {
      liveDataOnly: false,
      leadCaptureReady: true,
      adminSurfaceReady: true,
      trafficEngineReady: false,
      contentCounts: {
        pages: 0,
        blog: 0,
        products: 0,
        system: 0,
      },
      modelsOnline: 0,
      latestDeployment: null,
    },
    funnel: {
      mode: 'operator_login',
      contactMode: 'lead_form',
      contactPath: '/admin/login',
      primaryOfferSlug: null,
      implementationOfferSlug: null,
      enterpriseOfferSlug: null,
      offers: [],
    },
  }
}

function getPublicAssistantProvider(env) {
  const provider = String(env.PUBLIC_ASSISTANT_PROVIDER ?? 'fallback')
    .trim()
    .toLowerCase()

  if (provider === 'ollama' || provider === 'local' || provider === 'free') {
    return 'ollama'
  }

  return 'fallback'
}

function getOllamaApiUrl(env) {
  return getConfiguredEnvironmentValue(env, 'OLLAMA_API_URL')
}

function getOllamaModel(env) {
  return (
    getConfiguredEnvironmentValue(env, 'OLLAMA_MODEL') || DEFAULT_OLLAMA_MODEL
  )
}

function getOllamaProxySecret(env) {
  return getConfiguredEnvironmentValue(env, 'OLLAMA_PROXY_SECRET')
}

function getTelegramBotToken(env) {
  return getConfiguredEnvironmentValue(env, 'TELEGRAM_BOT_TOKEN')
}

function getTelegramWebhookSecret(env) {
  return getConfiguredEnvironmentValue(env, 'TELEGRAM_WEBHOOK_SECRET')
}

function getTelegramAllowedChatIds(env) {
  return new Set(
    String(env.TELEGRAM_ALLOWED_CHAT_IDS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  )
}

function isAllowedTelegramChatId(env, chatId) {
  const allowedChatIds = getTelegramAllowedChatIds(env)

  return allowedChatIds.size === 0 || allowedChatIds.has(String(chatId))
}

function normalizeAssistantHistory(history) {
  return Array.isArray(history)
    ? history
        .filter(
          (entry) =>
            entry &&
            (entry.role === 'user' || entry.role === 'assistant') &&
            typeof entry.content === 'string'
        )
        .slice(-6)
        .map((entry) => ({
          role: entry.role,
          content: entry.content.slice(0, 1200),
        }))
    : []
}

function buildAssistantSuggestions() {
  return [
    { label: 'Open admin', href: '/admin/login' },
    { label: 'View docs', href: '/' },
  ]
}

function buildEdgeAssistantFallback(env, message) {
  const appName = String(env.APP_NAME ?? 'myappai').trim() || 'myappai'
  const lowerMessage = String(message ?? '').toLowerCase()

  if (
    lowerMessage.includes('deploy') ||
    lowerMessage.includes('admin') ||
    lowerMessage.includes('dashboard')
  ) {
    return {
      reply: `${appName} can sign you into the operator dashboard, review system health, and guide deploy-ready changes. Open /admin/login to continue in the full workspace.`,
      suggestions: buildAssistantSuggestions(),
      source: 'fallback',
    }
  }

  return {
    reply: `${appName} is running with the edge assistant fallback right now. Ask about setup, deployment, or how to route work through the operator dashboard and I will point you in the right direction.`,
    suggestions: buildAssistantSuggestions(),
    source: 'fallback',
  }
}

function buildEdgeAssistantMessages(env, message, history) {
  return [
    {
      role: 'system',
      content: `You are the public-facing assistant for ${
        env.APP_NAME ?? 'myappai'
      }. Reply in plain text only. Keep answers concise, practical, and grounded in the website context. Mention the admin dashboard when the user is asking about live edits, deployment, or operator workflows.`,
    },
    ...normalizeAssistantHistory(history),
    {
      role: 'user',
      content: String(message ?? '').trim(),
    },
  ]
}

function extractOllamaReply(payload) {
  return String(payload?.message?.content ?? payload?.response ?? '').trim()
}

function normalizeOllamaProxyModel(model, env) {
  const normalized = String(model ?? '').trim()

  if (!normalized) {
    return getOllamaModel(env)
  }

  return normalized.startsWith('ollama/')
    ? normalized.slice('ollama/'.length)
    : normalized
}

function resolveOllamaProxyUpstreamPath(pathname) {
  const prefix = pathname.startsWith('/api/public/ollama')
    ? '/api/public/ollama'
    : '/api/ollama'
  const suffix = pathname.slice(prefix.length).replace(/\/+$/u, '')

  if (!suffix) {
    return '/api/generate'
  }

  if (suffix === '/status') {
    return '/status'
  }

  if (suffix === '/generate' || suffix === '/api/generate') {
    return '/api/generate'
  }

  if (suffix === '/chat' || suffix === '/api/chat') {
    return '/api/chat'
  }

  if (suffix === '/tags' || suffix === '/api/tags') {
    return '/api/tags'
  }

  throw new Error(
    'Unsupported Ollama proxy path. Use /api/ollama, /api/ollama/chat, /api/ollama/generate, or /api/ollama/tags.'
  )
}

function buildOllamaProxyStatus(env) {
  return {
    ok: true,
    ollamaConfigured: Boolean(getOllamaApiUrl(env)),
    proxySecretConfigured: Boolean(getOllamaProxySecret(env)),
    model: getOllamaModel(env),
  }
}

function cloneUpstreamHeaders(headers) {
  const cloned = new Headers()

  headers.forEach((value, key) => {
    const normalizedKey = key.toLowerCase()

    if (
      normalizedKey === 'content-length' ||
      normalizedKey === 'transfer-encoding' ||
      normalizedKey === 'connection'
    ) {
      return
    }

    cloned.set(key, value)
  })

  return cloned
}

function createOllamaProxyErrorResponse(message, status = 400) {
  return jsonResponse(
    {
      ok: false,
      message,
    },
    status
  )
}

async function handleOllamaProxy(request, env, pathname) {
  const configuredSecret = getOllamaProxySecret(env)

  if (configuredSecret) {
    const suppliedSecret = String(
      request.headers.get(OLLAMA_PROXY_SECRET_HEADER) ?? ''
    ).trim()

    if (suppliedSecret !== configuredSecret) {
      return createOllamaProxyErrorResponse(
        'Valid Ollama proxy secret required.',
        403
      )
    }
  }

  const apiUrl = getOllamaApiUrl(env)

  if (!apiUrl) {
    return createOllamaProxyErrorResponse(
      'OLLAMA_API_URL must be configured before the proxy can forward requests.',
      503
    )
  }

  let upstreamPath

  try {
    upstreamPath = resolveOllamaProxyUpstreamPath(pathname)
  } catch (error) {
    return createOllamaProxyErrorResponse(
      error instanceof Error ? error.message : String(error),
      404
    )
  }

  if (upstreamPath === '/status') {
    return jsonResponse(buildOllamaProxyStatus(env))
  }

  const targetUrl = `${apiUrl.replace(/\/+$/u, '')}${upstreamPath}`

  if (request.method === 'GET' || request.method === 'HEAD') {
    if (upstreamPath !== '/api/tags') {
      return createOllamaProxyErrorResponse(
        'Use GET only with /api/ollama/status or /api/ollama/tags.',
        405
      )
    }

    const upstreamResponse = await fetch(targetUrl, {
      method: request.method,
    })

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: cloneUpstreamHeaders(upstreamResponse.headers),
    })
  }

  if (upstreamPath === '/api/tags') {
    return createOllamaProxyErrorResponse('Use GET with /api/ollama/tags.', 405)
  }

  const payload = await request.json().catch(() => null)

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return createOllamaProxyErrorResponse(
      'Ollama proxy request body must be a JSON object.',
      400
    )
  }

  const normalizedPayload = {
    ...payload,
  }

  if (upstreamPath !== '/api/tags') {
    normalizedPayload.model = normalizeOllamaProxyModel(
      normalizedPayload.model,
      env
    )
  }

  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(normalizedPayload),
  })

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: cloneUpstreamHeaders(upstreamResponse.headers),
  })
}

async function answerEdgePublicAssistant(env, { message, history = [] } = {}) {
  if (typeof message !== 'string' || !message.trim()) {
    throw new Error('A message is required.')
  }

  const trimmedMessage = message.trim()
  const fallback = buildEdgeAssistantFallback(env, trimmedMessage)

  if (getPublicAssistantProvider(env) !== 'ollama') {
    return fallback
  }

  const apiUrl = getOllamaApiUrl(env)

  if (!apiUrl) {
    return fallback
  }

  try {
    const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/api/chat`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: getOllamaModel(env),
        stream: false,
        messages: buildEdgeAssistantMessages(env, trimmedMessage, history),
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama request failed with ${response.status}.`)
    }

    const payload = await response.json()
    const reply = extractOllamaReply(payload)

    if (!reply) {
      return fallback
    }

    return {
      reply,
      suggestions: fallback.suggestions,
      source: 'ollama',
    }
  } catch {
    return fallback
  }
}

function getTelegramCommandName(text) {
  const normalized = String(text ?? '').trim()

  if (!normalized.startsWith('/')) {
    return ''
  }

  const token = normalized.split(/\s+/, 1)[0]
  const [command] = token.split('@', 1)

  return command.toLowerCase()
}

function extractTelegramMessage(update) {
  const message =
    update?.message ??
    update?.edited_message ??
    update?.channel_post ??
    update?.edited_channel_post ??
    null

  if (!message?.chat?.id) {
    return null
  }

  const text = String(message.text ?? message.caption ?? '').trim()

  if (!text) {
    return null
  }

  return {
    chatId: String(message.chat.id),
    text,
  }
}

function truncateTelegramText(text) {
  const normalized = String(text ?? '').trim()

  if (normalized.length <= MAX_TELEGRAM_REPLY_LENGTH) {
    return normalized
  }

  return `${normalized.slice(0, MAX_TELEGRAM_REPLY_LENGTH - 3).trim()}...`
}

function buildTelegramBridgeStatus(env) {
  return {
    ok: true,
    botTokenConfigured: Boolean(getTelegramBotToken(env)),
    webhookSecretConfigured: Boolean(getTelegramWebhookSecret(env)),
    allowedChatIdsConfigured: getTelegramAllowedChatIds(env).size > 0,
    ollamaConfigured: Boolean(getOllamaApiUrl(env)),
    provider: getPublicAssistantProvider(env),
    model: getOllamaModel(env),
  }
}

function buildTelegramWelcomeReply(env) {
  return `${String(env.APP_NAME ?? 'myappai').trim() || 'myappai'} is connected. Send a message and I will answer with the same Ollama-first assistant path configured for the site. Use /status to confirm the active model.`
}

function buildTelegramStatusReply(env) {
  return `${String(env.APP_NAME ?? 'myappai').trim() || 'myappai'} is online.\nProvider: ${getPublicAssistantProvider(env)}\nModel: ${getOllamaModel(env)}\nSite: ${env.SITE_URL ?? 'https://myappai.net'}`
}

async function sendTelegramMessage(env, { chatId, text }) {
  const token = getTelegramBotToken(env)

  if (!token) {
    throw new Error(
      'TELEGRAM_BOT_TOKEN must be configured before Telegram delivery can work.'
    )
  }

  const response = await fetch(
    `${TELEGRAM_API_ORIGIN}/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: truncateTelegramText(text),
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Telegram sendMessage failed with ${response.status}.`)
  }

  return response.json()
}

async function handleTelegramWebhook(request, env) {
  const secret = getTelegramWebhookSecret(env)

  if (secret) {
    const suppliedSecret = String(
      request.headers.get(TELEGRAM_SECRET_HEADER) ?? ''
    ).trim()

    if (suppliedSecret !== secret) {
      return jsonResponse(
        {
          ok: false,
          message: 'Valid Telegram webhook secret required.',
        },
        403
      )
    }
  }

  if (!getTelegramBotToken(env)) {
    return jsonResponse(
      {
        ok: false,
        message:
          'TELEGRAM_BOT_TOKEN must be configured before Telegram delivery can work.',
      },
      503
    )
  }

  const update = await request.json().catch(() => ({}))
  const incoming = extractTelegramMessage(update)

  if (!incoming) {
    return jsonResponse({
      ok: true,
      ignored: true,
      reason: 'No text message found in the update.',
    })
  }

  if (!isAllowedTelegramChatId(env, incoming.chatId)) {
    return jsonResponse({
      ok: true,
      ignored: true,
      reason: 'Chat is not allowed for this bot.',
      chatId: incoming.chatId,
    })
  }

  let replyText = ''
  let source = 'system'
  const command = getTelegramCommandName(incoming.text)

  if (command === '/start' || command === '/help') {
    replyText = buildTelegramWelcomeReply(env)
  } else if (command === '/status') {
    replyText = buildTelegramStatusReply(env)
  } else {
    const assistant = await answerEdgePublicAssistant(env, {
      message: incoming.text,
    })

    replyText = assistant.reply
    source = assistant.source
  }

  await sendTelegramMessage(env, {
    chatId: incoming.chatId,
    text: replyText,
  })

  return jsonResponse({
    ok: true,
    delivered: true,
    chatId: incoming.chatId,
    source,
  })
}

function buildDeploymentsSnapshot() {
  return {
    history: [
      {
        id: `edge-${Date.now()}`,
        status: 'live',
        branch: 'main',
        message: 'Pages edge API is active on myappai.net.',
        finishedAt: new Date().toISOString(),
      },
    ],
    commits: [],
  }
}

function buildRevenueSnapshot() {
  return {
    leads: [],
    payments: [],
    totals: {
      openLeads: 0,
      completedPayments: 0,
      revenue: 0,
    },
  }
}

function buildLogsSnapshot(scope = 'operator') {
  return {
    entries: [
      {
        id: `${scope}-${Date.now()}`,
        level: 'info',
        scope,
        title: 'Pages edge API active',
        message:
          'This Pages deployment is serving API traffic from the edge fallback runtime.',
        createdAt: new Date().toISOString(),
      },
    ],
  }
}

function buildMetricsSnapshot() {
  return {
    tasks: 0,
    cpu: 0,
    memory: 0,
    deploymentsToday: 0,
  }
}

function getCommandUnavailableReason(request, env) {
  const remoteReason = getRemoteCommandUnavailableReason(env)

  if (remoteReason) {
    return remoteReason
  }

  const origin = String(env.ADMIN_API_ORIGIN ?? '').trim()

  if (!origin) {
    return 'Set ADMIN_API_ORIGIN to an external repo-backed operator API.'
  }

  try {
    const requestOrigin = new URL(request.url).origin
    const adminOrigin = new URL(origin).origin

    if (adminOrigin === requestOrigin) {
      return 'ADMIN_API_ORIGIN points back to this Pages site. It must point to an external repo-backed operator API.'
    }
  } catch {
    return 'ADMIN_API_ORIGIN is not a valid URL.'
  }

  return 'The configured ADMIN_API_ORIGIN is not proxying this deployment to a repo-backed operator API.'
}

function buildUnavailableCommandResponse(request, env) {
  return {
    status: 'unavailable',
    mode: 'edge-fallback',
    summary:
      'Live operator actions need a repo-backed runtime before they can edit files or deploy.',
    unavailableReason: getCommandUnavailableReason(request, env),
    nextSteps: [
      'Keep using myappai.net for sign-in and dashboard access.',
      'Point ADMIN_API_ORIGIN to an external repo-backed operator API for file edits and deploy actions.',
    ],
    deployment: null,
    affectedPaths: [],
    sources: [],
  }
}

function isProxyableOrigin(request, env) {
  const origin = String(env.ADMIN_API_ORIGIN ?? '').trim()

  if (!origin) {
    return false
  }

  try {
    const requestOrigin = new URL(request.url).origin
    return new URL(origin).origin !== requestOrigin
  } catch {
    return false
  }
}

function isEdgeHandledApiPath(pathname) {
  return (
    pathname === '/api/health' ||
    pathname.startsWith('/api/public/') ||
    pathname === '/api/ollama' ||
    pathname.startsWith('/api/ollama/')
  )
}

function proxyToAdmin(request, env) {
  const incomingUrl = new URL(request.url)
  const targetUrl = new URL(
    `${incomingUrl.pathname}${incomingUrl.search}`,
    env.ADMIN_API_ORIGIN
  )

  return fetch(
    new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'follow',
    })
  )
}

async function handleAdminLogin(request, env) {
  const body = await request.json().catch(() => ({}))
  const configuredEmail = getAdminEmail(env)
  const configuredCode = getAdminPasscode(env)
  const configuredKey = getAdminApiKey(env)
  const email = String(body.email ?? '')
    .trim()
    .toLowerCase()
  const code = String(body.code ?? '').trim()
  const adminKey = String(body.adminKey ?? '').trim()

  if (configuredKey && adminKey && adminKey === configuredKey) {
    const signedSession = await createSignedSession(
      configuredEmail || 'api-key-admin',
      env
    )

    return jsonResponse(
      {
        ok: true,
        adminEmail: configuredEmail || 'api-key-admin',
        authMode: 'api-key',
      },
      200,
      {
        'set-cookie': createSetCookie(signedSession, SESSION_TTL_SECONDS),
      }
    )
  }

  if (!configuredEmail || !configuredCode) {
    return jsonResponse(
      {
        ok: false,
        message:
          'ADMIN_EMAIL and ADMIN_PASSCODE must be configured before admin login can be used.',
      },
      500
    )
  }

  if (email !== configuredEmail || code !== configuredCode) {
    return jsonResponse(
      {
        ok: false,
        message: 'Valid admin credentials are required.',
      },
      403
    )
  }

  const signedSession = await createSignedSession(configuredEmail, env)

  return jsonResponse(
    {
      ok: true,
      adminEmail: configuredEmail,
      authMode: 'email-passcode',
    },
    200,
    {
      'set-cookie': createSetCookie(signedSession, SESSION_TTL_SECONDS),
    }
  )
}

async function handleAdminSession(request, env) {
  const auth = await requireAdmin(request, env)

  if (!auth.ok) {
    return auth.response
  }

  return jsonResponse({
    ok: true,
    adminEmail: auth.admin.email,
    authMode: auth.admin.authMode,
  })
}

function handleAdminLogout() {
  return jsonResponse(
    {
      ok: true,
    },
    200,
    {
      'set-cookie': createSetCookie('', 0),
    }
  )
}

async function handleApi(request, env) {
  const url = new URL(request.url)
  const { pathname } = url
  const proxied = isProxyableOrigin(request, env)

  if (proxied && !isEdgeHandledApiPath(pathname)) {
    return proxyToAdmin(request, env)
  }

  if (pathname === '/api/health') {
    return jsonResponse({
      status: 'ok',
      app: env.APP_NAME ?? 'myappai',
      mode: proxied ? 'repo-proxy' : 'pages-edge-fallback',
    })
  }

  if (pathname === '/api/public/site' && request.method === 'GET') {
    return jsonResponse(buildPublicSiteSnapshot(env))
  }

  if (pathname === '/api/public/events' && request.method === 'POST') {
    return jsonResponse({ ok: true, stored: false, mode: 'edge-fallback' })
  }

  if (pathname === '/api/public/leads' && request.method === 'POST') {
    const lead = await request.json().catch(() => ({}))

    return jsonResponse(
      {
        ok: true,
        lead: {
          id: `lead-${Date.now()}`,
          ...lead,
          status: 'new',
          createdAt: new Date().toISOString(),
        },
      },
      201
    )
  }

  if (pathname === '/api/public/assistant' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}))

    try {
      const result = await answerEdgePublicAssistant(env, {
        message: body.message ?? '',
        history: Array.isArray(body.history) ? body.history : [],
      })

      return jsonResponse(result)
    } catch (error) {
      return jsonResponse(
        {
          ok: false,
          message: error instanceof Error ? error.message : String(error),
        },
        400
      )
    }
  }

  if (pathname === '/api/public/telegram/status' && request.method === 'GET') {
    return jsonResponse(buildTelegramBridgeStatus(env))
  }

  if (
    pathname === '/api/public/telegram/webhook' &&
    request.method === 'POST'
  ) {
    return handleTelegramWebhook(request, env)
  }

  if (
    (pathname === '/api/ollama' || pathname.startsWith('/api/ollama/')) &&
    ['GET', 'HEAD', 'POST'].includes(request.method)
  ) {
    return handleOllamaProxy(request, env, pathname)
  }

  if (
    (pathname === '/api/public/ollama' ||
      pathname.startsWith('/api/public/ollama/')) &&
    ['GET', 'HEAD', 'POST'].includes(request.method)
  ) {
    return handleOllamaProxy(request, env, pathname)
  }

  if (pathname === '/api/admin/login' && request.method === 'POST') {
    return handleAdminLogin(request, env)
  }

  if (pathname === '/api/admin/session' && request.method === 'GET') {
    return handleAdminSession(request, env)
  }

  if (pathname === '/api/admin/logout' && request.method === 'POST') {
    return handleAdminLogout()
  }

  const auth = await requireAdmin(request, env)

  if (!auth.ok) {
    return auth.response
  }

  if (pathname === '/api/analytics' && request.method === 'GET') {
    return jsonResponse(buildAnalyticsSnapshot())
  }

  if (pathname === '/api/deployments' && request.method === 'GET') {
    return jsonResponse(buildDeploymentsSnapshot())
  }

  if (pathname === '/api/content' && request.method === 'GET') {
    return jsonResponse({})
  }

  if (pathname === '/api/metrics' && request.method === 'GET') {
    return jsonResponse(buildMetricsSnapshot())
  }

  if (pathname === '/api/logs' && request.method === 'GET') {
    return jsonResponse(buildLogsSnapshot('operator'))
  }

  if (pathname === '/api/logs/client' && request.method === 'POST') {
    return jsonResponse({ ok: true })
  }

  if (pathname === '/api/logs/secure' && request.method === 'GET') {
    if (url.searchParams.get('code') !== getSecureLogsCode(env)) {
      return jsonResponse(
        {
          ok: false,
          message: 'Valid secure logs code required.',
        },
        403
      )
    }

    return jsonResponse(buildLogsSnapshot('secure'))
  }

  if (pathname === '/api/heal' && request.method === 'POST') {
    return jsonResponse({
      ok: true,
      result: {
        status: 'idle',
        warnings: [],
      },
    })
  }

  if (pathname === '/api/revenue' && request.method === 'GET') {
    return jsonResponse(buildRevenueSnapshot())
  }

  if (
    pathname.startsWith('/api/revenue/leads/') &&
    request.method === 'PATCH'
  ) {
    const leadId = pathname.split('/').pop() ?? ''
    const patch = await request.json().catch(() => ({}))

    return jsonResponse({
      ok: true,
      lead: {
        id: decodeURIComponent(leadId),
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  if (pathname === '/api/command' && request.method === 'POST') {
    if (canHandleRemoteOperator(env)) {
      return handleRemoteOperatorCommand(request, env)
    }

    return jsonResponse(buildUnavailableCommandResponse(request, env))
  }

  return jsonResponse(
    {
      ok: false,
      message: 'API route not implemented in the Pages edge fallback.',
    },
    404
  )
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env)
    }

    return env.ASSETS.fetch(request)
  },
}
