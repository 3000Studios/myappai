import '../scripts/lib/loadEnvironment.js'
import cors from 'cors'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import commandRoutes from './routes/commandRoutes.js'
import adminAuthRoutes from './routes/adminAuthRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import openclawRoutes from './routes/openclaw.js'
import { bootstrapContent } from './services/contentService.js'
import { recordUnhandledServerError } from './services/selfHealService.js'

const app = express()
const PORT = Number(process.env.PORT ?? 8787)
const __filename = fileURLToPath(import.meta.url)

app.use(cors())
app.use(express.json({ limit: '60mb' }))

app.get('/api/health', async (_request, response) => {
  await bootstrapContent()
  response.json({
    status: 'ok',
    service: 'myappai-platform',
    mode: 'local-repo-server',
  })
})

app.use('/api/public', publicRoutes)
app.use('/api/admin', adminAuthRoutes)
app.use('/api', commandRoutes)
app.use('/api/openclaw', openclawRoutes)

app.use((error, _request, response, _next) => {
  void _next
  recordUnhandledServerError(error, _request?.originalUrl ?? '').catch(() => {})
  response.status(400).json({
    error: error.name || 'RequestError',
    message: error.message || 'Request failed.',
  })
})

export { app }

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  bootstrapContent()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`myappai server listening on http://localhost:${PORT}`)
      })
    })
    .catch((error) => {
      console.error('Failed to bootstrap content.', error)
      process.exitCode = 1
    })
}
