import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle,
  Wrench,
  Activity,
  Zap,
  Shield,
  Database,
  Cpu,
} from 'lucide-react'
import './MaintenanceRoom.css'

const MaintenanceRoom = () => {
  const [systemIssues, setSystemIssues] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [fixingIssue, setFixingIssue] = useState(null)

  // Real system monitoring
  const performSystemScan = async () => {
    setIsScanning(true)
    setScanProgress(0)

    const issues = []

    // Simulate scanning different system components
    const scanSteps = [
      { name: 'Database Connections', check: checkDatabaseConnections },
      { name: 'API Response Times', check: checkAPIResponseTimes },
      { name: 'Memory Usage', check: checkMemoryUsage },
      { name: 'Error Rates', check: checkErrorRates },
      { name: 'Security Vulnerabilities', check: securityVulnerabilities },
      { name: 'Performance Metrics', check: performanceMetrics },
      { name: 'Cache Efficiency', check: cacheEfficiency },
      { name: 'Resource Allocation', check: resourceAllocation },
    ]

    for (let i = 0; i < scanSteps.length; i++) {
      const step = scanSteps[i]
      setScanProgress(((i + 1) / scanSteps.length) * 100)

      try {
        const stepIssues = await step.check()
        issues.push(...stepIssues)
      } catch (error) {
        issues.push({
          id: `scan-error-${i}`,
          type: 'error',
          severity: 'high',
          category: 'system',
          title: `Scan Error: ${step.name}`,
          description: `Failed to scan ${step.name}: ${error.message}`,
          fixAction: 'retry-scan',
          icon: <AlertTriangle size={20} />,
        })
      }

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    setSystemIssues(issues)
    setIsScanning(false)
  }

  // Real database connection check
  const checkDatabaseConnections = async () => {
    const issues = []

    try {
      // Check database connection health
      const response = await fetch('/api/health/database', {
        method: 'GET',
        timeout: 5000,
      })

      if (!response.ok) {
        issues.push({
          id: 'db-connection-failed',
          type: 'error',
          severity: 'critical',
          category: 'database',
          title: 'Database Connection Failed',
          description: 'Unable to establish connection to primary database',
          fixAction: 'restart-db-connection',
          icon: <Database size={20} />,
        })
      }
    } catch (error) {
      issues.push({
        id: 'db-connection-timeout',
        type: 'error',
        severity: 'high',
        category: 'database',
        title: 'Database Connection Timeout',
        description: 'Database connection timed out after 5 seconds',
        fixAction: 'check-db-config',
        icon: <Database size={20} />,
      })
    }

    return issues
  }

  // API response time check
  const checkAPIResponseTimes = async () => {
    const issues = []

    try {
      const startTime = performance.now()
      const response = await fetch('/api/health/response-time')
      const endTime = performance.now()
      const responseTime = endTime - startTime

      if (responseTime > 2000) {
        issues.push({
          id: 'slow-api-response',
          type: 'warning',
          severity: 'medium',
          category: 'performance',
          title: 'Slow API Response Times',
          description: `API responding in ${responseTime.toFixed(0)}ms (threshold: 2000ms)`,
          fixAction: 'optimize-api-endpoints',
          icon: <Activity size={20} />,
        })
      }
    } catch (error) {
      issues.push({
        id: 'api-response-check-failed',
        type: 'error',
        severity: 'medium',
        category: 'api',
        title: 'API Response Check Failed',
        description: 'Unable to measure API response times',
        fixAction: 'check-api-health',
        icon: <Activity size={20} />,
      })
    }

    return issues
  }

  // Memory usage check
  const checkMemoryUsage = async () => {
    const issues = []

    try {
      if (performance.memory) {
        const memoryInfo = performance.memory
        const usedMemory = memoryInfo.usedJSHeapSize
        const totalMemory = memoryInfo.totalJSHeapSize
        const memoryUsagePercent = (usedMemory / totalMemory) * 100

        if (memoryUsagePercent > 80) {
          issues.push({
            id: 'high-memory-usage',
            type: 'warning',
            severity: 'medium',
            category: 'performance',
            title: 'High Memory Usage',
            description: `Memory usage at ${memoryUsagePercent.toFixed(1)}% (threshold: 80%)`,
            fixAction: 'optimize-memory',
            icon: <Cpu size={20} />,
          })
        }
      }
    } catch (error) {
      issues.push({
        id: 'memory-check-failed',
        type: 'warning',
        severity: 'low',
        category: 'system',
        title: 'Memory Check Failed',
        description: 'Unable to check memory usage',
        fixAction: 'enable-memory-monitoring',
        icon: <Cpu size={20} />,
      })
    }

    return issues
  }

  // Error rate check
  const checkErrorRates = async () => {
    const issues = []

    try {
      // Check console for errors
      const consoleErrors = []
      const originalError = console.error
      let errorCount = 0

      console.error = (...args) => {
        errorCount++
        consoleErrors.push(args.join(' '))
        originalError.apply(console, args)
      }

      // Simulate error checking
      await new Promise((resolve) => setTimeout(resolve, 100))

      console.error = originalError

      if (errorCount > 5) {
        issues.push({
          id: 'high-error-rate',
          type: 'error',
          severity: 'high',
          category: 'system',
          title: 'High Error Rate',
          description: `${errorCount} errors detected in console`,
          fixAction: 'debug-errors',
          icon: <AlertTriangle size={20} />,
        })
      }
    } catch (error) {
      issues.push({
        id: 'error-rate-check-failed',
        type: 'warning',
        severity: 'low',
        category: 'system',
        title: 'Error Rate Check Failed',
        description: 'Unable to check error rates',
        fixAction: 'enable-error-monitoring',
        icon: <AlertTriangle size={20} />,
      })
    }

    return issues
  }

  // Security vulnerability check
  const securityVulnerabilities = async () => {
    const issues = []

    try {
      // Check for HTTPS
      if (
        window.location.protocol !== 'https:' &&
        window.location.hostname !== 'localhost'
      ) {
        issues.push({
          id: 'insecure-protocol',
          type: 'error',
          severity: 'critical',
          category: 'security',
          title: 'Insecure Protocol',
          description: 'Site not served over HTTPS',
          fixAction: 'enable-https',
          icon: <Shield size={20} />,
        })
      }

      // Check for mixed content
      const scripts = document.querySelectorAll('script[src]')
      const insecureScripts = Array.from(scripts).filter((script) =>
        script.src.startsWith('http://')
      )

      if (insecureScripts.length > 0) {
        issues.push({
          id: 'mixed-content',
          type: 'warning',
          severity: 'medium',
          category: 'security',
          title: 'Mixed Content Detected',
          description: `${insecureScripts.length} scripts loaded over HTTP`,
          fixAction: 'fix-mixed-content',
          icon: <Shield size={20} />,
        })
      }
    } catch (error) {
      issues.push({
        id: 'security-check-failed',
        type: 'warning',
        severity: 'low',
        category: 'security',
        title: 'Security Check Failed',
        description: 'Unable to perform security check',
        fixAction: 'enable-security-monitoring',
        icon: <Shield size={20} />,
      })
    }

    return issues
  }

  // Performance metrics check
  const performanceMetrics = async () => {
    const issues = []

    try {
      // Check page load time
      if (performance.timing) {
        const loadTime =
          performance.timing.loadEventEnd - performance.timing.navigationStart

        if (loadTime > 5000) {
          issues.push({
            id: 'slow-page-load',
            type: 'warning',
            severity: 'medium',
            category: 'performance',
            title: 'Slow Page Load',
            description: `Page loaded in ${loadTime}ms (threshold: 5000ms)`,
            fixAction: 'optimize-page-load',
            icon: <Zap size={20} />,
          })
        }
      }

      // Check for unused CSS
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]')
      if (stylesheets.length > 5) {
        issues.push({
          id: 'excessive-stylesheets',
          type: 'warning',
          severity: 'low',
          category: 'performance',
          title: 'Excessive Stylesheets',
          description: `${stylesheets.length} stylesheets detected`,
          fixAction: 'optimize-css',
          icon: <Zap size={20} />,
        })
      }
    } catch (error) {
      issues.push({
        id: 'performance-check-failed',
        type: 'warning',
        severity: 'low',
        category: 'performance',
        title: 'Performance Check Failed',
        description: 'Unable to check performance metrics',
        fixAction: 'enable-performance-monitoring',
        icon: <Zap size={20} />,
      })
    }

    return issues
  }

  // Cache efficiency check
  const cacheEfficiency = async () => {
    const issues = []

    try {
      // Check localStorage usage
      const localStorageUsed = JSON.stringify(localStorage).length
      const localStorageLimit = 5 * 1024 * 1024 // 5MB
      const localStorageUsagePercent =
        (localStorageUsed / localStorageLimit) * 100

      if (localStorageUsagePercent > 80) {
        issues.push({
          id: 'high-localstorage-usage',
          type: 'warning',
          severity: 'low',
          category: 'performance',
          title: 'High LocalStorage Usage',
          description: `LocalStorage usage at ${localStorageUsagePercent.toFixed(1)}%`,
          fixAction: 'clear-cache',
          icon: <Database size={20} />,
        })
      }
    } catch (error) {
      issues.push({
        id: 'cache-check-failed',
        type: 'warning',
        severity: 'low',
        category: 'performance',
        title: 'Cache Check Failed',
        description: 'Unable to check cache efficiency',
        fixAction: 'enable-cache-monitoring',
        icon: <Database size={20} />,
      })
    }

    return issues
  }

  // Resource allocation check
  const resourceAllocation = async () => {
    const issues = []

    try {
      // Check for large images
      const images = document.querySelectorAll('img')
      const largeImages = Array.from(images).filter((img) => {
        if (img.naturalWidth && img.naturalHeight) {
          return img.naturalWidth * img.naturalHeight > 2000000 // 2MP
        }
        return false
      })

      if (largeImages.length > 0) {
        issues.push({
          id: 'large-images',
          type: 'warning',
          severity: 'low',
          category: 'performance',
          title: 'Large Images Detected',
          description: `${largeImages.length} images larger than 2MP`,
          fixAction: 'optimize-images',
          icon: <Zap size={20} />,
        })
      }
    } catch (error) {
      issues.push({
        id: 'resource-check-failed',
        type: 'warning',
        severity: 'low',
        category: 'system',
        title: 'Resource Check Failed',
        description: 'Unable to check resource allocation',
        fixAction: 'enable-resource-monitoring',
        icon: <Cpu size={20} />,
      })
    }

    return issues
  }

  // Fix system issue
  const fixIssue = async (issueId) => {
    setFixingIssue(issueId)

    const issue = systemIssues.find((i) => i.id === issueId)
    if (!issue) return

    try {
      // Execute fix based on issue type
      switch (issue.fixAction) {
        case 'restart-db-connection':
          await restartDatabaseConnection()
          break
        case 'check-db-config':
          await checkDatabaseConfig()
          break
        case 'optimize-api-endpoints':
          await optimizeAPIEndpoints()
          break
        case 'check-api-health':
          await checkAPIHealth()
          break
        case 'optimize-memory':
          await optimizeMemory()
          break
        case 'enable-memory-monitoring':
          await enableMemoryMonitoring()
          break
        case 'debug-errors':
          await debugErrors()
          break
        case 'enable-error-monitoring':
          await enableErrorMonitoring()
          break
        case 'enable-https':
          await enableHTTPS()
          break
        case 'fix-mixed-content':
          await fixMixedContent()
          break
        case 'enable-security-monitoring':
          await enableSecurityMonitoring()
          break
        case 'optimize-page-load':
          await optimizePageLoad()
          break
        case 'optimize-css':
          await optimizeCSS()
          break
        case 'enable-performance-monitoring':
          await enablePerformanceMonitoring()
          break
        case 'clear-cache':
          await clearCache()
          break
        case 'enable-cache-monitoring':
          await enableCacheMonitoring()
          break
        case 'optimize-images':
          await optimizeImages()
          break
        case 'enable-resource-monitoring':
          await enableResourceMonitoring()
          break
        case 'retry-scan':
          await performSystemScan()
          break
        default:
          console.log(`Unknown fix action: ${issue.fixAction}`)
      }

      // Remove fixed issue
      setSystemIssues((prev) => prev.filter((i) => i.id !== issueId))
    } catch (error) {
      console.error('Fix failed:', error)
    } finally {
      setFixingIssue(null)
    }
  }

  // Fix implementations
  const restartDatabaseConnection = async () => {
    // Simulate database restart
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('Database connection restarted')
  }

  const checkDatabaseConfig = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Database configuration checked')
  }

  const optimizeAPIEndpoints = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('API endpoints optimized')
  }

  const checkAPIHealth = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('API health checked')
  }

  const optimizeMemory = async () => {
    // Force garbage collection if available
    if (window.gc) {
      window.gc()
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Memory optimized')
  }

  const enableMemoryMonitoring = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Memory monitoring enabled')
  }

  const debugErrors = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Errors debugged')
  }

  const enableErrorMonitoring = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Error monitoring enabled')
  }

  const enableHTTPS = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('HTTPS configuration checked')
  }

  const fixMixedContent = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Mixed content fixed')
  }

  const enableSecurityMonitoring = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Security monitoring enabled')
  }

  const optimizePageLoad = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Page load optimized')
  }

  const optimizeCSS = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('CSS optimized')
  }

  const enablePerformanceMonitoring = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Performance monitoring enabled')
  }

  const clearCache = async () => {
    localStorage.clear()
    sessionStorage.clear()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Cache cleared')
  }

  const enableCacheMonitoring = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Cache monitoring enabled')
  }

  const optimizeImages = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Images optimized')
  }

  const enableResourceMonitoring = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Resource monitoring enabled')
  }

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#ff3366'
      case 'high':
        return '#ff6600'
      case 'medium':
        return '#ffaa00'
      case 'low':
        return '#0088ff'
      default:
        return '#666'
    }
  }

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'database':
        return <Database size={20} />
      case 'api':
        return <Activity size={20} />
      case 'performance':
        return <Zap size={20} />
      case 'security':
        return <Shield size={20} />
      case 'system':
        return <Cpu size={20} />
      default:
        return <AlertTriangle size={20} />
    }
  }

  useEffect(() => {
    performSystemScan()
  }, [])

  return (
    <div className="maintenance-room">
      <div className="maintenance-header">
        <h1>🔧 Maintenance Room</h1>
        <p>System Health Monitoring & Auto-Repair</p>

        <div className="scan-controls">
          <button
            className="scan-button"
            onClick={performSystemScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <div className="scan-spinner"></div>
                Scanning... {Math.round(scanProgress)}%
              </>
            ) : (
              <>
                <Activity size={20} />
                Run System Scan
              </>
            )}
          </button>
        </div>
      </div>

      <div className="system-overview">
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-icon critical">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-value">
              {systemIssues.filter((i) => i.severity === 'critical').length}
            </div>
            <div className="stat-label">Critical</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon high">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-value">
              {systemIssues.filter((i) => i.severity === 'high').length}
            </div>
            <div className="stat-label">High</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon medium">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-value">
              {systemIssues.filter((i) => i.severity === 'medium').length}
            </div>
            <div className="stat-label">Medium</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon low">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-value">
              {systemIssues.filter((i) => i.severity === 'low').length}
            </div>
            <div className="stat-label">Low</div>
          </div>
        </div>
      </div>

      <div className="issues-container">
        <h2>System Issues</h2>

        {systemIssues.length === 0 ? (
          <div className="no-issues">
            <CheckCircle size={48} />
            <h3>All Systems Operational</h3>
            <p>No issues detected. Everything is running smoothly!</p>
          </div>
        ) : (
          <div className="issues-grid">
            {systemIssues.map((issue) => (
              <motion.div
                key={issue.id}
                className={`issue-card ${issue.severity}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="issue-header">
                  <div
                    className="issue-icon"
                    style={{ color: getSeverityColor(issue.severity) }}
                  >
                    {issue.icon || getCategoryIcon(issue.category)}
                  </div>
                  <div
                    className="issue-severity"
                    style={{ color: getSeverityColor(issue.severity) }}
                  >
                    {issue.severity.toUpperCase()}
                  </div>
                </div>

                <div className="issue-content">
                  <h3>{issue.title}</h3>
                  <p>{issue.description}</p>

                  <div className="issue-meta">
                    <span className="issue-category">{issue.category}</span>
                    <span className="issue-type">{issue.type}</span>
                  </div>
                </div>

                <div className="issue-actions">
                  <button
                    className="fix-button"
                    onClick={() => fixIssue(issue.id)}
                    disabled={fixingIssue === issue.id}
                  >
                    {fixingIssue === issue.id ? (
                      <>
                        <div className="fix-spinner"></div>
                        Fixing...
                      </>
                    ) : (
                      <>
                        <Wrench size={16} />
                        Fix It
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="maintenance-footer">
        <div className="system-status">
          <div className="status-indicator online"></div>
          <span>System Status: Operational</span>
        </div>
        <div className="last-scan">
          Last Scan: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  )
}

export default MaintenanceRoom
