const SESSION_KEY = 'myappai-admin-session'

export { SESSION_KEY }

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw)
    if (!parsed?.adminEmail) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function saveAdminSession(payload) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload))
}

export function clearAdminSession() {
  localStorage.removeItem(SESSION_KEY)
}
