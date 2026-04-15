import crypto from 'node:crypto'

const SESSION_COOKIE = 'myappai_admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 12
const activeSessions = new Map()

function getSessionSecret() {
  return String(process.env.ADMIN_SESSION_SECRET ?? '').trim()
}

function getAdminEmail() {
  const value = String(process.env.ADMIN_EMAIL ?? '')
    .trim()
    .toLowerCase()
  return value
}

function getAdminPasscode() {
  return String(process.env.ADMIN_PASSCODE ?? '5555').trim()
}

function getAdminApiKey() {
  return String(
    process.env.ADMIN_API_KEY ?? process.env.X_ADMIN_KEY ?? ''
  ).trim()
}

function isProduction() {
  return process.env.NODE_ENV === 'production'
}

function createSignature(token) {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(token)
    .digest('hex')
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${value}`]

  if (options.httpOnly) {
    parts.push('HttpOnly')
  }
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`)
  }
  if (options.secure) {
    parts.push('Secure')
  }
  if (options.path) {
    parts.push(`Path=${options.path}`)
  }
  if (typeof options.maxAge === 'number') {
    parts.push(`Max-Age=${options.maxAge}`)
  }

  return parts.join('; ')
}

function parseCookies(request) {
  const header = request.headers.cookie ?? ''
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

function pruneExpiredSessions() {
  const now = Date.now()
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt <= now) {
      activeSessions.delete(token)
    }
  }
}

export function createAdminSession(email) {
  if (!getSessionSecret()) {
    throw new Error(
      'ADMIN_SESSION_SECRET must be configured to enable admin login.'
    )
  }

  pruneExpiredSessions()
  const token = crypto.randomBytes(24).toString('hex')
  const signature = createSignature(token)
  const expiresAt = Date.now() + SESSION_TTL_MS

  activeSessions.set(token, {
    email,
    expiresAt,
  })

  return {
    token,
    signedToken: `${token}.${signature}`,
    expiresAt,
  }
}

export function clearAdminSessionCookie(response) {
  response.setHeader(
    'Set-Cookie',
    serializeCookie(SESSION_COOKIE, '', {
      httpOnly: true,
      sameSite: 'Lax',
      secure: isProduction(),
      path: '/',
      maxAge: 0,
    })
  )
}

export function setAdminSessionCookie(response, signedToken) {
  response.setHeader(
    'Set-Cookie',
    serializeCookie(SESSION_COOKIE, signedToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: isProduction(),
      path: '/',
      maxAge: Math.floor(SESSION_TTL_MS / 1000),
    })
  )
}

export function destroyAdminSession(request, response) {
  const cookies = parseCookies(request)
  const signedToken = cookies[SESSION_COOKIE]
  if (signedToken) {
    const [token] = signedToken.split('.')
    activeSessions.delete(token)
  }

  clearAdminSessionCookie(response)
}

export function validateAdminCredentials(email, code, adminKey = '') {
  const configuredEmail = getAdminEmail()
  const configuredCode = getAdminPasscode()
  const configuredKey = getAdminApiKey()

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

  if (
    String(email ?? '')
      .trim()
      .toLowerCase() !== configuredEmail ||
    String(code ?? '').trim() !== configuredCode
  ) {
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

export function readAdminSession(request) {
  pruneExpiredSessions()
  const cookies = parseCookies(request)
  const signedToken = cookies[SESSION_COOKIE]

  if (!signedToken || !getSessionSecret()) {
    return null
  }

  const [token, signature] = signedToken.split('.')
  if (!token || !signature) {
    return null
  }

  const expected = createSignature(token)
  if (signature !== expected) {
    activeSessions.delete(token)
    return null
  }

  const session = activeSessions.get(token)
  if (!session || session.expiresAt <= Date.now()) {
    activeSessions.delete(token)
    return null
  }

  return {
    email: session.email,
    authMode: 'session',
  }
}
