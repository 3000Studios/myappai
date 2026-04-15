import path from 'node:path'
import { repoRoot } from '../server/services/platformPaths.js'

const targetPath = path.join(repoRoot, '.secrets', 'myappai.local.env')

console.log(targetPath)
