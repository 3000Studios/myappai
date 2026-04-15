import './lib/loadEnvironment.js'
import { spawn } from 'node:child_process'

const results = []

function resolveExecutable(command) {
  if (process.platform !== 'win32') {
    return command
  }

  if (command === 'npx') {
    return 'npx.cmd'
  }

  return command
}

function quoteWindowsArgument(value) {
  const stringValue = String(value ?? '')

  if (!stringValue) {
    return '""'
  }

  if (!/[\s"]/u.test(stringValue)) {
    return stringValue
  }

  return `"${stringValue.replace(/"/g, '\\"')}"`
}

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      name: 'openai',
      ok: false,
      skipped: true,
      message: 'Missing OPENAI_API_KEY.',
    }
  }

  const response = await fetch('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!response.ok) {
    return { name: 'openai', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'openai',
    ok: true,
    message: `Authenticated. Models visible: ${Array.isArray(payload.data) ? payload.data.length : 0}.`,
  }
}

async function testOllama() {
  const apiUrl = String(process.env.OLLAMA_API_URL ?? '').trim()

  if (!apiUrl) {
    return {
      name: 'ollama',
      ok: false,
      skipped: true,
      message: 'Missing OLLAMA_API_URL.',
    }
  }

  const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/api/tags`)

  if (!response.ok) {
    return { name: 'ollama', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'ollama',
    ok: true,
    message: `Reachable. Models visible: ${Array.isArray(payload.models) ? payload.models.length : 0}.`,
  }
}

async function testGitHub() {
  const token = process.env.GH_TOKEN || process.env.GH_PAT
  if (!token) {
    return {
      name: 'github',
      ok: false,
      skipped: true,
      message: 'Missing GH_TOKEN/GH_PAT.',
    }
  }

  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'myappai-secrets-test',
    },
  })

  if (!response.ok) {
    return { name: 'github', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'github',
    ok: true,
    message: `Authenticated as ${payload.login ?? 'unknown'}.`,
  }
}

async function testCloudflare() {
  const explicitDeployToken =
    process.env.CLOUDFLARE_PAGES_DEPLOY_TOKEN ||
    process.env.CLOUD_FLARE_API_TOKEN ||
    process.env.CLOUDFLARE_API_TOKEN

  if (explicitDeployToken) {
    const response = await fetch(
      'https://api.cloudflare.com/client/v4/user/tokens/verify',
      {
        headers: { Authorization: `Bearer ${explicitDeployToken}` },
      }
    )

    if (!response.ok) {
      return {
        name: 'cloudflare',
        ok: false,
        message: `Deploy token HTTP ${response.status}`,
      }
    }

    const payload = await response.json()
    return {
      name: 'cloudflare',
      ok: Boolean(payload.success),
      message: payload.success
        ? 'Deploy token verified.'
        : (payload.errors?.[0]?.message ?? 'Deploy token verification failed.'),
    }
  }

  return new Promise((resolve) => {
    const env = { ...process.env }
    delete env.CLOUDFLARE_API_TOKEN
    delete env.CLOUD_FLARE_API_TOKEN
    delete env.CLOUDFLARE_API_TOKEN_ALT
    delete env.CF_API_TOKEN
    delete env.CF_API_TOKEN2
    delete env.CLOUDFLARE_MASTER_TOKEN
    delete env.CLOUDFLARE_MASTERR_TOKEN

    const executable = resolveExecutable('npx')
    const spawnConfig =
      process.platform === 'win32'
        ? {
            file: 'cmd.exe',
            args: [
              '/d',
              '/s',
              '/c',
              [executable, 'wrangler', 'whoami']
                .map(quoteWindowsArgument)
                .join(' '),
            ],
          }
        : {
            file: executable,
            args: ['wrangler', 'whoami'],
          }

    const child = spawn(spawnConfig.file, spawnConfig.args, {
      cwd: process.cwd(),
      env,
      shell: false,
      windowsHide: true,
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk)
    })

    child.stderr.on('data', (chunk) => {
      stderr += String(chunk)
    })

    child.on('error', (error) => {
      resolve({
        name: 'cloudflare',
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      })
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve({
          name: 'cloudflare',
          ok: true,
          message: stdout.includes('OAuth Token')
            ? 'Wrangler OAuth session verified.'
            : 'Cloudflare auth verified.',
        })
        return
      }

      resolve({
        name: 'cloudflare',
        ok: false,
        message: stderr.trim() || stdout.trim() || `wrangler exited ${code}`,
      })
    })
  })
}

async function testStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return {
      name: 'stripe',
      ok: false,
      skipped: true,
      message: 'Missing STRIPE_SECRET_KEY.',
    }
  }

  const response = await fetch('https://api.stripe.com/v1/account', {
    headers: { Authorization: `Bearer ${key}` },
  })

  if (!response.ok) {
    return { name: 'stripe', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'stripe',
    ok: true,
    message: `Authenticated. Account country: ${payload.country ?? 'unknown'}.`,
  }
}

async function testPayPal() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return {
      name: 'paypal',
      ok: false,
      skipped: true,
      message: 'Missing PayPal credentials.',
    }
  }

  const isLive =
    String(process.env.PAYPAL_ENV ?? 'sandbox').toLowerCase() === 'live'
  const baseUrl = isLive
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    return { name: 'paypal', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'paypal',
    ok: true,
    message: `Authenticated. Scope length: ${String(payload.scope ?? '').length}.`,
  }
}

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return {
      name: 'gemini',
      ok: false,
      skipped: true,
      message: 'Missing GEMINI_API_KEY.',
    }
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
  )

  if (!response.ok) {
    return { name: 'gemini', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'gemini',
    ok: true,
    message: `Authenticated. Models visible: ${Array.isArray(payload.models) ? payload.models.length : 0}.`,
  }
}

async function testTelegram() {
  const token = String(process.env.TELEGRAM_BOT_TOKEN ?? '').trim()

  if (!token) {
    return {
      name: 'telegram',
      ok: false,
      skipped: true,
      message: 'Missing TELEGRAM_BOT_TOKEN.',
    }
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/getMe`)

  if (!response.ok) {
    return { name: 'telegram', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()

  if (!payload.ok) {
    return {
      name: 'telegram',
      ok: false,
      message: String(payload.description ?? 'Telegram authentication failed.'),
    }
  }

  return {
    name: 'telegram',
    ok: true,
    message: `Authenticated as @${payload.result?.username ?? 'unknown'}.`,
  }
}

async function runTest(fn) {
  try {
    results.push(await fn())
  } catch (error) {
    const detail =
      error instanceof Error
        ? `${error.message}${error.cause instanceof Error ? ` (cause: ${error.cause.message})` : ''}`
        : String(error)

    results.push({
      name: fn.name.replace(/^test/, '').toLowerCase(),
      ok: false,
      message: detail,
    })
  }
}

await runTest(testOllama)
await runTest(testOpenAI)
await runTest(testGitHub)
await runTest(testCloudflare)
await runTest(testStripe)
await runTest(testPayPal)
await runTest(testGemini)
await runTest(testTelegram)

console.log(
  JSON.stringify(
    {
      ok: results.every((result) => result.ok || result.skipped),
      checkedAt: new Date().toISOString(),
      results,
    },
    null,
    2
  )
)
