import React from 'react'

export default function TrafficPanel({
  analytics,
  contentBundle,
  onDiscoverTopics,
  onRunTrafficCycle,
  busy,
}) {
  const traffic = analytics?.traffic
  const recentPosts = (contentBundle?.blog ?? []).slice(0, 4)

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <span className="eyebrow">Traffic Engine</span>
          <h2>Search demand and publishing loop</h2>
        </div>
        <div className="admin-actions">
          <button
            className="button button--ghost"
            type="button"
            onClick={onDiscoverTopics}
            disabled={busy}
          >
            Preview topics
          </button>
          <button
            className="button button--primary"
            type="button"
            onClick={onRunTrafficCycle}
            disabled={busy}
          >
            {busy ? 'Running...' : 'Run traffic cycle'}
          </button>
        </div>
      </div>

      <div className="card-grid card-grid--compact">
        <article className="content-card">
          <strong>{traffic?.queuedTopics ?? 0}</strong>
          <span>Queued topics</span>
        </article>
        <article className="content-card">
          <strong>{traffic?.publishedPages ?? 0}</strong>
          <span>Published traffic pages</span>
        </article>
        <article className="content-card">
          <strong>{traffic?.topQueuedTopic?.score ?? 0}</strong>
          <span>Top topic score</span>
        </article>
      </div>

      <div className="admin-subsection">
        <h3>Best queued topic</h3>
        <div className="content-card content-card--dense">
          <strong>
            {traffic?.topQueuedTopic?.topic ?? 'No queued topics yet'}
          </strong>
          <p>
            {traffic?.topQueuedTopic?.intent
              ? `Intent: ${traffic.topQueuedTopic.intent}`
              : 'Run discovery to populate the queue.'}
          </p>
        </div>
      </div>

      <div className="admin-subsection">
        <h3>Recent SEO pages</h3>
        <div className="stack-sm">
          {recentPosts.map((post) => (
            <div key={post.slug} className="commit-row">
              <strong>{post.slug}</strong>
              <span>{post.data?.title ?? post.slug}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
