import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminDashboard } from '../../context/AdminDashboardContext.jsx'
import { useOperatorVoice } from '../../hooks/useOperatorVoice.js'

const quickPrompts = [
  'Update site metadata canonical URL to myappai.net',
  'Scan the active runtime for any remaining legacy branding and replace it with MyAppAI',
  'Audit the workspace for risky shell requests and explain the safe boundary',
  'Refresh the homepage copy for SaaS founders and prepare deployment',
]

const RECENT_PROMPTS_KEY = 'myappai.operator.recentPrompts'

function getResultToneClass(result) {
  if (result?.status === 'blocked') {
    return ' operator-result-card--blocked'
  }

  if (result?.status === 'error' || result?.status === 'unavailable') {
    return ' operator-result-card--error'
  }

  return ''
}

function getResultIssue(result) {
  return (
    result?.blockedReason ??
    result?.unavailableReason ??
    result?.errorReason ??
    result?.details?.error ??
    ''
  )
}

function formatMetricValue(value, fallback = 'idle') {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return fallback
}

export default function AdminOperatorPage() {
  const {
    naturalLanguagePrompt,
    setNaturalLanguagePrompt,
    shipLiveAfterRun,
    setShipLiveAfterRun,
    handleRunCommand,
    handleDeploy,
    clearOperatorSessionState,
    commandBusy,
    deployBusy,
    operatorHistory,
    analytics,
    deployments,
    selfHealState,
    handleSelfHeal,
    handleClientLog,
    error,
  } = useAdminDashboard()

  const latestDeployment = deployments?.history?.[0] ?? null
  const latestResult = operatorHistory[0] ?? null
  const latestPaths = operatorHistory[0]?.affectedPaths ?? []
  const latestSummary = operatorHistory[0]?.summary ?? ''
  const sourcesCount = latestResult?.sources?.length ?? 0
  const nextSteps = latestResult?.nextSteps ?? []
  const planSteps = latestResult?.details?.plan?.steps ?? []
  const [recentPrompts, setRecentPrompts] = useState(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const rawValue = window.localStorage.getItem(RECENT_PROMPTS_KEY)
      const parsed = rawValue ? JSON.parse(rawValue) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      RECENT_PROMPTS_KEY,
      JSON.stringify(recentPrompts.slice(0, 6))
    )
  }, [recentPrompts])

  const sourceItems = useMemo(
    () =>
      Array.isArray(latestResult?.sources)
        ? latestResult.sources.filter((item) => item?.url)
        : [],
    [latestResult]
  )

  const handleTranscript = useCallback(
    (transcript) => {
      setNaturalLanguagePrompt(transcript)
      void handleClientLog({
        level: 'info',
        title: 'Voice transcript captured',
        message: transcript,
        route: '/admin/operator',
      })
    },
    [handleClientLog, setNaturalLanguagePrompt]
  )

  const voice = useOperatorVoice({
    onTranscript: handleTranscript,
  })

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleExecute()
    }
  }

  function rememberPrompt(prompt) {
    const trimmed = prompt.trim()
    if (!trimmed) {
      return
    }

    setRecentPrompts((current) =>
      [trimmed, ...current.filter((item) => item !== trimmed)].slice(0, 6)
    )
  }

  async function handleExecute() {
    rememberPrompt(naturalLanguagePrompt)
    await handleRunCommand()
  }

  function handleResetSession() {
    clearOperatorSessionState()
    setRecentPrompts([])

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(RECENT_PROMPTS_KEY)
    }
  }

  return (
    <div className="operator-page">
      <aside className="operator-rail" aria-label="Operator sections">
        <div className="operator-logo">M</div>
        <div className="operator-rail__stack">
          <button
            className="operator-rail__item operator-rail__item--active"
            type="button"
            aria-label="Workspace"
          >
            <span />
          </button>
          <button
            className="operator-rail__item"
            type="button"
            aria-label="Results"
          >
            <span />
          </button>
          <button
            className="operator-rail__item"
            type="button"
            aria-label="Deployments"
          >
            <span />
          </button>
        </div>
      </aside>

      <div className="operator-shell">
        <header className="operator-header">
          <div className="operator-breadcrumb">
            <span>MyAppAI</span>
            <span>/</span>
            <span>Operator Workspace</span>
          </div>
          <div className="operator-header__status">
            <span className="operator-status-pill">
              <span className="operator-status-dot" />
              PROD: MYAPPAI.NET
            </span>
            <span className="operator-status-pill">VOICE: PHASED NEXT</span>
          </div>
        </header>

        <section className="operator-workspace">
          <div className="operator-monolith">
            <div className="operator-monolith__header">
              <div className="operator-monolith__title-block">
                <span className="operator-label">Command Interface</span>
                <h1 className="operator-monolith__title">
                  Guide the site in plain language.
                </h1>
                <p className="operator-monolith__lede">
                  Type what you want (or use voice), enable ship-live, and press
                  run to commit, push <code>main</code>, build, and deploy to
                  myappai.net—or type <code>deploy</code> alone to deploy the
                  current workspace.
                </p>
              </div>
              <span className="operator-label operator-label--quiet">
                Safe repo + deploy control
              </span>
            </div>

            <div className="operator-brief-grid">
              <article className="operator-brief-card">
                <span className="meta-line">Last mode</span>
                <strong>{latestResult?.mode ?? 'idle'}</strong>
                <p>
                  {latestSummary ||
                    'Your latest operator summary will appear here after a request runs.'}
                </p>
              </article>
              <article className="operator-brief-card">
                <span className="meta-line">Deploy pulse</span>
                <strong>{latestDeployment?.status ?? 'idle'}</strong>
                <p>
                  {latestDeployment?.finishedAt
                    ? `Finished ${new Date(latestDeployment.finishedAt).toLocaleString()}.`
                    : 'No recent deployment recorded yet.'}
                </p>
              </article>
              <article className="operator-brief-card">
                <span className="meta-line">Research links</span>
                <strong>{sourcesCount}</strong>
                <p>
                  {sourcesCount
                    ? 'Sources were attached to the latest researched action.'
                    : 'Source links appear here when research-backed work runs.'}
                </p>
              </article>
            </div>

            <div className="operator-prompt">
              <label className="operator-ship-live">
                <input
                  type="checkbox"
                  checked={shipLiveAfterRun}
                  onChange={(event) =>
                    setShipLiveAfterRun(event.target.checked)
                  }
                />
                <span>
                  After this edit: commit, push to <code>main</code>, build, and
                  deploy live (myappai.net). Uncheck to only apply the patch.
                </span>
              </label>
              <textarea
                id="promptInput"
                value={naturalLanguagePrompt}
                onChange={(event) =>
                  setNaturalLanguagePrompt(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Describe the site change or orchestration task..."
              />
              <div className="operator-prompt__actions">
                <button
                  className="operator-button operator-button--ghost"
                  type="button"
                  onClick={() => setNaturalLanguagePrompt('')}
                  disabled={!naturalLanguagePrompt.trim() || commandBusy}
                >
                  Clear
                </button>
                <button
                  className="operator-button operator-button--ghost"
                  type="button"
                  onClick={handleResetSession}
                  disabled={commandBusy || deployBusy}
                >
                  Reset session
                </button>
                <button
                  className="btn-primary"
                  type="button"
                  id="sendBtn"
                  onClick={() => void handleExecute()}
                  disabled={commandBusy}
                >
                  {commandBusy
                    ? 'RUNNING'
                    : shipLiveAfterRun
                      ? 'RUN + SHIP LIVE'
                      : 'EXECUTE'}
                </button>
                <button
                  className="operator-button operator-button--secondary"
                  type="button"
                  onClick={() => void handleDeploy()}
                  disabled={deployBusy}
                >
                  {deployBusy ? 'DEPLOYING' : 'DEPLOY'}
                </button>
              </div>
            </div>

            <div className="operator-chips">
              <button
                className="operator-chip operator-chip--accent"
                type="button"
                onClick={() =>
                  voice.listening
                    ? voice.stopListening()
                    : voice.startListening()
                }
                disabled={!voice.supported}
              >
                {voice.listening
                  ? 'Stop mic'
                  : voice.supported
                    ? 'Start voice'
                    : 'Voice unavailable'}
              </button>
              <button
                className="operator-chip"
                type="button"
                onClick={() =>
                  voice.speak(latestSummary || naturalLanguagePrompt)
                }
                disabled={voice.speaking || !latestSummary}
              >
                {voice.speaking ? 'Speaking' : 'Speak last result'}
              </button>
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  className="operator-chip"
                  type="button"
                  onClick={() => setNaturalLanguagePrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
              <button
                className="operator-chip operator-chip--accent"
                type="button"
                onClick={() => void handleSelfHeal()}
              >
                Run self-heal audit
              </button>
            </div>
            <div className="operator-voice-status">
              <span className="meta-line">Voice</span>
              <p>
                {voice.supported
                  ? voice.listening
                    ? `Listening: ${voice.transcript || 'speak now...'}`
                    : 'Voice input ready for browser-supported mic use.'
                  : 'This browser does not expose Web Speech voice input.'}
              </p>
            </div>

            <div className="operator-next-steps">
              <span className="meta-line">Recent prompts</span>
              <div className="operator-next-steps__list">
                {recentPrompts.length ? (
                  recentPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      className="operator-chip"
                      type="button"
                      onClick={() => setNaturalLanguagePrompt(prompt)}
                    >
                      {prompt}
                    </button>
                  ))
                ) : (
                  <span className="signal-pill">
                    Your recent operator prompts will stay here for quick reuse.
                  </span>
                )}
              </div>
            </div>

            <div className="operator-next-steps">
              <span className="meta-line">Next steps</span>
              <div className="operator-next-steps__list">
                {nextSteps.length ? (
                  nextSteps.map((step) => (
                    <span key={step} className="signal-pill">
                      {step}
                    </span>
                  ))
                ) : (
                  <span className="signal-pill">
                    Run an operator task to populate guided follow-up steps.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="operator-results">
            <div className="operator-results__header">
              <div>
                <span className="operator-label">Execution feed</span>
                <h2 className="operator-results__title">
                  Latest operator runs
                </h2>
              </div>
              <span className="operator-results__count">
                {operatorHistory.length || 0} stored
              </span>
            </div>

            {error && operatorHistory.length === 0 ? (
              <article className="operator-result-card operator-result-card--error">
                <header className="operator-result-card__header">
                  <span className="operator-label">Operator error</span>
                  <span className="operator-result-card__status">error</span>
                </header>
                <div className="operator-result-card__body">
                  <div className="operator-result-card__error">{error}</div>
                </div>
              </article>
            ) : null}

            {operatorHistory.length === 0 ? (
              <article className="operator-result-card">
                <header className="operator-result-card__header">
                  <span className="operator-label">Workspace status</span>
                  <span className="operator-result-card__status">ready</span>
                </header>
                <div className="operator-result-card__body">
                  &gt; Type a request and press Enter to execute. The operator
                  will summarize the mode, changed paths, sources, and
                  deployment status here.
                  <div className="operator-result-card__empty-grid">
                    <div className="operator-plan-item">Prompt with intent</div>
                    <div className="operator-plan-item">Inspect the plan</div>
                    <div className="operator-plan-item">Deploy when ready</div>
                  </div>
                </div>
              </article>
            ) : null}

            {operatorHistory.map((result, index) => (
              <article
                key={`${result.summary ?? result.mode ?? 'result'}-${index}`}
                className={`operator-result-card${getResultToneClass(result)}`}
              >
                <header className="operator-result-card__header">
                  <span className="operator-label">
                    {index === 0 ? 'Latest action' : 'Previous action'}
                  </span>
                  <span className="operator-result-card__status">
                    {result.status ?? 'unknown'}
                  </span>
                </header>
                <div className="operator-result-card__body">
                  {result.prompt ? <div>Prompt: {result.prompt}</div> : null}
                  {result.createdAt ? (
                    <div>
                      Time: {new Date(result.createdAt).toLocaleString()}
                    </div>
                  ) : null}
                  <div>&gt; {result.summary ?? 'No summary returned.'}</div>
                  <div>Mode: {result.mode ?? 'unknown'}</div>
                  {result.details?.plan?.steps?.length ? (
                    <div>Plan: {result.details.plan.steps.join(' → ')}</div>
                  ) : null}
                  {result.affectedPaths?.length ? (
                    <div>Paths: {result.affectedPaths.join(', ')}</div>
                  ) : null}
                  {result.sources?.length ? (
                    <div>
                      Sources:
                      <div className="operator-source-list">
                        {result.sources.map((item) => (
                          <a
                            key={item.url ?? item.title}
                            className="operator-source-link"
                            href={item.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {item.title ?? item.url}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {getResultIssue(result) ? (
                    <div
                      className={
                        result.status === 'blocked'
                          ? 'operator-result-card__blocked'
                          : 'operator-result-card__error'
                      }
                    >
                      {getResultIssue(result)}
                    </div>
                  ) : null}
                  {result.deployment?.status ? (
                    <div>Deploy: {result.deployment.status}</div>
                  ) : null}
                  {result.nextSteps?.length ? (
                    <div>Next: {result.nextSteps.join(' | ')}</div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="operator-inspector">
          <section className="operator-panel">
            <div className="operator-section-title">Workspace bounds</div>
            <ul className="operator-file-list">
              {[
                'frontend/src/',
                'frontend/pages/',
                'frontend/styles/',
                'content/pages/',
                'content/system/',
              ].map((item) => (
                <li key={item} className="operator-file-item">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="operator-panel">
            <div className="operator-section-title">Execution plan</div>
            <div className="operator-plan-list">
              {planSteps.length ? (
                planSteps.map((step) => (
                  <div key={step} className="operator-plan-item">
                    {step}
                  </div>
                ))
              ) : (
                <div className="operator-plan-item">
                  Run a command to view the interpreted plan steps here.
                </div>
              )}
            </div>
          </section>

          <section className="operator-panel">
            <div className="operator-section-title">Deployment pulse</div>
            <div className="operator-pulse">
              <div className="operator-pulse__wave" />
              <div className="operator-pulse__content">
                <strong>{latestDeployment?.status ?? 'idle'}</strong>
                <span>
                  {latestDeployment?.finishedAt
                    ? new Date(latestDeployment.finishedAt).toLocaleString()
                    : 'No recent deployment'}
                </span>
              </div>
            </div>
          </section>

          <section className="operator-panel">
            <div className="operator-section-title">System metrics</div>
            <div className="operator-stat-grid">
              <div className="operator-stat-box">
                <span className="operator-stat-label">Commands</span>
                <span className="operator-stat-value">
                  {analytics?.aiActivity?.commandsToday ?? 0}
                </span>
              </div>
              <div className="operator-stat-box">
                <span className="operator-stat-label">Deploys</span>
                <span className="operator-stat-value">
                  {analytics?.aiActivity?.deploymentsToday ?? 0}
                </span>
              </div>
              <div className="operator-stat-box">
                <span className="operator-stat-label">Last action</span>
                <span className="operator-stat-value">
                  {formatMetricValue(analytics?.aiActivity?.lastAction)}
                </span>
              </div>
              <div className="operator-stat-box">
                <span className="operator-stat-label">Changed files</span>
                <span className="operator-stat-value">
                  {latestPaths.length}
                </span>
              </div>
              <div className="operator-stat-box">
                <span className="operator-stat-label">Heal state</span>
                <span className="operator-stat-value">
                  {selfHealState?.status ?? 'idle'}
                </span>
              </div>
            </div>
          </section>

          <section className="operator-panel">
            <div className="operator-section-title">Latest sources</div>
            <div className="operator-plan-list">
              {sourceItems.length ? (
                sourceItems.map((item) => (
                  <a
                    key={item.url}
                    className="operator-source-link"
                    href={item.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {item.title ?? item.url}
                  </a>
                ))
              ) : (
                <div className="operator-plan-item">
                  Research-backed results will list source links here.
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
