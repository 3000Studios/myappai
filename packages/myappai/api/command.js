import express from 'express'
import { runSystemManager } from '../engine/systemManager.js'
import {
  runOperatorPrompt,
  runStructuredOperatorAction,
} from '../server/services/operatorService.js'

const router = express.Router()

export async function executeRepositoryCommand(payload) {
  const command =
    typeof payload?.command === 'string' ? payload.command.trim() : ''

  if (command) {
    return runOperatorPrompt(command, {
      shipLiveAfterEdit: Boolean(payload?.shipLiveAfterEdit),
    })
  }

  if (
    payload &&
    (typeof payload.mode === 'string' ||
      (Array.isArray(payload.tasks) && payload.tasks.length > 0))
  ) {
    return runSystemManager(payload)
  }

  if (payload && typeof payload.action === 'string') {
    return runStructuredOperatorAction(payload)
  }

  if (!command) {
    const error = new Error('Missing command')
    error.statusCode = 400
    throw error
  }

  return runOperatorPrompt(command)
}

router.post('/', async (request, response, next) => {
  try {
    const result = await executeRepositoryCommand(request.body)
    response.json(result)
  } catch (error) {
    if (error.statusCode) {
      response.status(error.statusCode).json({ error: error.message })
      return
    }

    next(error)
  }
})

export default router
