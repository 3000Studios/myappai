import React from 'react'
import PrismHeadline from '../../components/PrismHeadline.jsx'
import ContentEditor from '../../components/admin/ContentEditor.jsx'
import { useAdminDashboard } from '../../context/AdminDashboardContext.jsx'

export default function AdminContentPage() {
  const { contentBundle, handleSaveFile, editorBusy } = useAdminDashboard()

  return (
    <div className="admin-section stack-lg">
      <div className="admin-section__intro">
        <span className="eyebrow">Content</span>
        <PrismHeadline text="Edit workspace JSON" />
        <p className="section-intro">
          Select a content module and save structured data back to the repo
          through the command API.
        </p>
      </div>
      <ContentEditor
        contentBundle={contentBundle}
        onSaveFile={handleSaveFile}
        busy={editorBusy}
      />
    </div>
  )
}
