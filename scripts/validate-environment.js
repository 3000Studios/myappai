import './lib/loadEnvironment.js'

const REQUIRED_NODE_MAJOR = 20

function isMissing(name) {
  const value = process.env[name]
  return !value || String(value).startsWith('replace-with-')
}

function parseMajor(version) {
  const major = Number.parseInt(version.replace(/^v/, '').split('.')[0], 10)
  return Number.isFinite(major) ? major : null
}

function validateNodeVersion() {
  const major = parseMajor(process.version)

  if (!major || major < REQUIRED_NODE_MAJOR) {
    return {
      ok: false,
      name: 'node_version',
      message: `Node.js ${REQUIRED_NODE_MAJOR}+ is required. Current runtime: ${process.version}.`,
    }
  }

  return {
    ok: true,
    name: 'node_version',
    message: `Node.js runtime ${process.version} is supported.`,
  }
}

function validateCloudflareVariables() {
  const hasApiToken =
    !isMissing('CLOUDFLARE_API_TOKEN') || !isMissing('CLOUD_FLARE_API_TOKEN')
  const hasAccountId =
    !isMissing('CLOUDFLARE_ACCOUNT_ID') || !isMissing('CLOUD_FLARE_ACCOUNT_ID')
  const missing = []

  if (!hasApiToken) {
    missing.push('CLOUDFLARE_API_TOKEN or CLOUD_FLARE_API_TOKEN')
  }

  if (!hasAccountId) {
    missing.push('CLOUDFLARE_ACCOUNT_ID or CLOUD_FLARE_ACCOUNT_ID')
  }

  if (isMissing('CLOUDFLARE_PAGES_PROJECT_NAME')) {
    missing.push('CLOUDFLARE_PAGES_PROJECT_NAME')
  }

  return {
    ok: missing.length === 0,
    name: 'cloudflare_env',
    message:
      missing.length === 0
        ? 'Cloudflare deployment variables are present.'
        : `Missing optional deployment variables: ${missing.join(', ')}. Add them to .secrets/myappai.local.env or your local environment.`,
  }
}

function validateAdminVariables() {
  const required = ['ADMIN_EMAIL', 'ADMIN_PASSCODE', 'ADMIN_SESSION_SECRET']
  const missing = required.filter(
    (name) =>
      !process.env[name] ||
      String(process.env[name]).startsWith('replace-with-')
  )

  return {
    ok: missing.length === 0,
    name: 'admin_env',
    message:
      missing.length === 0
        ? 'Admin session variables are present.'
        : `Missing admin session variables: ${missing.join(', ')}. Add them to .secrets/myappai.local.env or your local environment.`,
  }
}

function validateSiteVariables() {
  const required = [
    'SITE_URL',
    'WWW_SITE_URL',
    'SITE_ORIGIN',
    'WWW_SITE_ORIGIN',
  ]
  const missing = required.filter(isMissing)

  return {
    ok: missing.length === 0,
    name: 'site_env',
    message:
      missing.length === 0
        ? 'Canonical site URL variables are present.'
        : `Missing site variables: ${missing.join(', ')}. Add them to .secrets/myappai.local.env or your local environment.`,
  }
}

function validateAiVariables() {
  const hasOpenAiModel = !isMissing('OPENAI_MODEL')
  const hasClaudeModel = !isMissing('CLAUDE_MODEL')
  const hasOllamaModel = !isMissing('OLLAMA_MODEL')

  return {
    ok: hasOpenAiModel || hasClaudeModel || hasOllamaModel,
    name: 'ai_env',
    message:
      hasOpenAiModel || hasClaudeModel || hasOllamaModel
        ? 'AI runtime defaults are present.'
        : 'Missing recommended AI variables: OPENAI_MODEL, CLAUDE_MODEL, or OLLAMA_MODEL. Add one of them to .secrets/myappai.local.env or your local environment.',
  }
}

function validateTelegramVariables() {
  const botTokenConfigured = !isMissing('TELEGRAM_BOT_TOKEN')
  const webhookUrlConfigured = !isMissing('TELEGRAM_WEBHOOK_URL')
  const secretConfigured = !isMissing('TELEGRAM_WEBHOOK_SECRET')
  const anyConfigured =
    botTokenConfigured || webhookUrlConfigured || secretConfigured
  const missing = []

  if (!anyConfigured) {
    return {
      ok: true,
      name: 'telegram_env',
      message:
        'Telegram bridge variables are optional and currently not configured.',
    }
  }

  if (!botTokenConfigured) {
    missing.push('TELEGRAM_BOT_TOKEN')
  }

  if (!webhookUrlConfigured) {
    missing.push('TELEGRAM_WEBHOOK_URL')
  }

  return {
    ok: missing.length === 0,
    name: 'telegram_env',
    message:
      missing.length === 0
        ? `Telegram bridge variables are present.${secretConfigured ? ' Webhook secret protection is enabled.' : ' Add TELEGRAM_WEBHOOK_SECRET for stronger webhook validation.'}`
        : `Telegram bridge is partially configured. Missing: ${missing.join(', ')}.`,
  }
}

const checks = [
  validateNodeVersion(),
  validateCloudflareVariables(),
  validateAdminVariables(),
  validateSiteVariables(),
  validateAiVariables(),
  validateTelegramVariables(),
]
const blockingFailures = checks.filter(
  (check) => check.name === 'node_version' && !check.ok
)

console.log(
  JSON.stringify(
    {
      ok: blockingFailures.length === 0,
      checkedAt: new Date().toISOString(),
      checks,
    },
    null,
    2
  )
)

if (blockingFailures.length > 0) {
  process.exitCode = 1
}
