import {
  generateBlogPost,
  generateFeatureSection,
  generateLandingPage,
} from '../generators/contentGenerator.js'
import { generateBackground, generateImages } from '../media/mediaEngine.js'
import { deploySite } from '../deployment/deployAgent.js'
import { previewTrafficTopics, runTrafficCycle } from '../trafficEngine.js'
import {
  createPage,
  editWorkspaceFile,
  saveBlogPost,
  updatePageContent,
  updateTheme,
  upsertFeatureSection,
} from '../../server/services/contentService.js'
import { recordAiActivity } from '../../server/services/analyticsService.js'

const SUPPORTED_ACTIONS = new Set([
  'create_page',
  'create_landing_page',
  'update_content',
  'homepage_update',
  'metadata_update',
  'ui_refresh',
  'repo_file_edit',
  'research_and_apply',
  'create_blog_post',
  'generate_images',
  'generate_background',
  'deploy_site',
  'update_theme',
  'generate_feature_section',
  'edit_workspace_file',
  'run_traffic_cycle',
  'discover_topics',
])

function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${name} must be an object.`)
  }
}

function assertString(value, name) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${name} must be a non-empty string.`)
  }

  return value.trim()
}

function parseAutoDeploy(command, defaultValue = true) {
  return typeof command.autoDeploy === 'boolean'
    ? command.autoDeploy
    : defaultValue
}

export function validateCommand(input) {
  assertObject(input, 'Command')
  const originalAction = assertString(input.action, 'action')
  const action =
    originalAction === 'create_landing_page'
      ? 'create_page'
      : originalAction === 'homepage_update'
        ? 'update_content'
        : originalAction === 'metadata_update'
          ? 'edit_workspace_file'
          : originalAction === 'ui_refresh'
            ? 'edit_workspace_file'
            : originalAction === 'repo_file_edit'
              ? 'edit_workspace_file'
              : originalAction === 'research_and_apply'
                ? 'discover_topics'
                : originalAction

  if (!SUPPORTED_ACTIONS.has(originalAction)) {
    throw new Error(`Unsupported action "${originalAction}".`)
  }

  switch (action) {
    case 'create_page':
      return {
        action,
        page: assertString(input.page ?? input.topic ?? 'landing-page', 'page'),
        topic: typeof input.topic === 'string' ? input.topic : input.page,
        goal: typeof input.goal === 'string' ? input.goal : 'generate leads',
        autoDeploy: parseAutoDeploy(input),
      }
    case 'update_content':
      return {
        action,
        page: assertString(input.page ?? 'homepage', 'page'),
        field: assertString(input.field ?? 'subheadline', 'field'),
        value: input.value,
        autoDeploy: parseAutoDeploy(input),
      }
    case 'create_blog_post':
      return {
        action,
        topic: assertString(input.topic, 'topic'),
        length: typeof input.length === 'string' ? input.length : 'medium',
        autoDeploy: parseAutoDeploy(input),
      }
    case 'generate_images':
      return {
        action,
        query: assertString(input.query ?? input.topic, 'query'),
        count: Number.isInteger(input.count) ? input.count : 1,
        provider:
          typeof input.provider === 'string' ? input.provider : undefined,
        autoDeploy: parseAutoDeploy(input),
      }
    case 'generate_background':
      return {
        action,
        query: assertString(input.query ?? input.topic, 'query'),
        palette: Array.isArray(input.palette) ? input.palette : undefined,
        autoDeploy: parseAutoDeploy(input),
      }
    case 'deploy_site':
      return {
        action,
        message:
          typeof input.message === 'string' ? input.message : 'AI update',
      }
    case 'update_theme':
      return {
        action,
        theme: input.theme ?? { palette: input.palette ?? {} },
        autoDeploy: parseAutoDeploy(input),
      }
    case 'generate_feature_section':
      return {
        action,
        product: assertString(input.product, 'product'),
        topic:
          typeof input.topic === 'string' ? input.topic : 'AI orchestration',
        autoDeploy: parseAutoDeploy(input),
      }
    case 'edit_workspace_file':
      return {
        action,
        targetPath: assertString(
          input.targetPath ?? 'frontend/src/siteMeta.js',
          'targetPath'
        ),
        contents: assertString(input.contents ?? input.prompt, 'contents'),
        append: Boolean(input.append),
        autoDeploy: parseAutoDeploy(input),
      }
    case 'run_traffic_cycle':
      return {
        action,
        seedTopics: Array.isArray(input.seedTopics) ? input.seedTopics : [],
        count: Number.isInteger(input.count) ? input.count : 2,
        includeImages:
          typeof input.includeImages === 'boolean' ? input.includeImages : true,
        autoDeploy: parseAutoDeploy(input),
      }
    case 'discover_topics':
      return {
        action,
        seedTopics: Array.isArray(input.seedTopics) ? input.seedTopics : [],
        limit: Number.isInteger(input.limit) ? input.limit : 6,
        autoDeploy: false,
      }
    default:
      throw new Error(`Unhandled action "${action}".`)
  }
}

