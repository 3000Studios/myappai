import { getAnalyticsSnapshot } from '../../server/services/analyticsService.js'
import {
  getContentBundle,
  readJson,
} from '../../server/services/contentService.js'
import { systemRoot } from '../../server/services/platformPaths.js'
import path from 'node:path'

const STATE_FILE = path.join(systemRoot, 'state.json')

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function blogTopicFromContext(analytics, traffic) {
  const queuedTopic = traffic.queue?.[0]?.topic

  if (queuedTopic) {
    return queuedTopic
  }

  if ((analytics.contentCounts?.blog ?? 0) < 3) {
    return 'AI automation'
  }

  return randomChoice([
    'growth automation',
    'AI workflow systems',
    'AI content pipelines',
    'AI traffic generation',
  ])
}

export async function decideNextTasks() {
  const [state, analytics, bundle, traffic] = await Promise.all([
    readJson(STATE_FILE, {}),
    getAnalyticsSnapshot(),
    getContentBundle(),
    readJson(path.join(systemRoot, 'traffic.json'), {
      queue: [],
      published: [],
    }),
  ])

  const tasks = []
  const hour = new Date().getHours()
  const consecutiveFailures = state.scheduler?.consecutiveFailures ?? 0
  const blogCount = bundle.blog?.length ?? 0
  const pageCount = bundle.pages?.length ?? 0
  const queuedTopics = traffic.queue?.length ?? 0
  const publishedPages = traffic.published?.length ?? 0
  const visitors = analytics.visitors ?? 0

  if (consecutiveFailures > 5) {
    return tasks
  }

  if (hour % 3 === 0 || queuedTopics < 2) {
    tasks.push({
      action: 'discover_topics',
      limit: 5,
      seedTopics: ['AI automation', 'growth automation', 'landing pages'],
    })
  }

  if (visitors < 150 || queuedTopics > publishedPages) {
    tasks.push({
      action: 'run_traffic_cycle',
      count: queuedTopics > 4 ? 1 : 2,
      includeImages: true,
      autoDeploy: false,
    })
  }

  if (blogCount < 5 || queuedTopics > 0) {
    tasks.push({
      action: 'create_blog_post',
      topic: blogTopicFromContext(analytics, traffic),
      length: visitors < 500 ? 'medium' : 'long',
      autoDeploy: false,
    })
  }

  if (pageCount < 5 || analytics.conversionRate < 0.1) {
    tasks.push({
      action: 'create_page',
      page: `growth-system-${new Date().toISOString().slice(11, 16).replace(':', '-')}`,
      topic: 'AI powered growth system',
      goal: 'capture qualified leads',
      autoDeploy: false,
    })
  }

  if (
    analytics.aiActivity?.lastAction !== 'deploy_site' &&
    (blogCount > 0 || publishedPages > 0)
  ) {
    tasks.push({
      action: 'deploy_site',
      message: 'AI planner deployment',
    })
  }

  return tasks
}
