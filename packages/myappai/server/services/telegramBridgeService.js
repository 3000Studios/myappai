import { SITE_DISPLAY_NAME, SITE_URL } from '../../frontend/src/siteMeta.js'
import { answerPublicAssistant } from './assistantService.js'

const TELEGRAM_API_ORIGIN = 'https://api.telegram.org'
const TELEGRAM_SECRET_HEADER = 'x-telegram-bot-api-secret-token'
const MAX_TELEGRAM_REPLY_LENGTH = 3900

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

function getAllowedTelegramChatIds() {
  return new Set(
    String(process.env.TELEGRAM_ALLOWED_CHAT_IDS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  )
}

function isAllowedChatId(chatId) {
  const allowedChatIds = getAllowedTelegramChatIds()

  return allowedChatIds.size === 0 || allowedChatIds.has(String(chatId))
}

function truncateTelegramText(text) {
  const normalized = String(text ?? '').trim()

  if (normalized.length <= MAX_TELEGRAM_REPLY_LENGTH) {
    return normalized
  }

  return `${normalized.slice(0, MAX_TELEGRAM_REPLY_LENGTH - 3).trim()}...`
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
    messageId: Number.isInteger(message.message_id) ? message.message_id : null,
    chatType: String(message.chat.type ?? 'private'),
    firstName: String(message.from?.first_name ?? '').trim(),
    username: String(message.from?.username ?? '').trim(),
    text,
  }
}

function buildWelcomeReply() {
  return `${SITE_DISPLAY_NAME} is connected. Send a question or task and I will answer with the same assistant stack used for the site. Use /status to confirm the active provider.`
}

function buildStatusReply() {
  const provider = String(
    process.env.PUBLIC_ASSISTANT_PROVIDER ?? 'fallback'
  ).trim()
  const model =
    process.env.OLLAMA_MODEL ??
    process.env.CLAUDE_MODEL ??
    process.env.OPENAI_MODEL ??
    'default'

  return `${SITE_DISPLAY_NAME} is online.\nProvider: ${provider}\nModel: ${String(model).trim() || 'default'}\nSite: ${SITE_URL}`
}

function buildAssistantFailureReply() {
  return `I hit a temporary assistant error. Please try again in a moment or open ${SITE_URL}.`
}

async function createTelegramReply(message) {
  const command = getTelegramCommandName(message.text)

  if (command === '/start' || command === '/help') {
    return {
      source: 'system',
      text: buildWelcomeReply(),
    }
  }

  if (command === '/status') {
    return {
      source: 'system',
      text: buildStatusReply(),
    }
  }

  const assistant = await answerPublicAssistant({
    message: message.text,
  })

  return {
    source: assistant.source ?? 'fallback',
    text: assistant.reply,
  }
}

async function sendTelegramMessage({ chatId, text }) {
  const token = getTelegramBotToken()

  if (!token) {
    throw createHttpError(
      503,
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
    let detail = `HTTP ${response.status}`

    try {
      const payload = await response.json()
      detail = String(payload.description ?? detail)
    } catch {
      // Keep the HTTP detail when Telegram does not return JSON.
    }

    throw createHttpError(502, `Telegram sendMessage failed: ${detail}`)
  }

  return response.json()
}

export function getTelegramBotToken() {
  return getConfiguredEnvironmentValue('TELEGRAM_BOT_TOKEN')
}

export function getTelegramWebhookSecret() {
  return getConfiguredEnvironmentValue('TELEGRAM_WEBHOOK_SECRET')
}

export function getTelegramWebhookUrl() {
  return getConfiguredEnvironmentValue('TELEGRAM_WEBHOOK_URL')
}

export function getTelegramSetupSummary() {
  return {
    botTokenConfigured: Boolean(getTelegramBotToken()),
    webhookUrlConfigured: Boolean(getTelegramWebhookUrl()),
    webhookSecretConfigured: Boolean(getTelegramWebhookSecret()),
    allowedChatIdsConfigured: getAllowedTelegramChatIds().size > 0,
  }
}

export function assertTelegramWebhookRequest(request) {
  const configuredSecret = getTelegramWebhookSecret()

  if (!configuredSecret) {
    return
  }

  const suppliedSecret = String(
    request.get(TELEGRAM_SECRET_HEADER) ??
      request.headers[TELEGRAM_SECRET_HEADER] ??
      ''
  ).trim()

  if (suppliedSecret !== configuredSecret) {
    throw createHttpError(403, 'Valid Telegram webhook secret required.')
  }
}

export async function handleTelegramWebhookUpdate(update) {
  const message = extractTelegramMessage(update)

  if (!message) {
    return {
      ok: true,
      ignored: true,
      reason: 'No text message found in the update.',
    }
  }

  if (!isAllowedChatId(message.chatId)) {
    return {
      ok: true,
      ignored: true,
      reason: 'Chat is not allowed for this bot.',
      chatId: message.chatId,
    }
  }

  let reply

  try {
    reply = await createTelegramReply(message)
  } catch {
    reply = {
      source: 'fallback',
      text: buildAssistantFailureReply(),
    }
  }

  const telegramResponse = await sendTelegramMessage({
    chatId: message.chatId,
    text: reply.text,
  })

  return {
    ok: true,
    delivered: true,
    chatId: message.chatId,
    source: reply.source,
    telegramMessageId: telegramResponse.result?.message_id ?? null,
  }
}
