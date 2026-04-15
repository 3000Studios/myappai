import React from 'react'

export default function TestSiteBanner() {
  return (
    <div
      className="test-site-banner"
      role="note"
      aria-label="Demo site disclaimer"
    >
      <div className="test-site-banner__inner">
        <strong>MYAPPAI PREVIEW:</strong>
        <span>
          This preview environment is for operator testing and staging changes
          before publishing updates to the live MyAppAI experience.
        </span>
      </div>
    </div>
  )
}
