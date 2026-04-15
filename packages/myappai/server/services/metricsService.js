import os from 'node:os'
import { getAnalyticsSnapshot } from './analyticsService.js'
import { readSystemDocument } from './contentService.js'

const DEFAULT_STATE = {
  scheduler: {
    status: 'idle',
  },
  tasks: {},
}

function getCpuPercent() {
  const cores = os.cpus()

  if (!Array.isArray(cores) || cores.length === 0) {
    return 0
  }

  const totals = cores.reduce(
    (accumulator, core) => {
      const times = core.times ?? {}
      const total = Object.values(times).reduce((sum, value) => sum + value, 0)

      return {
        idle: accumulator.idle + (times.idle ?? 0),
        total: accumulator.total + total,
      }
    },
    { idle: 0, total: 0 }
  )

  if (totals.total <= 0) {
    return 0
  }

  return Math.round((1 - totals.idle / totals.total) * 100)
}

function getRamPercent() {
  const totalMemory = os.totalmem()
  const freeMemory = os.freemem()

  if (!Number.isFinite(totalMemory) || totalMemory <= 0) {
    return 0
  }

  return Math.round(((totalMemory - freeMemory) / totalMemory) * 100)
}

export async function getSystemMetrics() {
  const [analytics, state] = await Promise.all([
    getAnalyticsSnapshot(),
    readSystemDocument('state.json', DEFAULT_STATE),
  ])

  const taskEntries = Object.values(state.tasks ?? {})
  const schedulerOnline = state.scheduler ? 1 : 0

  return {
    cpu: getCpuPercent(),
    ram: getRamPercent(),
    agents: taskEntries.length + schedulerOnline,
    tasks: analytics.aiActivity?.commandsToday ?? taskEntries.length,
    deploymentsToday: analytics.aiActivity?.deploymentsToday ?? 0,
    lastAction: analytics.aiActivity?.lastAction ?? 'idle',
    schedulerStatus: state.scheduler?.status ?? 'idle',
    updatedAt: analytics.updatedAt ?? new Date().toISOString(),
  }
}