async function maybeDeploy(command, fallbackMessage, paths = []) {
  if (!command.autoDeploy) {
    return null
  }

  return deploySite({
    message: command.message ?? fallbackMessage,
    paths,
  })
}

export async function routeCommand(input) {
  const command = validateCommand(input)
  await recordAiActivity(command.action)

  switch (command.action) {
    case 'create_page': {
      const generated = await generateLandingPage(command)
      const page = await createPage(command.page, generated.payload)
      const deployment = await maybeDeploy(
        command,
        `AI create page: ${command.page}`,
        [page.filePath]
      )
      return {
        success: true,
        action: command.action,
        model: generated.model,
        provider: generated.provider,
        page,
        deployment,
      }
    }
    case 'update_content': {
      const page = await updatePageContent(
        command.page,
        command.field,
        command.value
      )
      const deployment = await maybeDeploy(
        command,
        `AI update content: ${command.page}.${command.field}`,
        [page.filePath]
      )
      return { success: true, action: command.action, page, deployment }
    }
    case 'create_blog_post': {
      const generated = await generateBlogPost(command)
      const post = await saveBlogPost(generated.payload)
      const deployment = await maybeDeploy(
        command,
        `AI blog: ${generated.payload.title ?? command.topic}`,
        [post.filePath, 'content/blog/index.json']
      )
      return {
        success: true,
        action: command.action,
        model: generated.model,
        provider: generated.provider,
        post,
        deployment,
      }
    }
    case 'generate_images': {
      const assets = await generateImages(command)
      const deployment = await maybeDeploy(
        command,
        `AI media: ${command.query}`
      )
      return { success: true, action: command.action, assets, deployment }
    }
    case 'generate_background': {
      const asset = await generateBackground(command)
      const deployment = await maybeDeploy(
        command,
        `AI background: ${command.query}`
      )
      return { success: true, action: command.action, asset, deployment }
    }
    case 'deploy_site': {
      const deployment = await deploySite({ message: command.message })
      return { success: true, action: command.action, deployment }
    }
    case 'update_theme': {
      const theme = await updateTheme(command.theme)
      const deployment = await maybeDeploy(command, 'AI theme update', [
        theme.filePath,
      ])
      return { success: true, action: command.action, theme, deployment }
    }
    case 'generate_feature_section': {
      const generated = await generateFeatureSection(command)
      const featurePage = await upsertFeatureSection(generated.payload)
      const deployment = await maybeDeploy(
        command,
        `AI feature section: ${command.product}`,
        [featurePage.filePath]
      )
      return {
        success: true,
        action: command.action,
        model: generated.model,
        provider: generated.provider,
        featurePage,
        deployment,
      }
    }
    case 'edit_workspace_file': {
      const file = await editWorkspaceFile(command)
      const deployment = await maybeDeploy(
        command,
        `AI workspace edit: ${command.targetPath}`,
        [file.filePath]
      )
      return { success: true, action: command.action, file, deployment }
    }
    case 'run_traffic_cycle': {
      const cycle = await runTrafficCycle(command)
      const deployment = await maybeDeploy(
        command,
        `AI traffic cycle: ${cycle.generated.length} pages`
      )
      return { success: true, action: command.action, cycle, deployment }
    }
    case 'discover_topics': {
      const discovery = await previewTrafficTopics(command)
      return { success: true, action: command.action, discovery }
    }
    default:
      throw new Error(`Unhandled action "${command.action}".`)
  }
}
