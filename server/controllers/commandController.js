import { routeCommand } from '../../ai/router/commandRouter.js'
import { getAnalyticsSnapshot } from '../services/analyticsService.js'
import { getContentBundle } from '../services/contentService.js'
import { getDeploymentHistory } from '../services/deploymentService.js'
import { getRecentCommits } from '../services/gitService.js'
import { getPublicLogs } from '../services/logService.js'
import { getSystemMetrics } from '../services/metricsService.js'
import {
  assertOllamaProxyRequest,
  forwardOllamaProxyHttpRequest,
  getOllamaProxyStatusSummary,
  pipeOllamaProxyResponse,
} from '../services/ollamaProxyService.js'
import {
  getRevenueQueueSnapshot,
  updateLeadStage,
} from '../services/revenueQueueService.js'
import { transcribePublicMedia } from '../services/transcriptionService.js'
import {
  generateGeminiText,
  streamGeminiText,
} from '../services/geminiService.js'

export async function postCommand(request, response, next) {
  try {
    const result = await routeCommand(request.body)
    response.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getAnalytics(request, response, next) {
  try {
    const analytics = await getAnalyticsSnapshot()
    response.json(analytics)
  } catch (error) {
    next(error)
  }
}

export async function getDeployments(request, response, next) {
  try {
    const [deployments, commits] = await Promise.all([
      getDeploymentHistory(),
      getRecentCommits(8),
    ])
    response.json({
      ...deployments,
      commits,
    })
  } catch (error) {
    next(error)
  }
}

export async function getContent(request, response, next) {
  try {
    const section =
      typeof request.query.section === 'string' ? request.query.section : 'all'
    const content = await getContentBundle(section)
    response.json(content)
  } catch (error) {
    next(error)
  }
}

export async function getMetrics(request, response, next) {
  try {
    const metrics = await getSystemMetrics()
    response.json(metrics)
  } catch (error) {
    next(error)
  }
}

export async function getLogs(request, response, next) {
  try {
    const logs = await getPublicLogs(120)
    response.json(logs)
  } catch (error) {
    next(error)
  }
}

export async function getRevenueQueue(request, response, next) {
  try {
    const revenue = await getRevenueQueueSnapshot()
    response.json(revenue)
  } catch (error) {
    next(error)
  }
}

export async function patchLeadStage(request, response, next) {
  try {
    const lead = await updateLeadStage(request.params.id, request.body ?? {})
    response.json({
      ok: true,
      lead,
    })
  } catch (error) {
    next(error)
  }
}

export async function postWhisperTranscription(request, response, next) {
  try {
    const result = await transcribePublicMedia(request.body ?? {})
    response.json(result)
  } catch (error) {
    next(error)
  }
}

export async function postGeminiGenerate(request, response, next) {
  try {
    const { prompt, model, systemInstruction } = request.body ?? {}
    const result = await generateGeminiText({
      prompt,
      model,
      systemInstruction,
    })
    response.json(result)
  } catch (error) {
    next(error)
  }
}

export async function postGeminiStream(request, response, next) {
  try {
    const { prompt, model, systemInstruction } = request.body ?? {}
    response.setHeader('Content-Type', 'text/event-stream')
    response.setHeader('Cache-Control', 'no-cache')
    response.setHeader('Connection', 'keep-alive')
    response.flushHeaders?.()

    await streamGeminiText({ prompt, model, systemInstruction }, (chunk) => {
      const payload = JSON.stringify({ chunk })
      response.write(`data: ${payload}\n\n`)
    })

    response.write('event: done\ndata: {"ok":true}\n\n')
    response.end()
  } catch (error) {
    if (!response.headersSent) {
      next(error)
      return
    }
    const payload = JSON.stringify({
      error: error instanceof Error ? error.message : String(error),
    })
    response.write(`event: error\ndata: ${payload}\n\n`)
    response.end()
  }
}

export async function getOllamaProxyStatus(_request, response) {
  response.json(getOllamaProxyStatusSummary())
}

export async function proxyOllamaRequest(request, response, next) {
  try {
    assertOllamaProxyRequest(request)
    const forwarded = await forwardOllamaProxyHttpRequest({
      requestPath: request.path,
      method: request.method,
      body: request.body,
    })

    if (forwarded.kind === 'summary') {
      response.status(forwarded.status).json(forwarded.payload)
      return
    }

    await pipeOllamaProxyResponse(response, forwarded.response)
  } catch (error) {
    if (error?.statusCode) {
      response.status(error.statusCode).json({
        ok: false,
        message: error.message,
      })
      return
    }

    next(error)
  }
}
