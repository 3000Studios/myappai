import { Router } from 'express'
import {
  getOllamaProxyStatus,
  getTelegramBridgeStatus,
  getPublicSiteSnapshot,
  postLeadCapture,
  postPublicAssistant,
  proxyOllamaRequest,
  postSiteEvent,
  postTelegramWebhook,
} from '../controllers/publicController.js'

const router = Router()

router.get('/site', getPublicSiteSnapshot)
router.post('/events', postSiteEvent)
router.post('/leads', postLeadCapture)
router.post('/assistant', postPublicAssistant)
router.get('/ollama/status', getOllamaProxyStatus)
router.post('/ollama', proxyOllamaRequest)
router.post('/ollama/generate', proxyOllamaRequest)
router.post('/ollama/api/generate', proxyOllamaRequest)
router.post('/ollama/chat', proxyOllamaRequest)
router.post('/ollama/api/chat', proxyOllamaRequest)
router.get('/ollama/tags', proxyOllamaRequest)
router.get('/ollama/api/tags', proxyOllamaRequest)
router.get('/telegram/status', getTelegramBridgeStatus)
router.post('/telegram/webhook', postTelegramWebhook)

export default router
