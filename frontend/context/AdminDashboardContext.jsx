import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAdminSessionState,
  getAnalytics,
  getContent,
  getDeployments,
  getLogs,
  getMetrics,
  getRevenueQueue,
  getSecureLogsWithCode,
  logoutAdmin,
  postClientLog,
  runSelfHeal,
  sendCommand,
  updateLeadStage,
} from '../src/adminApi.js'
import { clearAdminSession, getAdminSession } from '../src/adminSession.js'

const defaultCommand = JSON.stringify(
  {
    action: 'homepage_update',
    prompt: 'Refresh the homepage copy for an operator-first SaaS audience.',
    autoDeploy: false,
  },
  null,
  2
)

const defaultPrompt =
  'Rebrand the homepage around MyAppAI as an operator platform and prepare it for deployment.'

const OPERATOR_STATE_KEY = 'myappai.operator.workspaceState'

function getStoredOperatorState() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawValue = window.localStorage.getItem(OPERATOR_STATE_KEY)
    if (!rawValue) {
      return null
    }

    const parsed = JSON.parse(rawValue)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function createOperatorResultEntry(result, metadata = {}) {
  return {
    ...result,
    id:
      result?.id ??
      `operator-result-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: result?.createdAt ?? new Date().toISOString(),
    prompt: metadata.prompt ?? result?.prompt ?? '',
    trigger: metadata.trigger ?? result?.trigger ?? 'operator',
  }
}

function createOperatorFailureResult({
  mode = 'operator_error',
  summary,
  message,
  nextSteps = [],
}) {
  return {
    mode,
    status: 'error',
    summary,
    nextSteps,
    details: {
      error: message,
    },
  }
}

const AdminDashboardContext = createContext(null)

export function AdminDashboardProvider({ children }) {
  const navigate = useNavigate()
  const storedOperatorState = getStoredOperatorState()
  const [adminSession] = useState(() => getAdminSession())
  const [consoleMode, setConsoleMode] = useState(
    storedOperatorState?.consoleMode ?? 'prompt'
  )
  const [commandText, setCommandText] = useState(
    storedOperatorState?.commandText ?? defaultCommand
  )
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState(
    storedOperatorState?.naturalLanguagePrompt ?? defaultPrompt
  )
  const [shipLiveAfterRun, setShipLiveAfterRun] = useState(
    storedOperatorState?.shipLiveAfterRun !== false
  )
  const [analytics, setAnalytics] = useState(null)
  const [deployments, setDeployments] = useState(null)
  const [contentBundle, setContentBundle] = useState(null)
  const [revenueQueue, setRevenueQueue] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [logs, setLogs] = useState(null)
  const [secureLogs, setSecureLogs] = useState(null)
  const [selfHealState, setSelfHealState] = useState(null)
  const [commandBusy, setCommandBusy] = useState(false)
  const [editorBusy, setEditorBusy] = useState(false)
  const [deployBusy, setDeployBusy] = useState(false)
  const [trafficBusy, setTrafficBusy] = useState(false)
  const [lastResult, setLastResult] = useState(
    storedOperatorState?.lastResult ?? null
  )
  const [operatorHistory, setOperatorHistory] = useState(
    Array.isArray(storedOperatorState?.operatorHistory)
      ? storedOperatorState.operatorHistory
      : []
  )
  const [error, setError] = useState('')
  const [initialLoadDone, setInitialLoadDone] = useState(false)

  const refreshDashboard = useCallback(
    async (activeSession = adminSession) => {
      if (!activeSession?.adminEmail) {
        return
      }

      const [
        nextAnalytics,
        nextDeployments,
        nextContent,
        nextRevenueQueue,
        nextMetrics,
        nextLogs,
      ] = await Promise.all([
        getAnalytics(activeSession),
        getDeployments(activeSession),
        getContent(activeSession),
        getRevenueQueue(activeSession),
        getMetrics(activeSession),
        getLogs(activeSession),
      ])

      setAnalytics(nextAnalytics)
      setDeployments(nextDeployments)
      setContentBundle(nextContent)
      setRevenueQueue(nextRevenueQueue)
      setMetrics(nextMetrics)
      setLogs(nextLogs)
    },
    [adminSession]
  )

  useEffect(() => {
    if (!adminSession?.adminEmail) {
      return
    }

    getAdminSessionState()
      .then(() => refreshDashboard(adminSession))
      .catch((loadError) => setError(loadError.message))
      .finally(() => setInitialLoadDone(true))
  }, [adminSession, refreshDashboard])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      OPERATOR_STATE_KEY,
      JSON.stringify({
        consoleMode,
        commandText,
        naturalLanguagePrompt,
        shipLiveAfterRun,
        lastResult,
        operatorHistory: operatorHistory.slice(0, 8),
      })
    )
  }, [
    commandText,
    consoleMode,
    lastResult,
    naturalLanguagePrompt,
    operatorHistory,
    shipLiveAfterRun,
  ])

  const recordResult = useCallback((result, metadata = {}) => {
    const nextResult = createOperatorResultEntry(result, metadata)
    setLastResult(nextResult)
    setOperatorHistory((current) => [nextResult, ...current].slice(0, 8))
    return nextResult
  }, [])

  const handleRunCommand = useCallback(async () => {
    try {
      setError('')
      setCommandBusy(true)

      let payload
      if (consoleMode === 'json') {
        payload = JSON.parse(commandText)
        if (
          payload &&
          typeof payload === 'object' &&
          typeof payload.command === 'string' &&
          !('shipLiveAfterEdit' in payload)
        ) {
          payload = { ...payload, shipLiveAfterEdit: shipLiveAfterRun }
        }
      } else {
        payload = {
          command: naturalLanguagePrompt.trim(),
          shipLiveAfterEdit: shipLiveAfterRun,
        }
      }

      if (consoleMode !== 'json' && !payload.command) {
        throw new Error('Enter a prompt for the operator workspace.')
      }

      const result = await sendCommand(adminSession, payload)
      recordResult(result, {
        prompt:
          consoleMode === 'json'
            ? 'Structured JSON command'
            : naturalLanguagePrompt.trim(),
      })
      await refreshDashboard(adminSession)
    } catch (runError) {
      const message =
        runError instanceof Error ? runError.message : String(runError ?? '')
      setError(message)
      recordResult(
        createOperatorFailureResult({
          summary:
            consoleMode === 'json'
              ? 'Command JSON failed before it could apply a safe change.'
              : 'Operator prompt failed before it could apply a safe change.',
          message,
          nextSteps:
            consoleMode === 'json'
              ? [
                  'Check the action name and required fields in the JSON payload.',
                ]
              : [
                  'Make the request more specific about the page or section to change.',
                  'Use Command JSON if you want a structured action instead of prompt interpretation.',
                ],
        }),
        {
          prompt:
            consoleMode === 'json'
              ? 'Structured JSON command'
              : naturalLanguagePrompt.trim(),
          trigger: consoleMode === 'json' ? 'json-error' : 'prompt-error',
        }
      )
    } finally {
      setCommandBusy(false)
    }
  }, [
    adminSession,
    commandText,
    consoleMode,
    naturalLanguagePrompt,
    recordResult,
    refreshDashboard,
    shipLiveAfterRun,
  ])

  const handleSaveFile = useCallback(
    async (targetPath, contents) => {
      try {
        setError('')
        setEditorBusy(true)
        const result = await sendCommand(adminSession, {
          action: 'edit_workspace_file',
          targetPath,
          contents,
          autoDeploy: false,
        })
        recordResult(result, {
          prompt: `Edit workspace file ${targetPath}`,
          trigger: 'editor',
        })
        await refreshDashboard(adminSession)
      } catch (saveError) {
        setError(saveError.message)
      } finally {
        setEditorBusy(false)
      }
    },
    [adminSession, recordResult, refreshDashboard]
  )

  const handleDeploy = useCallback(async () => {
    try {
      setError('')
      setDeployBusy(true)
      const result = await sendCommand(adminSession, {
        action: 'deploy_site',
        message: 'Admin-triggered deploy',
      })
      recordResult(result, {
        prompt: 'Deploy site',
        trigger: 'deploy',
      })
      await refreshDashboard(adminSession)
    } catch (deployError) {
      setError(deployError.message)
    } finally {
      setDeployBusy(false)
    }
  }, [adminSession, recordResult, refreshDashboard])

  const handleRefresh = useCallback(async () => {
    try {
      setError('')
      await refreshDashboard(adminSession)
    } catch (connectError) {
      setError(connectError.message)
    }
  }, [adminSession, refreshDashboard])

  const handleDiscoverTopics = useCallback(async () => {
    try {
      setError('')
      setTrafficBusy(true)
      const result = await sendCommand(adminSession, {
        action: 'discover_topics',
        limit: 6,
      })
      recordResult(result, {
        prompt: 'Discover topics',
        trigger: 'traffic',
      })
      await refreshDashboard(adminSession)
    } catch (trafficError) {
      setError(trafficError.message)
    } finally {
      setTrafficBusy(false)
    }
  }, [adminSession, recordResult, refreshDashboard])

  const handleRunTrafficCycle = useCallback(async () => {
    try {
      setError('')
      setTrafficBusy(true)
      const result = await sendCommand(adminSession, {
        action: 'run_traffic_cycle',
        count: 2,
        includeImages: true,
        autoDeploy: false,
      })
      recordResult(result, {
        prompt: 'Run traffic cycle',
        trigger: 'traffic',
      })
      await refreshDashboard(adminSession)
    } catch (trafficError) {
      setError(trafficError.message)
    } finally {
      setTrafficBusy(false)
    }
  }, [adminSession, recordResult, refreshDashboard])

  const handleUpdateLeadStage = useCallback(
    async (leadId, patch) => {
      try {
        setError('')
        const result = await updateLeadStage(adminSession, leadId, patch)
        recordResult(result, {
          prompt: `Update lead stage for ${leadId}`,
          trigger: 'revenue',
        })
        await refreshDashboard(adminSession)
      } catch (updateError) {
        setError(updateError.message)
      }
    },
    [adminSession, recordResult, refreshDashboard]
  )

  const handleSignOut = useCallback(() => {
    logoutAdmin()
      .catch(() => {})
      .finally(() => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(OPERATOR_STATE_KEY)
        }
        clearAdminSession()
        navigate('/admin/login', { replace: true })
      })
  }, [navigate])

  const handleSelfHeal = useCallback(async () => {
    try {
      setError('')
      const result = await runSelfHeal(adminSession)
      setSelfHealState(result.result)
      recordResult(
        {
          mode: 'self_heal',
          status: result.result?.status ?? 'success',
          summary: 'Self-heal audit completed from the admin workspace.',
          nextSteps: result.result?.warnings?.length
            ? ['Review warnings inside the logs view.']
            : ['No immediate fixes required.'],
        },
        {
          prompt: 'Run self-heal audit',
          trigger: 'heal',
        }
      )
      await refreshDashboard(adminSession)
    } catch (healError) {
      setError(healError.message)
    }
  }, [adminSession, recordResult, refreshDashboard])

  const handleSecureLogsUnlock = useCallback(
    async (code) => {
      try {
        setError('')
        const nextSecureLogs = await getSecureLogsWithCode(adminSession, code)
        setSecureLogs(nextSecureLogs)
        return nextSecureLogs
      } catch (unlockError) {
        setError(unlockError.message)
        throw unlockError
      }
    },
    [adminSession]
  )

  const clearOperatorSessionState = useCallback(() => {
    setConsoleMode('prompt')
    setCommandText(defaultCommand)
    setNaturalLanguagePrompt(defaultPrompt)
    setShipLiveAfterRun(true)
    setLastResult(null)
    setOperatorHistory([])
    setError('')

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(OPERATOR_STATE_KEY)
    }
  }, [])

  const handleClientLog = useCallback(
    async (payload) => {
      try {
        if (!adminSession?.adminEmail) {
          return
        }
        await postClientLog(adminSession, payload)
      } catch {
        // Ignore logging transport failures.
      }
    },
    [adminSession]
  )

  const value = useMemo(
    () => ({
      adminSession,
      initialLoadDone,
      consoleMode,
      setConsoleMode,
      commandText,
      setCommandText,
      naturalLanguagePrompt,
      setNaturalLanguagePrompt,
      shipLiveAfterRun,
      setShipLiveAfterRun,
      analytics,
      deployments,
      contentBundle,
      revenueQueue,
      metrics,
      logs,
      secureLogs,
      selfHealState,
      commandBusy,
      editorBusy,
      deployBusy,
      trafficBusy,
      lastResult,
      operatorHistory,
      error,
      setError,
      refreshDashboard: handleRefresh,
      handleRunCommand,
      handleSaveFile,
      handleDeploy,
      handleDiscoverTopics,
      handleRunTrafficCycle,
      handleUpdateLeadStage,
      handleSelfHeal,
      handleSecureLogsUnlock,
      handleClientLog,
      handleSignOut,
      clearOperatorSessionState,
    }),
    [
      adminSession,
      initialLoadDone,
      consoleMode,
      commandText,
      naturalLanguagePrompt,
      shipLiveAfterRun,
      analytics,
      deployments,
      contentBundle,
      revenueQueue,
      metrics,
      logs,
      secureLogs,
      selfHealState,
      commandBusy,
      editorBusy,
      deployBusy,
      trafficBusy,
      lastResult,
      operatorHistory,
      error,
      handleRefresh,
      handleRunCommand,
      handleSaveFile,
      handleDeploy,
      handleDiscoverTopics,
      handleRunTrafficCycle,
      handleUpdateLeadStage,
      handleSelfHeal,
      handleSecureLogsUnlock,
      handleClientLog,
      handleSignOut,
      clearOperatorSessionState,
    ]
  )

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  )
}

export function useAdminDashboard() {
  const ctx = useContext(AdminDashboardContext)
  if (!ctx) {
    throw new Error(
      'useAdminDashboard must be used inside AdminDashboardProvider'
    )
  }
  return ctx
}
