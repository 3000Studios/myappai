const DEFAULT_API_KEY = process.env.API_KEY ?? 'local-dev-api-key'

export function authMiddleware(request, response, next) {
  const authorization = request.headers.authorization ?? ''

  if (!authorization.startsWith('Bearer ')) {
    response.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization header must use the Bearer API_KEY format.',
    })
    return
  }

  const token = authorization.slice('Bearer '.length).trim()

  if (!token || token !== DEFAULT_API_KEY) {
    response.status(401).json({
      error: 'Unauthorized',
      message: 'The supplied API key is invalid.',
    })
    return
  }

  request.auth = { token }
  next()
}
