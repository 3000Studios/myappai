import React from 'react'
import PrismHeadline from '../../components/PrismHeadline.jsx'
import TrafficPanel from '../../components/admin/TrafficPanel.jsx'
import { useAdminDashboard } from '../../context/AdminDashboardContext.jsx'

export default function AdminTrafficPage() {
  const {
    analytics,
    contentBundle,
    handleDiscoverTopics,
    handleRunTrafficCycle,
    trafficBusy,
  } = useAdminDashboard()

  return (
    <div className="admin-section stack-lg">
      <div className="admin-section__intro">
        <span className="eyebrow">Traffic & SEO</span>
        <PrismHeadline text="Demand and publishing loop" />
        <p className="section-intro">
          Discover topics, run traffic cycles, and monitor SEO pages generated
          for your funnel.
        </p>
      </div>
      <TrafficPanel
        analytics={analytics}
        contentBundle={contentBundle}
        onDiscoverTopics={handleDiscoverTopics}
        onRunTrafficCycle={handleRunTrafficCycle}
        busy={trafficBusy}
      />
    </div>
  )
}
