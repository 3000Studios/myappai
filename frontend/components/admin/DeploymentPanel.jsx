import React from 'react'

export default function DeploymentPanel({ deployments, onDeploy, busy }) {
  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <span className="eyebrow">Deployments</span>
          <h2>Git and Cloudflare handoff</h2>
        </div>
        <button
          className="button button--ghost"
          type="button"
          onClick={onDeploy}
          disabled={busy}
        >
          {busy ? 'Deploying...' : 'Trigger deploy'}
        </button>
      </div>

      <div className="stack-md">
        {(deployments?.history ?? []).map((entry) => (
          <article key={entry.id} className="content-card content-card--dense">
            <div className="content-card__row">
              <strong>{entry.status}</strong>
              <span>{entry.branch}</span>
            </div>
            <p>{entry.message}</p>
            <span className="meta-line">
              {entry.finishedAt ?? entry.startedAt}
            </span>
          </article>
        ))}
      </div>

      <div className="admin-subsection">
        <h3>Recent commits</h3>
        <div className="stack-sm">
          {(deployments?.commits ?? []).map((commit) => (
            <div key={commit.sha} className="commit-row">
              <strong>{commit.shortSha}</strong>
              <span>{commit.subject}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
