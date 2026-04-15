import React from 'react'
import PrismHeadline from '../../components/PrismHeadline.jsx'
import DeploymentPanel from '../../components/admin/DeploymentPanel.jsx'
import { useAdminDashboard } from '../../context/AdminDashboardContext.jsx'

export default function AdminDeployPage() {
  const { deployments, handleDeploy, deployBusy } = useAdminDashboard()

  return (
    <div className="admin-section stack-lg">
      <div className="admin-section__intro">
        <span className="eyebrow">Deploy</span>
        <PrismHeadline text="Ship to production" />
        <p className="section-intro">
          Trigger Cloudflare and Git deployments, then review history and recent
          commits.
        </p>
      </div>
      <DeploymentPanel
        deployments={deployments}
        onDeploy={handleDeploy}
        busy={deployBusy}
      />
    </div>
  )
}
