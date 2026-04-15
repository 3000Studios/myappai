import React, { useState } from 'react'
import { useAdminDashboard } from '../../context/AdminDashboardContext.jsx'

export default function AdminSecureLogsPage() {
  const { secureLogs, handleSecureLogsUnlock } = useAdminDashboard()
  const [code, setCode] = useState('8888')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const entries = secureLogs?.entries ?? []

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setBusy(true)
      setError('')
      await handleSecureLogsUnlock(code.trim())
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="stack-xl">
      <section className="section-card admin-surface ux-reveal">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Secure logs</span>
            <h2>Secondary-code access for deeper diagnostics.</h2>
            <p className="section-intro">
              This page stays inside admin auth and then asks for the extra
              `8888` code before it reveals secure diagnostics and error detail.
            </p>
          </div>
        </div>

        <form className="secure-log-gate" onSubmit={handleSubmit}>
          <label className="field">
            <span>Secure logs code</span>
            <input
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="8888"
            />
          </label>
          <button
            className="button button--primary"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Unlocking' : 'Unlock secure logs'}
          </button>
          <button
            className="button button--ghost"
            type="button"
            onClick={() => setCode('8888')}
          >
            Reset to 8888
          </button>
        </form>

        {error ? <div className="error-banner">{error}</div> : null}
      </section>

      <section className="section-card admin-surface ux-reveal">
        <div className="card-grid card-grid--compact">
          <article className="content-card ux-reveal">
            <span className="meta-line">Protected entries</span>
            <h3>{entries.length}</h3>
            <p>
              Secure auth, runtime, and sensitive diagnostics become visible
              here only after the secondary code gate is unlocked.
            </p>
          </article>
          <article className="content-card ux-reveal">
            <span className="meta-line">Current state</span>
            <h3>{entries.length ? 'unlocked' : 'locked'}</h3>
            <p>
              Keep this page for deep diagnostics while the regular logs page
              remains safe for day-to-day admin review.
            </p>
          </article>
        </div>
      </section>

      <section className="section-card admin-surface ux-reveal">
        <span className="eyebrow">Diagnostics feed</span>
        <h2>Protected error and auth activity.</h2>
        <div className="log-list">
          {!entries.length ? (
            <article className="log-card log-card--secure ux-reveal">
              <span className="meta-line">Locked or empty</span>
              <p>
                Unlock with the secure code to reveal the protected log stream.
              </p>
            </article>
          ) : (
            entries.map((entry) => (
              <article
                key={entry.id}
                className="log-card log-card--secure ux-reveal"
              >
                <div className="log-card__top">
                  <span className="meta-line">
                    {entry.scope} · {entry.level}
                  </span>
                  <span className="meta-line">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3>{entry.title}</h3>
                <p>{entry.message}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
