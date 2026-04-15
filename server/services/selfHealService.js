import { bootstrapContent } from './contentService.js'
import { getAnalyticsSnapshot } from './analyticsService.js'
import { getDeploymentHistory } from './deploymentService.js'
import { logOperatorEvent, logSecureEvent } from './logService.js'

function nowIso() {
  return new Date().toISOString()
}

export async function runSelfHealAudit() {
  const appliedFixes = []
  const warnings = []

  await bootstrapContent()
  appliedFixes.push(
    'Verified content bootstrap and ensured required system files exist.'
  )

  const [analytics, deployments] = await Promise.all([
    getAnalyticsSnapshot(),
    getDeploymentHistory(),
  ])

  if (!analytics?.aiActivity) {
    warnings.push('Analytics activity state was unavailable.')
  }

  if (!Array.isArray(deployments?.history)) {
    warnings.push('Deployment history document was unavailable.')
  }

  const result = {
    status: warnings.length ? 'attention' : 'stable',
    appliedFixes,
    warnings,
    checkedAt: nowIso(),
  }

  await logOperatorEvent({
    level: warnings.length ? 'warn' : 'info',
    scope: 'self-heal',
    title: 'Self-heal audit completed',
    message: warnings.length
      ? 'Self-heal completed with warnings.'
      : 'Self-heal completed with no blocking issues.',
    details: result,
  })

  return result
}

export async function recordUnhandledServerError(error, route = '') {
  const payload = {
    level: 'error',
    scope: 'server',
    title: error?.name || 'ServerError',
    message: error?.message || 'Unknown server error',
    route,
    details:
      error instanceof Error
        ? {
            stack: error.stack ?? null,
          }
        : error,
  }

  await logSecureEvent(payload)
  await logOperatorEvent({
    ...payload,
    message: 'A server error was captured and stored in secure logs.',
    details: {
      route,
      errorName: error?.name || 'ServerError',
    },
  })
}
