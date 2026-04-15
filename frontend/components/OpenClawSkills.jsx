import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './OpenClawSkills.css'

const OpenClawSkills = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const skills = {
    development: [
      {
        id: 'create-page',
        name: 'Create New Page',
        description: 'Generate complete web pages with modern design',
        icon: '📄',
        status: 'active',
        usage: 45,
        success: 98,
        commands: ['create page', 'add new page', 'build page'],
        examples: [
          'Create a pricing page with 3 tiers',
          'Add an about us page with team section',
          'Build a contact page with form',
        ],
      },
      {
        id: 'deploy-website',
        name: 'Deploy Website',
        description: 'Deploy changes to production instantly',
        icon: '🚀',
        status: 'active',
        usage: 67,
        success: 99,
        commands: ['deploy', 'go live', 'publish'],
        examples: [
          'Deploy the website now',
          'Go live with changes',
          'Publish to production',
        ],
      },
      {
        id: 'optimize-code',
        name: 'Code Optimization',
        description: 'Optimize performance and fix issues',
        icon: '⚡',
        status: 'active',
        usage: 23,
        success: 95,
        commands: ['optimize', 'speed up', 'fix performance'],
        examples: [
          'Optimize the website speed',
          'Fix performance issues',
          'Make the site faster',
        ],
      },
    ],
    monetization: [
      {
        id: 'setup-revenue',
        name: 'Revenue Setup',
        description: 'Configure multiple revenue streams',
        icon: '💰',
        status: 'active',
        usage: 34,
        success: 92,
        commands: ['add revenue', 'monetize', 'setup payments'],
        examples: [
          'Add revenue streams',
          'Setup payment processing',
          'Monetize the website',
        ],
      },
      {
        id: 'adsense-config',
        name: 'AdSense Configuration',
        description: 'Setup and optimize Google AdSense',
        icon: '🎯',
        status: 'active',
        usage: 28,
        success: 96,
        commands: ['setup adsense', 'configure ads', 'add advertising'],
        examples: [
          'Setup Google AdSense',
          'Configure ad placements',
          'Add advertising to site',
        ],
      },
      {
        id: 'premium-features',
        name: 'Premium Features',
        description: 'Create subscription-based features',
        icon: '💳',
        status: 'active',
        usage: 19,
        success: 89,
        commands: ['add premium', 'create subscription', 'vip features'],
        examples: [
          'Add premium features',
          'Create VIP subscription',
          'Setup paid content',
        ],
      },
    ],
    content: [
      {
        id: 'generate-content',
        name: 'Content Generation',
        description: 'AI-powered content creation',
        icon: '✍️',
        status: 'active',
        usage: 56,
        success: 94,
        commands: ['write content', 'generate text', 'create copy'],
        examples: [
          'Write homepage content',
          'Generate blog posts',
          'Create product descriptions',
        ],
      },
      {
        id: 'seo-optimization',
        name: 'SEO Optimization',
        description: 'Improve search engine rankings',
        icon: '🔍',
        status: 'active',
        usage: 31,
        success: 91,
        commands: ['optimize seo', 'improve rankings', 'add meta tags'],
        examples: [
          'Optimize for SEO',
          'Improve search rankings',
          'Add meta descriptions',
        ],
      },
      {
        id: 'media-management',
        name: 'Media Management',
        description: 'Handle images, videos, and media',
        icon: '🎬',
        status: 'active',
        usage: 22,
        success: 97,
        commands: ['add images', 'upload video', 'manage media'],
        examples: [
          'Add hero images',
          'Upload product videos',
          'Optimize media files',
        ],
      },
    ],
    analytics: [
      {
        id: 'traffic-analysis',
        name: 'Traffic Analysis',
        description: 'Monitor website traffic and users',
        icon: '📊',
        status: 'active',
        usage: 41,
        success: 100,
        commands: ['show analytics', 'traffic stats', 'user data'],
        examples: [
          'Show website analytics',
          'Display traffic statistics',
          'Analyze user behavior',
        ],
      },
      {
        id: 'revenue-tracking',
        name: 'Revenue Tracking',
        description: 'Monitor income and revenue streams',
        icon: '💵',
        status: 'active',
        usage: 38,
        success: 100,
        commands: ['show revenue', 'income stats', 'earnings report'],
        examples: [
          'Show revenue dashboard',
          'Display earnings report',
          'Track income sources',
        ],
      },
      {
        id: 'performance-metrics',
        name: 'Performance Metrics',
        description: 'Monitor site performance and health',
        icon: '📈',
        status: 'active',
        usage: 29,
        success: 98,
        commands: ['performance metrics', 'site health', 'speed test'],
        examples: [
          'Show performance metrics',
          'Check site health',
          'Run speed test',
        ],
      },
    ],
    automation: [
      {
        id: 'auto-optimization',
        name: 'Auto Optimization',
        description: 'Continuous AI optimization',
        icon: '🤖',
        status: 'active',
        usage: 52,
        success: 93,
        commands: ['auto optimize', 'improve automatically', 'ai optimization'],
        examples: [
          'Auto optimize the site',
          'Run AI improvements',
          'Optimize automatically',
        ],
      },
      {
        id: 'scheduled-tasks',
        name: 'Scheduled Tasks',
        description: 'Automated recurring tasks',
        icon: '⏰',
        status: 'active',
        usage: 18,
        success: 96,
        commands: ['schedule task', 'automate daily', 'recurring job'],
        examples: [
          'Schedule daily backups',
          'Automate content updates',
          'Setup recurring tasks',
        ],
      },
      {
        id: 'smart-deployment',
        name: 'Smart Deployment',
        description: 'Intelligent deployment strategies',
        icon: '🎯',
        status: 'active',
        usage: 35,
        success: 97,
        commands: ['smart deploy', 'intelligent release', 'auto deployment'],
        examples: [
          'Deploy with smart strategy',
          'Use intelligent deployment',
          'Auto-release updates',
        ],
      },
    ],
  }

  const categories = {
    all: {
      name: 'All Skills',
      icon: '🦞',
      count: Object.values(skills).flat().length,
    },
    development: {
      name: 'Development',
      icon: '💻',
      count: skills.development.length,
    },
    monetization: {
      name: 'Monetization',
      icon: '💰',
      count: skills.monetization.length,
    },
    content: { name: 'Content', icon: '✍️', count: skills.content.length },
    analytics: {
      name: 'Analytics',
      icon: '📊',
      count: skills.analytics.length,
    },
    automation: {
      name: 'Automation',
      icon: '🤖',
      count: skills.automation.length,
    },
  }

  const filteredSkills = Object.entries(skills).reduce(
    (acc, [category, categorySkills]) => {
      const filtered = categorySkills.filter(
        (skill) =>
          (activeCategory === 'all' || category === activeCategory) &&
          (searchTerm === '' ||
            skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            skill.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            skill.commands.some((cmd) =>
              cmd.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      )

      if (filtered.length > 0) {
        acc[category] = filtered
      }
      return acc
    },
    {}
  )

  const executeSkill = async (skillId) => {
    setIsExecuting(true)
    // Simulate skill execution
    setTimeout(() => {
      setIsExecuting(false)
      setSelectedSkill(null)
    }, 2000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#00ff88'
      case 'inactive':
        return '#666'
      case 'error':
        return '#ff3366'
      default:
        return '#b8bcc8'
    }
  }

  const getUsageColor = (usage) => {
    if (usage >= 50) return '#00ff88'
    if (usage >= 25) return '#ffaa00'
    return '#ff3366'
  }

  return (
    <div className="openclaw-skills">
      <div className="skills-header">
        <h2>🦞 OpenClaw Skills Dashboard</h2>
        <p>Monitor and manage all AI capabilities and automation skills</p>

        <div className="skills-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>

          <div className="category-tabs">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`category-tab ${activeCategory === key ? 'active' : ''}`}
              >
                <span className="tab-icon">{category.icon}</span>
                <span className="tab-name">{category.name}</span>
                <span className="tab-count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="skills-overview">
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-icon">🦞</div>
            <div className="stat-value">{categories.all.count}</div>
            <div className="stat-label">Total Skills</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">
              {
                Object.values(skills)
                  .flat()
                  .filter((s) => s.status === 'active').length
              }
            </div>
            <div className="stat-label">Active Skills</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-value">
              {Math.round(
                Object.values(skills)
                  .flat()
                  .reduce((acc, s) => acc + s.success, 0) /
                  Object.values(skills).flat().length
              )}
              %
            </div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">
              {Math.round(
                Object.values(skills)
                  .flat()
                  .reduce((acc, s) => acc + s.usage, 0) /
                  Object.values(skills).flat().length
              )}
              %
            </div>
            <div className="stat-label">Usage Rate</div>
          </div>
        </div>
      </div>

      <div className="skills-content">
        {Object.entries(filteredSkills).map(([category, categorySkills]) => (
          <div key={category} className="skill-category">
            <h3 className="category-title">
              <span className="category-icon">{categories[category].icon}</span>
              {categories[category].name}
            </h3>

            <div className="skills-grid">
              {categorySkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  className="skill-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedSkill(skill)}
                >
                  <div className="skill-header">
                    <div className="skill-icon">{skill.icon}</div>
                    <div
                      className="skill-status"
                      style={{ color: getStatusColor(skill.status) }}
                    >
                      {skill.status}
                    </div>
                  </div>

                  <h4 className="skill-name">{skill.name}</h4>
                  <p className="skill-description">{skill.description}</p>

                  <div className="skill-metrics">
                    <div className="metric">
                      <span className="metric-label">Usage</span>
                      <div className="metric-bar">
                        <div
                          className="metric-fill"
                          style={{
                            width: `${skill.usage}%`,
                            backgroundColor: getUsageColor(skill.usage),
                          }}
                        />
                      </div>
                      <span className="metric-value">{skill.usage}%</span>
                    </div>

                    <div className="metric">
                      <span className="metric-label">Success</span>
                      <div className="metric-bar">
                        <div
                          className="metric-fill"
                          style={{
                            width: `${skill.success}%`,
                            backgroundColor:
                              skill.success >= 95 ? '#00ff88' : '#ffaa00',
                          }}
                        />
                      </div>
                      <span className="metric-value">{skill.success}%</span>
                    </div>
                  </div>

                  <div className="skill-commands">
                    <div className="commands-label">Voice Commands:</div>
                    <div className="commands-list">
                      {skill.commands.slice(0, 3).map((cmd, index) => (
                        <span key={index} className="command-tag">
                          {cmd}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            className="skill-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              className="skill-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-skill-info">
                  <div className="modal-skill-icon">{selectedSkill.icon}</div>
                  <div>
                    <h3>{selectedSkill.name}</h3>
                    <p>{selectedSkill.description}</p>
                  </div>
                </div>
                <button
                  className="modal-close"
                  onClick={() => setSelectedSkill(null)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-content">
                <div className="skill-details">
                  <div className="detail-section">
                    <h4>Performance Metrics</h4>
                    <div className="metrics-grid">
                      <div className="metric-card">
                        <div className="metric-icon">📊</div>
                        <div className="metric-data">
                          <span className="metric-value">
                            {selectedSkill.usage}%
                          </span>
                          <span className="metric-label">Usage Rate</span>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">✅</div>
                        <div className="metric-data">
                          <span className="metric-value">
                            {selectedSkill.success}%
                          </span>
                          <span className="metric-label">Success Rate</span>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">🔄</div>
                        <div className="metric-data">
                          <span className="metric-value">
                            {Math.round(selectedSkill.usage * 2.3)}
                          </span>
                          <span className="metric-label">Executions</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Voice Commands</h4>
                    <div className="commands-grid">
                      {selectedSkill.commands.map((cmd, index) => (
                        <div key={index} className="command-card">
                          <span className="command-text">{cmd}</span>
                          <button className="try-command">Try</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Example Usage</h4>
                    <div className="examples-list">
                      {selectedSkill.examples.map((example, index) => (
                        <div key={index} className="example-item">
                          <span className="example-text">"{example}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <motion.button
                    className="execute-skill-btn"
                    onClick={() => executeSkill(selectedSkill.id)}
                    disabled={isExecuting}
                    whileHover={{ scale: isExecuting ? 1 : 1.05 }}
                    whileTap={{ scale: isExecuting ? 1 : 0.95 }}
                  >
                    {isExecuting ? (
                      <>
                        <div className="spinner"></div>
                        Executing...
                      </>
                    ) : (
                      <>🚀 Execute Skill</>
                    )}
                  </motion.button>

                  <button
                    className="configure-skill-btn"
                    onClick={() => setSelectedSkill(null)}
                  >
                    ⚙️ Configure
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OpenClawSkills
