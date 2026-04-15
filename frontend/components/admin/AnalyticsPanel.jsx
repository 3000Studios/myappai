import React from 'react'

export default function AnalyticsPanel({ analytics }) {
  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <span className="eyebrow">Analytics</span>
          <h2>Traffic and revenue snapshot</h2>
        </div>
      </div>
      <div className="card-grid card-grid--compact">
        <article className="content-card">
          <strong>{analytics?.visitors ?? 0}</strong>
          <span>Visitors</span>
        </article>
        <article className="content-card">
          <strong>{analytics?.pageViews ?? 0}</strong>
          <span>Page views</span>
        </article>
        <article className="content-card">
          <strong>{analytics?.leads ?? 0}</strong>
          <span>Leads</span>
        </article>
        <article className="content-card">
          <strong>{analytics?.purchases ?? 0}</strong>
          <span>Purchases</span>
        </article>
        <article className="content-card">
          <strong>
            {analytics
              ? `${(analytics.conversionRate * 100).toFixed(1)}%`
              : '0%'}
          </strong>
          <span>Conversion rate</span>
        </article>
        <article className="content-card">
          <strong>${(analytics?.revenue ?? 0).toFixed(2)}</strong>
          <span>Revenue</span>
        </article>
        <article className="content-card">
          <strong>{analytics?.aiActivity?.commandsToday ?? 0}</strong>
          <span>AI commands today</span>
        </article>
      </div>
      <div className="admin-subsection">
        <h3>Data sources</h3>
        <div className="tag-row">
          <span className="tag">
            Visitors: {analytics?.dataSources?.visitors ?? 'n/a'}
          </span>
          <span className="tag">
            Leads: {analytics?.dataSources?.leads ?? 'n/a'}
          </span>
          <span className="tag">
            Revenue: {analytics?.dataSources?.revenue ?? 'n/a'}
          </span>
        </div>
      </div>
      <div className="admin-subsection">
        <h3>Installed local models</h3>
        <div className="tag-row">
          {(analytics?.models ?? []).map((model) => (
            <span key={model.name} className="tag">
              {model.name}
            </span>
          ))}
        </div>
      </div>
      <div className="admin-subsection">
        <h3>Traffic loop</h3>
        <div className="tag-row">
          <span className="tag">
            Queued: {analytics?.traffic?.queuedTopics ?? 0}
          </span>
          <span className="tag">
            Published: {analytics?.traffic?.publishedPages ?? 0}
          </span>
        </div>
      </div>
    </section>
  )
}
