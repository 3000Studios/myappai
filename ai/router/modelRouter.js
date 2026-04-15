import { listAvailableModels } from '../../server/services/ollamaService.js'

const TASK_MODEL_PREFERENCE = {
  code_generation: 'deepseek-coder',
  heavy_code_generation: 'deepseek-coder',
  code_analysis: 'codellama',
  reasoning: 'llama3',
  ui_copy: 'llama3',
  fast_task: 'mistral',
  fallback: 'llama3',
}

function familyMatches(modelName, family) {
  return modelName === family || modelName.startsWith(`${family}:`)
}

function inferTaskType(action) {
  switch (action) {
    case 'generate_feature_section':
      return 'ui_copy'
    case 'create_blog_post':
    case 'create_page':
    case 'update_theme':
      return 'reasoning'
    case 'edit_workspace_file':
      return 'code_generation'
    case 'generate_images':
      return 'fast_task'
    default:
      return 'fallback'
  }
}

export async function resolveModelRoute({
  action,
  taskType,
  complexity = 'standard',
} = {}) {
  const availableModels = await listAvailableModels()
  const inferredTaskType =
    taskType ??
    (complexity === 'high' && action === 'edit_workspace_file'
      ? 'heavy_code_generation'
      : inferTaskType(action))
  const preferredFamily =
    TASK_MODEL_PREFERENCE[inferredTaskType] ?? TASK_MODEL_PREFERENCE.fallback
  const matchedModel = availableModels.find((model) =>
    familyMatches(model.name, preferredFamily)
  )

  return {
    taskType: inferredTaskType,
    preferredFamily,
    model: matchedModel?.name ?? preferredFamily,
    availableModels,
  }
}
