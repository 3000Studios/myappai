import { readSystemDocument, writeSystemDocument } from './contentService.js'

const DEFAULT_DEPLOYMENTS = {
  history: [],
}

export async function getDeploymentHistory() {
  return readSystemDocument('deployments.json', DEFAULT_DEPLOYMENTS)
}

export async function recordDeployment(entry) {
  const deployments = await readSystemDocument(
    'deployments.json',
    DEFAULT_DEPLOYMENTS
  )
  deployments.history = [entry, ...(deployments.history ?? [])].slice(0, 20)
  await writeSystemDocument('deployments.json', deployments)
  return deployments
}
