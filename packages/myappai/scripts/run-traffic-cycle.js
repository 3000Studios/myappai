import { runTrafficCycle } from '../ai/trafficEngine.js'
import { bootstrapContent } from '../server/services/contentService.js'

await bootstrapContent()

const count = Number.parseInt(process.argv[2] ?? '2', 10)
const result = await runTrafficCycle({
  count: Number.isNaN(count) ? 2 : count,
  includeImages: true,
})

console.log(JSON.stringify(result, null, 2))
