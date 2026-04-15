import fs from 'node:fs/promises'
import path from 'node:path'
import { decideNextTasks } from '../planner/aiPlanner.js'
import { routeCommand } from '../router/commandRouter.js'
import {
  bootstrapContent,
  readJson,
  writeJson,
} from '../../server/services/contentService.js'
import { repoRoot, systemRoot } from '../../server/services/platformPaths.js'

const TASK_INTERVAL_MS = 60_000
const MAX_CONCURRENT = 1
const LOG_DIR = path.join(repoRoot, 'logs')
const LOG_FILE = path.join(LOG_DIR, 'ai.log')
const STATE_FILE = path.join(systemRoot, 'state.json')
const QUEUE_FILE = path.join(systemRoot, 'task-queue.json')

const TASK_POLICY = {
  create_blog_post: { cooldownMs: 30 * 60_000 },
  create_page: { cooldownMs: 45 * 60_000 },
  run_traffic_cycle: { cooldownMs: 20 * 60_000 },
  discover_topics: { cooldownMs: 15 * 60_000 },
  deploy_site: { cooldownMs: 20 * 60_000 },
}

let runningCount = 0
let tickInProgress = false

function nowIso() {
  return new Date().toISOString()
}

async function ensureRuntimeFiles() {
  await bootstrapContent()
  await fs.mkdir(LOG_DIR, { recursive: true })

  try {
    await fs.access(STATE_FILE)
  } catch {
    await writeJson(STATE_FILE, {
      scheduler: {
        status: 'idle',
        lastTickAt: null,
        lastTaskAt: null,
        lastCompletedTaskAt: null,
        lastErrorAt: null,
        consecutiveFailures: 0,
      },
      tasks: {},
    })
  }

  try {
    await fs.access(QUEUE_FILE)
  } catch {
    await writeJson(QUEUE_FILE, { queue: [] })
  }
}

async function appendLog(message, details) {
  const line = `[${nowIso()}] ${message}${details ? ` ${JSON.stringify(details)}` : ''}\n`
  await fs.appendFile(LOG_FILE, line, 'utf8')
  console.log(line.trim())
}

async function readState() {
  return readJson(STATE_FILE, {
    scheduler: {
      status: 'idle',
      lastTickAt: null,
      lastTaskAt: null,
      lastCompletedTaskAt: null,
      lastErrorAt: null,
      consecutiveFailures: 0,
    },
    tasks: {},
  })
}

async function writeState(state) {
  await writeJson(STATE_FILE, state)
}

async function readQueue() {
  return readJson(QUEUE_FILE, { queue: [] })
}

async function writeQueue(queue) {
  await writeJson(QUEUE_FILE, { queue })
}

function getTaskDefinition(taskId) {
  return TASK_POLICY[taskId] ?? null
}

function isTaskCoolingDown(taskState, cooldownMs) {
  if (!taskState?.lastRunAt) {
    return false
  }

  return Date.now() - new Date(taskState.lastRunAt).getTime() < cooldownMs
}

async function enqueueEligibleTasks(state, queueDocument) {
  const queue = Array.isArray(queueDocument.queue) ? queueDocument.queue : []
  const queuedTaskIds = new Set(queue.map((entry) => entry.taskId))
  const plannedTasks = await decideNextTasks()
  let queueChanged = false

  for (const task of plannedTasks) {
    const taskId = task.action
    const policy = getTaskDefinition(taskId)
    const taskState = state.tasks?.[taskId]
    const taskIsRunning = taskState?.status === 'running'
    const taskIsQueued = queuedTaskIds.has(taskId)
    const coolingDown = isTaskCoolingDown(taskState, policy?.cooldownMs ?? 0)

    if (taskIsRunning || taskIsQueued || coolingDown) {
      continue
    }

    queue.push({
      id: `${taskId}-${Date.now()}`,
      taskId,
      command: task,
      queuedAt: nowIso(),
    })
    queuedTaskIds.add(taskId)
    queueChanged = true
  }

  if (queueChanged) {
    await writeQueue(queue)
    await appendLog('Queued eligible tasks', {
      queuedTasks: queue.map((entry) => entry.taskId),
    })
  }

  return queue
}

async function executeNextTask(state, queue) {
  if (!queue.length || runningCount >= MAX_CONCURRENT) {
    return false
  }

  const nextTask = queue.shift()
  runningCount += 1

  state.scheduler.status = 'running'
  state.scheduler.lastTaskAt = nowIso()
  state.tasks[nextTask.taskId] = {
    ...(state.tasks[nextTask.taskId] ?? {}),
    status: 'running',
    lastQueuedAt: nextTask.queuedAt,
  }
  await writeQueue(queue)
  await writeState(state)
  await appendLog('Starting task', {
    taskId: nextTask.taskId,
    command: nextTask.command,
  })

  try {
    const result = await routeCommand(nextTask.command)
    state.scheduler.status = 'idle'
    state.scheduler.lastCompletedTaskAt = nowIso()
    state.scheduler.consecutiveFailures = 0
    state.tasks[nextTask.taskId] = {
      status: 'idle',
      lastRunAt: nowIso(),
      lastSuccessAt: nowIso(),
      lastResult: {
        action: result.action,
        success: result.success,
      },
    }
    await appendLog('Task completed', {
      taskId: nextTask.taskId,
      action: result.action,
      success: result.success,
    })
  } catch (error) {
    state.scheduler.status = 'error'
    state.scheduler.lastErrorAt = nowIso()
    state.scheduler.consecutiveFailures += 1
    state.tasks[nextTask.taskId] = {
      ...(state.tasks[nextTask.taskId] ?? {}),
      status: 'idle',
      lastRunAt: nowIso(),
      lastErrorAt: nowIso(),
      lastError: error.message,
    }
    await appendLog('Task failed', {
      taskId: nextTask.taskId,
      error: error.message,
    })
  } finally {
    runningCount -= 1
    await writeState(state)
  }

  return true
}

async function schedulerTick() {
  if (tickInProgress) {
    await appendLog('Tick skipped because a previous tick is still active')
    return
  }

  tickInProgress = true

  try {
    const state = await readState()
    state.scheduler.lastTickAt = nowIso()
    state.tasks ??= {}

    const queueDocument = await readQueue()
    const queue = await enqueueEligibleTasks(state, queueDocument)

    await writeState(state)
    await executeNextTask(state, queue)
  } catch (error) {
    await appendLog('Scheduler tick failed', { error: error.message })
  } finally {
    tickInProgress = false
  }
}

async function main() {
  await ensureRuntimeFiles()
  await appendLog('AI scheduler started', {
    intervalMs: TASK_INTERVAL_MS,
    maxConcurrent: MAX_CONCURRENT,
    queueFile: path.relative(repoRoot, QUEUE_FILE),
    stateFile: path.relative(repoRoot, STATE_FILE),
  })

  await schedulerTick()
  setInterval(() => {
    schedulerTick().catch((error) => {
      console.error(error)
    })
  }, TASK_INTERVAL_MS)
}

main().catch(async (error) => {
  console.error(error)
  try {
    await appendLog('Scheduler crashed', { error: error.message })
  } catch {
    // Swallow logging errors during crash shutdown.
  }
  process.exitCode = 1
})
