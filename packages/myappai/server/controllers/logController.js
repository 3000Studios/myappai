import {
  getPublicLogs,
  getSecureLogs,
  logPublicEvent,
} from '../services/logService.js'
import { runSelfHealAudit } from '../services/selfHealService.js'

function getLogsAccessCode() {
  return String(process.env.LOGS_ACCESS_CODE ?? '8888').trim()
}

export async function getLogs(request, response, next) {
  try {
    const logs = await getPublicLogs(120)
    response.json(logs)
  } catch (error) {
    next(error)
  }
}

export async function getSecureLogsSnapshot(request, response, next) {
  try {
    const suppliedCode = String(
      request.headers['x-logs-code'] ??
        request.query.code ??
        request.body?.code ??
        ''
    ).trim()

    if (suppliedCode !== getLogsAccessCode()) {
      response.status(403).json({
        ok: false,
        message: 'Valid secure logs access code required.',
      })
      return
    }

    const logs = await getSecureLogs(120)
    response.json(logs)
  } catch (error) {
    next(error)
  }
}

export async function postClientLog(request, response, next) {
  try {
    const entry = await logPublicEvent({
      level: request.body?.level ?? 'info',
      scope: 'client',
      title: request.body?.title ?? 'Client event',
      message: request.body?.message ?? '',
      route: request.body?.route ?? '',
      actor: request.admin?.email ?? '',
      details: request.body?.details ?? null,
    })

    response.json({
      ok: true,
      entry,
    })
  } catch (error) {
    next(error)
  }
}

export async function postSelfHealRun(request, response, next) {
  try {
    const result = await runSelfHealAudit()
    response.json({
      ok: true,
      result,
    })
  } catch (error) {
    next(error)
  }
}
