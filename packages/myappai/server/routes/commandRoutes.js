import { Router } from 'express'
import commandApiRouter from '../../api/command.js'
import {
  getAnalytics,
  getContent,
  getDeployments,
  getLogs,
  getMetrics,
  getOllamaProxyStatus,
  getRevenueQueue,
  patchLeadStage,
  postGeminiGenerate,
  postGeminiStream,
  postWhisperTranscription,
  proxyOllamaRequest,
} from '../controllers/commandController.js'
import { adminAuth } from '../middleware/adminAuth.js'
import {
  getSecureLogsSnapshot,
  postClientLog,
  postSelfHealRun,
} from '../controllers/logController.js'

const router = Router()

router.get('/ollama/status', getOllamaProxyStatus)
router.post('/ollama', proxyOllamaRequest)
router.post('/ollama/generate', proxyOllamaRequest)
router.post('/ollama/api/generate', proxyOllamaRequest)
router.post('/ollama/chat', proxyOllamaRequest)
router.post('/ollama/api/chat', proxyOllamaRequest)
router.get('/ollama/tags', proxyOllamaRequest)
router.get('/ollama/api/tags', proxyOllamaRequest)

router.get('/analytics', adminAuth, getAnalytics)
router.get('/deployments', adminAuth, getDeployments)
router.get('/content', adminAuth, getContent)
router.get('/logs', adminAuth, getLogs)
router.get('/logs/secure', adminAuth, getSecureLogsSnapshot)
router.post('/logs/client', adminAuth, postClientLog)
router.get('/metrics', adminAuth, getMetrics)
router.post('/heal', adminAuth, postSelfHealRun)
router.get('/revenue', adminAuth, getRevenueQueue)
router.patch('/revenue/leads/:id', adminAuth, patchLeadStage)
router.post('/transcription/whisper', adminAuth, postWhisperTranscription)
router.post('/gemini', adminAuth, postGeminiGenerate)
router.post('/gemini/stream', adminAuth, postGeminiStream)
router.use('/command', adminAuth, commandApiRouter)

export default router
