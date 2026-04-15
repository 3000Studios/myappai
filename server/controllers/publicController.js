import {
  getAnalyticsSnapshot,
  recordLead,
  recordSiteEvent,
} from '../services/analyticsService.js'
import { answerPublicAssistant } from '../services/assistantService.js'
import { getDeploymentHistory } from '../services/deploymentService.js'
import {
  assertOllamaProxyRequest,
  forwardOllamaProxyHttpRequest,
  getOllamaProxyStatusSummary,
  pipeOllamaProxyResponse,
} from '../services/ollamaProxyService.js'
import {
  assertTelegramWebhookRequest,
  getTelegramSetupSummary,
  handleTelegramWebhookUpdate,
} from '../services/telegramBridgeService.js'
import {
  SITE_CATEGORY,
  SITE_DISPLAY_NAME,
  SITE_URL,
} from '../../frontend/src/siteMeta.js'

export async function getPublicSiteSnapshot(_request, response, next) {
  try {
    const [analytics, deployments] = await Promise.all([
      getAnalyticsSnapshot(),
      getDeploymentHistory(),
    ])
    const latestDeployment = deployments.history?.[0] ?? null

    response.json({
      analytics,
      brand: {
        displayName: SITE_DISPLAY_NAME,
        url: SITE_URL,
        category: SITE_CATEGORY,
      },
      proof: {
        liveDataOnly: true,
        leadCaptureReady: true,
        adminSurfaceReady: true,
        trafficEngineReady: true,
        contentCounts: analytics.contentCounts,
        modelsOnline: analytics.models.length,
        latestDeployment: latestDeployment
          ? {
              status: latestDeployment.status,
              finishedAt:
                latestDeployment.finishedAt ?? latestDeployment.startedAt,
            }
          : null,
      },
      funnel: {
        mode: 'operator_login',
        contactMode: 'lead_form',
        contactPath: '/admin/login',
        primaryOfferSlug: null,
        implementationOfferSlug: null,
        enterpriseOfferSlug: null,
        offers: [],
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function postSiteEvent(request, response, next) {
  try {
    const event = await recordSiteEvent(request.body ?? {})
    response.json({
      ok: true,
      event,
    })
  } catch (error) {
    next(error)
  }
}

export async function postLeadCapture(request, response, next) {
  try {
    const lead = await recordLead(request.body ?? {})
    response.status(201).json({
      ok: true,
      lead,
    })
  } catch (error) {
    next(error)
  }
}

export async function postPublicAssistant(request, response, next) {
  try {
    const result = await answerPublicAssistant({
      message: request.body?.message ?? '',
      history: Array.isArray(request.body?.history) ? request.body.history : [],
    })

    response.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getTelegramBridgeStatus(_request, response) {
  response.json({
    ok: true,
    ...getTelegramSetupSummary(),
  })
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

export async function postTelegramWebhook(request, response, next) {
  try {
    assertTelegramWebhookRequest(request)
    const result = await handleTelegramWebhookUpdate(request.body ?? {})

    response.json(result)
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
