import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground.jsx'
import ClawedBot from '../components/ClawedBot.jsx'
import OpenClawPreview from '../components/OpenClawPreview.jsx'
import OpenClawSkills from '../components/OpenClawSkills.jsx'
import './OpenClaw.css'

// Updated OpenClaw with latest features from OpenClaw 2026.4.2
const OpenClaw = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminCode, setAdminCode] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [agents, setAgents] = useState([])
  const [tasks, setTasks] = useState([])
  const [revenue, setRevenue] = useState(0)
  const [isExecuting, setIsExecuting] = useState(false)
  const [command, setCommand] = useState('')
  const [logs, setLogs] = useState([])
  const [currentRequest, setCurrentRequest] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // New OpenClaw 2026.4.2 features
  const [skills, setSkills] = useState([])
  const [canvasEnabled, setCanvasEnabled] = useState(true)
  const [sessions, setSessions] = useState([])
  const [webToolsEnabled, setWebToolsEnabled] = useState(true)
  const [imageGenerationEnabled, setImageGenerationEnabled] = useState(true)
  const [ttsEnabled, setTtsEnabled] = useState(true)

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('openclaw_auth')
    if (auth) {
      setIsAuthenticated(true)
      fetchDashboardData()
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [agentsRes, tasksRes, revenueRes, skillsRes, sessionsRes] =
        await Promise.all([
          fetch('/api/openclaw/agents'),
          fetch('/api/openclaw/tasks'),
          fetch('/api/openclaw/revenue'),
          fetch('/api/openclaw/skills'),
          fetch('/api/openclaw/sessions'),
        ])

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        setAgents(agentsData)
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setTasks(tasksData)
      }

      if (revenueRes.ok) {
        const revenueData = await revenueRes.json()
        setRevenue(revenueData.total || 0)
      }

      if (skillsRes.ok) {
        const skillsData = await skillsRes.json()
        setSkills(skillsData)
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json()
        setSessions(sessionsData)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')

    try {
      const response = await fetch('/api/openclaw/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: adminCode,
          email: adminEmail,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        localStorage.setItem('openclaw_auth', data.token)
        localStorage.setItem('openclaw_user', JSON.stringify(data.user))
        fetchDashboardData()
      } else {
        const errorData = await response.json()
        setAuthError(errorData.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setAuthError('Network error. Please try again.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('openclaw_auth')
    localStorage.removeItem('openclaw_user')
    setActiveTab('dashboard')
  }

  const executeCommand = async () => {
    if (!command.trim()) return

    setIsExecuting(true)
    setIsProcessing(true)

    // Add to logs
    const newLog = {
      id: Date.now(),
      type: 'command',
      content: command,
      timestamp: new Date().toISOString(),
    }
    setLogs((prev) => [newLog, ...prev])

    setCurrentRequest({
      id: Date.now(),
      command,
      status: 'processing',
      timestamp: new Date().toISOString(),
    })

    try {
      const response = await fetch('/api/openclaw/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('openclaw_auth')}`,
        },
        body: JSON.stringify({
          command,
          options: {
            canvas: canvasEnabled,
            webTools: webToolsEnabled,
            imageGeneration: imageGenerationEnabled,
            tts: ttsEnabled,
          },
        }),
      })

      if (response.ok) {
        const result = await response.json()

        // Add result to logs
        const resultLog = {
          id: Date.now() + 1,
          type: 'result',
          content: result.output || 'Command executed successfully',
          timestamp: new Date().toISOString(),
          success: true,
        }
        setLogs((prev) => [resultLog, ...prev])

        // Update current request
        setCurrentRequest((prev) => ({
          ...prev,
          status: 'completed',
          result: result.output,
          completedAt: new Date().toISOString(),
        }))

        // Refresh dashboard data
        fetchDashboardData()
      } else {
        const errorData = await response.json()

        // Add error to logs
        const errorLog = {
          id: Date.now() + 1,
          type: 'error',
          content: errorData.error || 'Command failed',
          timestamp: new Date().toISOString(),
          success: false,
        }
        setLogs((prev) => [errorLog, ...prev])

        setCurrentRequest((prev) => ({
          ...prev,
          status: 'failed',
          error: errorData.error,
          completedAt: new Date().toISOString(),
        }))
      }
    } catch (error) {
      console.error('Command execution error:', error)

      const errorLog = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Network error during command execution',
        timestamp: new Date().toISOString(),
        success: false,
      }
      setLogs((prev) => [errorLog, ...prev])

      setCurrentRequest((prev) => ({
        ...prev,
        status: 'failed',
        error: 'Network error',
        completedAt: new Date().toISOString(),
      }))
    } finally {
      setIsExecuting(false)
      setCommand('')

      // Clear processing state after delay
      setTimeout(() => {
        setIsProcessing(false)
        setCurrentRequest(null)
      }, 3000)
    }
  }

  const handleApprove = () => {
    // Simulate approval
    setCurrentRequest((prev) => ({
      ...prev,
      status: 'approved',
    }))

    setTimeout(() => {
      setIsProcessing(false)
      setCurrentRequest(null)
    }, 2000)
  }

  const handleReject = () => {
    // Simulate rejection
    setCurrentRequest((prev) => ({
      ...prev,
      status: 'rejected',
    }))

    setTimeout(() => {
      setIsProcessing(false)
      setCurrentRequest(null)
    }, 2000)
  }

  const renderDashboardTab = () => (
    <div className="dashboard-tab">
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Active Agents</h3>
          <div className="stat-value">{agents.length}</div>
        </div>
        <div className="stat-card">
          <h3>Running Tasks</h3>
          <div className="stat-value">
            {tasks.filter((t) => t.status === 'running').length}
          </div>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-value">${revenue.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <h3>Active Skills</h3>
          <div className="stat-value">{skills.length}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="agents-section">
          <h3>🤖 Active Agents</h3>
          <div className="agents-grid">
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                className="agent-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: agent.id * 0.1 }}
              >
                <h4>{agent.name}</h4>
                <p>{agent.description}</p>
                <div className="agent-status">
                  <span className={`status-badge ${agent.status}`}>
                    {agent.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="tasks-section">
          <h3>📋 Recent Tasks</h3>
          <div className="tasks-list">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <h4>{task.name}</h4>
                  <p>{task.description}</p>
                </div>
                <div className="task-status">
                  <span className={`status-badge ${task.status}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderSkillsTab = () => (
    <div className="skills-tab">
      <OpenClawSkills
        skills={skills}
        onSkillExecute={(skill) => {
          setCommand(skill.command)
          executeCommand()
        }}
      />
    </div>
  )

  const renderPreviewTab = () => (
    <div className="preview-tab">
      <OpenClawPreview
        currentRequest={currentRequest}
        isProcessing={isProcessing}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )

  const renderSettingsTab = () => (
    <div className="settings-tab">
      <h3>⚙️ OpenClaw Settings</h3>

      <div className="settings-grid">
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={canvasEnabled}
              onChange={(e) => setCanvasEnabled(e.target.checked)}
            />
            Canvas Rendering
          </label>
          <p>Enable live canvas visualization and control</p>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={webToolsEnabled}
              onChange={(e) => setWebToolsEnabled(e.target.checked)}
            />
            Web Tools
          </label>
          <p>Enable web search and fetch capabilities</p>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={imageGenerationEnabled}
              onChange={(e) => setImageGenerationEnabled(e.target.checked)}
            />
            Image Generation
          </label>
          <p>Enable AI image generation tools</p>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={ttsEnabled}
              onChange={(e) => setTtsEnabled(e.target.checked)}
            />
            Text-to-Speech
          </label>
          <p>Enable voice synthesis capabilities</p>
        </div>
      </div>

      <div className="sessions-section">
        <h3>🔄 Active Sessions</h3>
        <div className="sessions-list">
          {sessions.map((session) => (
            <div key={session.id} className="session-item">
              <div className="session-info">
                <h4>{session.id}</h4>
                <p>Started: {new Date(session.createdAt).toLocaleString()}</p>
              </div>
              <div className="session-status">
                <span className={`status-badge ${session.status}`}>
                  {session.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderLogsTab = () => (
    <div className="logs-tab">
      <h3>📝 Activity Logs</h3>
      <div className="logs-container">
        {logs.length === 0 ? (
          <p>No activity yet. Start by executing a command.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`log-item ${log.type} ${log.success ? 'success' : 'error'}`}
            >
              <div className="log-header">
                <span className="log-type">{log.type.toUpperCase()}</span>
                <span className="log-timestamp">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="log-content">{log.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  if (!isAuthenticated) {
    return (
      <div className="openclaw-auth">
        <AnimatedBackground />
        <motion.div
          className="auth-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-header">
            <h1>🦞 OpenClaw Control Center</h1>
            <p>Personal AI Assistant Gateway - Version 2026.4.2</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Admin Code</label>
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter admin code"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {authError && <div className="auth-error">{authError}</div>}

            <button type="submit" className="auth-button">
              Login to OpenClaw
            </button>
          </form>

          <div className="auth-features">
            <h3>🚀 OpenClaw 2026.4.2 Features</h3>
            <ul>
              <li>🎨 Canvas Rendering & Control</li>
              <li>🌐 Web Search & Fetch Tools</li>
              <li>🖼️ AI Image Generation</li>
              <li>🔊 Text-to-Speech Synthesis</li>
              <li>🤖 Multi-Agent Management</li>
              <li>⏰ Cron Job Scheduling</li>
              <li>🔌 Plugin System</li>
              <li>📡 Multi-Channel Support</li>
              <li>🔍 Advanced Analytics</li>
              <li>🛡️ Enhanced Security</li>
            </ul>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="openclaw-dashboard">
      <AnimatedBackground />

      <header className="dashboard-header">
        <div className="header-content">
          <h1>🦞 OpenClaw Control Center</h1>
          <p>Personal AI Assistant Gateway - Version 2026.4.2</p>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            🧩 Skills
          </button>
          <button
            className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            👁️ Preview
          </button>
          <button
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
          <button
            className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📝 Logs
          </button>
        </div>

        <div className="tab-content">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderDashboardTab()}
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderSkillsTab()}
              </motion.div>
            )}

            {activeTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderPreviewTab()}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderSettingsTab()}
              </motion.div>
            )}

            {activeTab === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderLogsTab()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="command-section">
          <div className="command-input-container">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
              placeholder="Enter OpenClaw command..."
              className="command-input"
              disabled={isExecuting}
            />
            <button
              onClick={executeCommand}
              disabled={isExecuting || !command.trim()}
              className="command-button"
            >
              {isExecuting ? '⏳ Executing...' : '🚀 Execute'}
            </button>
          </div>

          <div className="quick-actions">
            <button
              onClick={() => setCommand('canvas present')}
              className="quick-action"
            >
              🎨 Canvas
            </button>
            <button
              onClick={() => setCommand('web search latest AI news')}
              className="quick-action"
            >
              🌐 Search
            </button>
            <button
              onClick={() => setCommand('image generate futuristic city')}
              className="quick-action"
            >
              🖼️ Generate
            </button>
            <button
              onClick={() => setCommand('tts speak "Hello from OpenClaw"')}
              className="quick-action"
            >
              🔊 Speak
            </button>
          </div>
        </div>
      </main>

      <ClawedBot />
    </div>
  )
}

export default OpenClaw
