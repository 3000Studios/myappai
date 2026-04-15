import './lib/loadEnvironment.js'
import { validateCommand } from '../ai/router/commandRouter.js'
import {
  bootstrapContent,
  getContentBundle,
} from '../server/services/contentService.js'
import { getAnalyticsSnapshot } from '../server/services/analyticsService.js'
import { resolveModelRoute } from '../ai/router/modelRouter.js'
import { previewTrafficTopics } from '../ai/trafficEngine.js'
import { runSystemManager } from '../engine/systemManager.js'

await bootstrapContent()

const content = await getContentBundle()
const analytics = await getAnalyticsSnapshot()
const command = validateCommand({
  action: 'homepage_update',
  value: 'MyAppAI operator platform',
  autoDeploy: false,
})
const modelRoute = await resolveModelRoute({ action: 'homepage_update' })
const discovery = await previewTrafficTopics({ limit: 3 })
const systemManager = await runSystemManager({
  mode: 'single',
  tasks: [
    {
      target: 'external',
      action: 'discover_topics',
      seedTopics: ['AI automation'],
      limit: 2,
    },
  ],
})

console.log(
  JSON.stringify(
    {
      ok: true,
      contentCounts: {
        pages: content.pages.length,
        blog: content.blog.length,
        products: content.products.length,
        system: content.system.length,
      },
      analyticsSummary: {
        visitors: analytics.visitors,
        conversionRate: analytics.conversionRate,
      },
      trafficSummary: {
        queuedTopics: analytics.traffic.queuedTopics,
        discoveredTopics: discovery.topics.length,
      },
      sampleCommand: command,
      modelRoute,
      systemManagerSummary: systemManager.summary,
    },
    null,
    2
  )
)
