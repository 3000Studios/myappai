import React from 'react'
import PrismHeadline from '../../components/PrismHeadline.jsx'
import RevenueQueuePanel from '../../components/admin/RevenueQueuePanel.jsx'
import { useAdminDashboard } from '../../context/AdminDashboardContext.jsx'

export default function AdminRevenuePage() {
  const { revenueQueue, handleUpdateLeadStage } = useAdminDashboard()

  return (
    <div className="admin-section stack-lg">
      <div className="admin-section__intro">
        <span className="eyebrow">Revenue</span>
        <PrismHeadline text="Lead and payment queue" />
        <p className="section-intro">
          Follow up on high-intent leads, monitor recorded payments, and keep the hybrid close pipeline moving.
        </p>
      </div>
      <RevenueQueuePanel revenueQueue={revenueQueue} onUpdateLeadStage={handleUpdateLeadStage} />
    </div>
  )
}
