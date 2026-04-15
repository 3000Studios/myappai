import {
  readAdminSession,
  validateAdminCredentials,
} from '../services/adminSessionService.js'

export function adminAuth(request, response, next) {
  const session = readAdminSession(request)
  if (session) {
    request.admin = session
    next()
    return
  }

  const adminKey = request.headers['x-admin-key']
  const email = request.headers['x-admin-email']
  const code = request.headers['x-admin-code']
  const result = validateAdminCredentials(email, code, adminKey)

  if (!result.ok) {
    response.status(403).json({
      error: 'Admin access required',
      message: result.message,
    })
    return
  }

  request.admin = {
    email: result.email,
    authMode: result.authMode,
  }
  next()
}
