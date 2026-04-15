import './lib/loadEnvironment.js'

const TELEGRAM_API_ORIGIN = 'https://api.telegram.org'

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

function getTelegramBotToken() {
  return getConfiguredEnvironmentValue('TELEGRAM_BOT_TOKEN')
}

function getTelegramWebhookUrl() {
  return getConfiguredEnvironmentValue('TELEGRAM_WEBHOOK_URL')
}

function getTelegramWebhookSecret() {
  return getConfiguredEnvironmentValue('TELEGRAM_WEBHOOK_SECRET')
}

async function callTelegramMethod(method, payload = undefined) {
  const token = getTelegramBotToken()

  if (!token) {
    throw new Error(
      'TELEGRAM_BOT_TOKEN must be configured before registering a webhook.'
    )
  }

  const response = await fetch(`${TELEGRAM_API_ORIGIN}/bot${token}/${method}`, {
    method: payload ? 'POST' : 'GET',
    headers: payload
      ? {
          'content-type': 'application/json',
        }
      : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  })

  if (!response.ok) {
    throw new Error(`Telegram ${method} failed with HTTP ${response.status}.`)
  }

  const result = await response.json()

  if (!result.ok) {
    throw new Error(
      `Telegram ${method} failed: ${String(result.description ?? 'Unknown error.')}`
    )
  }

  return result.result
}

async function main() {
  const webhookUrl = getTelegramWebhookUrl()

  if (!webhookUrl) {
    throw new Error(
      'TELEGRAM_WEBHOOK_URL must be configured before registering a webhook.'
    )
  }

  const payload = {
    url: webhookUrl,
    allowed_updates: ['message', 'edited_message'],
  }
  const secret = getTelegramWebhookSecret()

  if (secret) {
    payload.secret_token = secret
  }

  await callTelegramMethod('setWebhook', payload)
  const webhookInfo = await callTelegramMethod('getWebhookInfo')

  console.log(
    JSON.stringify(
      {
        ok: true,
        checkedAt: new Date().toISOString(),
        webhook: {
          url: webhookInfo.url,
          hasCustomCertificate: webhookInfo.has_custom_certificate ?? false,
          pendingUpdateCount: webhookInfo.pending_update_count ?? 0,
          lastErrorDate: webhookInfo.last_error_date ?? null,
          lastErrorMessage: webhookInfo.last_error_message ?? null,
          maxConnections: webhookInfo.max_connections ?? null,
          ipAddress: webhookInfo.ip_address ?? null,
        },
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      },
      null,
      2
    )
  )
  process.exitCode = 1
})
