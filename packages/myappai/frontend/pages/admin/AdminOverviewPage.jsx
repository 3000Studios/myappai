import React from 'react'
import PrismHeadline from '../../components/PrismHeadline.jsx'
import AnalyticsPanel from '../../components/admin/AnalyticsPanel.jsx'
import { useAdminDashboard } from '../../context/AdminDashboardContext.jsx'
import { SITE_DISPLAY_NAME } from '../../src/siteMeta.js'

export default function AdminOverviewPage() {
  const { analytics, initialLoadDone, lastResult } = useAdminDashboard()

  return (
    <div className="admin-section stack-lg">
      <div className="admin-section__intro">
        <span className="eyebrow">Overview</span>
        <PrismHeadline text="Site health and revenue signals" />
        <p className="section-intro">
          {!initialLoadDone
            ? 'Loading analytics from your workspace…'
            : `Live metrics from visitors, conversions, and AI activity across ${SITE_DISPLAY_NAME}.`}
        </p>
      </div>
      <AnalyticsPanel analytics={analytics} />
      {lastResult ? (
        <section className="admin-card admin-card--compact">
          <div className="admin-card__header">
            <div>
              <span className="eyebrow">Last command result</span>
              <h2>Response payload</h2>
            </div>
          </div>
          <pre className="result-panel result-panel--inline">
            {JSON.stringify(lastResult, null, 2)}
          </pre>
        </section>
      ) : null}
    </div>
  )
}
