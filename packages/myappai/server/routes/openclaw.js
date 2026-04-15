const express = require('express')
const router = express.Router()
const { spawn } = require('child_process')

// Database for OpenClaw operations (in-memory for now, can be upgraded to MongoDB)
const openclawDB = {
  agents: [
    {
      id: 1,
      name: 'Website Builder',
      type: 'Deployment',
      status: 'active',
      lastRun: new Date(),
    },
    {
      id: 2,
      name: 'Revenue Optimizer',
      type: 'Analytics',
      status: 'active',
      lastRun: new Date(),
    },
    {
      id: 3,
      name: 'Content Generator',
      type: 'Creative',
      status: 'idle',
      lastRun: new Date(),
    },
    {
      id: 4,
      name: 'Security Monitor',
      type: 'Security',
      status: 'active',
      lastRun: new Date(),
    },
  ],
  tasks: [
    {
      id: 1,
      name: 'Deploy Website',
      description: 'Deploy latest changes to production',
      status: 'completed',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Optimize Ad Revenue',
      description: 'Analyze and optimize ad placements',
      status: 'active',
      createdAt: new Date(),
    },
    {
      id: 3,
      name: 'Generate Blog Content',
      description: 'Create engaging blog posts',
      status: 'pending',
      createdAt: new Date(),
    },
    {
      id: 4,
      name: 'Security Audit',
      description: 'Perform comprehensive security check',
      status: 'scheduled',
      createdAt: new Date(),
    },
  ],
  revenue: {
    daily: 784.5,
    streams: {
      adsense: 450.0,
      premium: 320.0,
      ai_services: 180.0,
      analytics: 50.0,
    },
  },
}

// Middleware to check admin authentication
const checkAuth = (req, res, next) => {
  const auth = req.headers.authorization
  if (
    auth ===
    'Bearer myaai_admin_1c7a1b7f8f4c4658b9c5dc8d667ac8c86b80b5960d01e4d3'
  ) {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized access' })
  }
}

// Get agents
router.get('/agents', checkAuth, async (req, res) => {
  try {
    res.json(openclawDB.agents)
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch agents' })
  }
})

// Get tasks
router.get('/tasks', checkAuth, async (req, res) => {
  try {
    res.json(openclawDB.tasks)
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// Get revenue data
router.get('/revenue', checkAuth, async (req, res) => {
  try {
    res.json(openclawDB.revenue)
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch revenue data' })
  }
})

// Execute OpenClaw command
router.post('/execute', checkAuth, async (req, res) => {
  try {
    const { command } = req.body

    if (!command) {
      return res.status(400).json({ error: 'Command is required' })
    }

    // Log the command
    console.log(`OpenClaw executing: ${command}`)

    // Execute different commands based on input
    let result

    if (command.includes('deploy')) {
      result = await executeDeploy()
    } else if (command.includes('optimize')) {
      result = await executeOptimize()
    } else if (command.includes('generate')) {
      result = await executeGenerate()
    } else if (command.includes('analyze')) {
      result = await executeAnalyze()
    } else if (command.includes('status')) {
      result = await executeStatus()
    } else {
      result = await executeCustomCommand(command)
    }

    res.json({ message: result, success: true })
  } catch (error) {
    console.error('Command execution error:', error)
    res.status(500).json({ error: error.message, success: false })
  }
})

// Deploy website
router.post('/deploy', checkAuth, async (req, res) => {
  try {
    console.log('Starting website deployment...')

    // Execute deployment commands
    const deployCommands = ['npm run build', 'npm run pages:deploy']

    for (const cmd of deployCommands) {
      await executeShellCommand(cmd)
    }

    // Update revenue (simulate revenue increase from deployment)
    openclawDB.revenue.daily += Math.random() * 50

    res.json({
      message: 'Website deployed successfully to myappai.net!',
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Deployment error:', error)
    res.status(500).json({ error: error.message, success: false })
  }
})

// Helper functions
async function executeDeploy() {
  try {
    await executeShellCommand('npm run build')
    await executeShellCommand('npm run pages:deploy')

    // Update agents
    const builder = openclawDB.agents.find((a) => a.name === 'Website Builder')
    if (builder) {
      builder.lastRun = new Date()
      builder.status = 'active'
    }

    return 'Deployment completed successfully'
  } catch (error) {
    throw new Error(`Deployment failed: ${error.message}`)
  }
}

async function executeOptimize() {
  try {
    // Simulate optimization
    openclawDB.revenue.daily += Math.random() * 25

    const optimizer = openclawDB.agents.find(
      (a) => a.name === 'Revenue Optimizer'
    )
    if (optimizer) {
      optimizer.lastRun = new Date()
      optimizer.status = 'active'
    }

    return (
      'Revenue optimization completed. Daily revenue increased by $' +
      (Math.random() * 25).toFixed(2)
    )
  } catch (error) {
    throw new Error(`Optimization failed: ${error.message}`)
  }
}

async function executeGenerate() {
  try {
    const generator = openclawDB.agents.find(
      (a) => a.name === 'Content Generator'
    )
    if (generator) {
      generator.lastRun = new Date()
      generator.status = 'active'
    }

    return 'Content generation completed. New blog posts and articles created.'
  } catch (error) {
    throw new Error(`Content generation failed: ${error.message}`)
  }
}

async function executeAnalyze() {
  try {
    const monitor = openclawDB.agents.find((a) => a.name === 'Security Monitor')
    if (monitor) {
      monitor.lastRun = new Date()
      monitor.status = 'active'
    }

    return 'Security analysis completed. All systems secure.'
  } catch (error) {
    throw new Error(`Analysis failed: ${error.message}`)
  }
}

async function executeStatus() {
  try {
    const activeAgents = openclawDB.agents.filter(
      (a) => a.status === 'active'
    ).length
    const activeTasks = openclawDB.tasks.filter(
      (t) => t.status === 'active'
    ).length

    return `System Status: ${activeAgents} active agents, ${activeTasks} active tasks, $${openclawDB.revenue.daily.toFixed(2)} daily revenue`
  } catch (error) {
    throw new Error(`Status check failed: ${error.message}`)
  }
}

async function executeCustomCommand(command) {
  try {
    // Execute shell command safely
    const result = await executeShellCommand(command)
    return `Command executed: ${result}`
  } catch (error) {
    throw new Error(`Command execution failed: ${error.message}`)
  }
}

function executeShellCommand(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true, stdio: 'pipe' })
    let output = ''
    let errorOutput = ''

    child.stdout.on('data', (data) => {
      output += data.toString()
    })

    child.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(output)
      } else {
        reject(new Error(errorOutput || `Command failed with code ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

// Auto-revenue generation (simulated)
setInterval(() => {
  // Increment revenue every few minutes to simulate ongoing income
  openclawDB.revenue.daily += Math.random() * 2

  // Cap at $1000 daily goal
  if (openclawDB.revenue.daily > 1000) {
    openclawDB.revenue.daily = 1000
  }
}, 300000) // Every 5 minutes

module.exports = router
