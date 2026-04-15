import React from 'react'

export default function MetricStrip({ items = [] }) {
  return (
    <div className="metric-strip">
      {items.map((item) => (
        <article key={item.label} className="metric-card">
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </article>
      ))}
    </div>
  )
}
