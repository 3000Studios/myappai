import './lib/loadEnvironment.js'
import { deploySite } from '../ai/deployment/deployAgent.js'
import { bootstrapContent } from '../server/services/contentService.js'

await bootstrapContent()

const message = process.argv[2] ?? 'AI update'
const result = await deploySite({ message })

console.log(JSON.stringify(result, null, 2))
