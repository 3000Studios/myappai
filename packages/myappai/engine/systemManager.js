import { decideNextTasks } from '../ai/planner/aiPlanner.js'
import { routeCommand } from '../ai/router/commandRouter.js'

const DEFAULT_TARGET = 'repository'

function normalizeTask(task) {
  if (!task || typeof task !== 'object') {
    throw new Error('Task must be an object.')
  }

  if (typeof task.action !== 'string' || !task.action.trim()) {
    throw new Error('Task action must be a non-empty string.')
  }

  return {
    target:
      typeof task.target === 'string' && task.target.trim()
        ? task.target.trim()
        : DEFAULT_TARGET,
    ...task,
    action: task.action.trim(),
  }
}

function normalizePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {
      mode: 'autonomous',
      tasks: [],
    }
  }

  const requestedMode =
    typeof payload.mode === 'string' ? payload.mode.trim().toLowerCase() : ''
  const mode = requestedMode === 'single' ? 'single' : 'autonomous'
  const tasks = Array.isArray(payload.tasks)
    ? payload.tasks.map(normalizeTask)
    : []

  return {
    mode,
    tasks,
    metadata:
      typeof payload.metadata === 'object' && payload.metadata
        ? payload.metadata
        : {},
  }
}

async function buildTaskQueue(config) {
  if (config.mode === 'single' && config.tasks.length > 0) {
    return config.tasks
  }

  const plannedTasks = await decideNextTasks()
  return plannedTasks.map(normalizeTask)
}

async function runTask(task) {
  if (task.target !== DEFAULT_TARGET) {
    return {
      task,
      status: 'skipped',
      reason: `Unsupported target "${task.target}".`,
    }
  }

  try {
    const result = await routeCommand(task)
    return {
      task,
      status: 'completed',
      result,
    }
  } catch (error) {
    return {
      task,
      status: 'failed',
      error: {
        message: error.message,
        name: error.name,
      },
    }
  }
}

export async function runSystemManager(payload = {}) {
  const startedAt = new Date().toISOString()
  const config = normalizePayload(payload)
  const queue = await buildTaskQueue(config)
  const results = []

  for (const task of queue) {
    const output = await runTask(task)
    results.push(output)
  }

  const failed = results.filter((item) => item.status === 'failed').length

  return {
    startedAt,
    finishedAt: new Date().toISOString(),
    mode: config.mode,
    metadata: config.metadata,
    summary: {
      total: results.length,
      completed: results.filter((item) => item.status === 'completed').length,
      skipped: results.filter((item) => item.status === 'skipped').length,
      failed,
    },
    results,
    status: failed > 0 ? 'degraded' : 'ok',
  }
}
