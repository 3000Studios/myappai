import { deploySite } from '../ai/deployment/deployAgent.js'

export async function deployUpdate({ commitMessage, paths = [] } = {}) {
  return deploySite({
    message: typeof commitMessage === 'string' && commitMessage.trim() ? commitMessage.trim() : 'AI voice update',
    paths
  })
}
