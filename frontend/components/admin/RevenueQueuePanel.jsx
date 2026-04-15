import React, { useState } from 'react'

const LEAD_STAGES = ['new', 'qualified', 'contacted', 'proposal_sent', 'won', 'lost']

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function formatDate(value) {
  if (!value) {
    return 'n/a'
  }

  return new Date(value).toLocaleString()
}

export default function RevenueQueuePanel({ revenueQueue, onUpdateLeadStage }) {
  const [draftStages, setDraftStages] = useState({})

  const leads = revenueQueue?.leads ?? []
  const payments = revenueQueue?.payments ?? []

  function getStageValue(lead) {
    return draftStages[lead.id] ?? lead.stage ?? 'new'
  }

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <span className="eyebrow">Revenue queue</span>
          <h2>Leads and payment records</h2>
        </div>
      </div>

      <div className="card-grid card-grid--compact">
        <article className="content-card">
          <strong>{revenueQueue?.totals?.openLeads ?? 0}</strong>
          <span>Open leads</span>
        </article>
        <article className="content-card">
          <strong>{revenueQueue?.totals?.completedPayments ?? 0}</strong>
          <span>Completed payments</span>
        </article>
        <article className="content-card">
          <strong>{formatCurrency(revenueQueue?.totals?.revenue ?? 0)}</strong>
          <span>Recorded revenue</span>
        </article>
      </div>

      <div className="admin-subsection">
        <h3>Lead queue</h3>
        <div className="stack-sm">
          {leads.length === 0 ? (
            <article className="content-card content-card--dense">
              <strong>No leads yet</strong>
              <p>Lead submissions will appear here with source path, intent, and follow-up stage.</p>
            </article>
          ) : (
            leads.map((lead) => (
              <article key={lead.id} className="content-card content-card--dense">
                <div className="content-card__row">
                  <strong>{lead.name || lead.email}</strong>
                  <span>{lead.interest || 'General inquiry'}</span>
                </div>
                <p>{lead.notes || 'No notes submitted.'}</p>
                <div className="tag-row">
                  <span className="tag">{lead.email}</span>
                  {lead.company ? <span className="tag">{lead.company}</span> : null}
                  {lead.sourcePath ? <span className="tag">{lead.sourcePath}</span> : null}
                  {lead.ctaId ? <span className="tag">{lead.ctaId}</span> : null}
                </div>
                <div className="admin-actions admin-actions--stack">
                  <label className="field field--inline">
                    <span>Stage</span>
                    <select
                      value={getStageValue(lead)}
                      onChange={(event) =>
                        setDraftStages((current) => ({
                          ...current,
                          [lead.id]: event.target.value
                        }))
                      }
                    >
                      {LEAD_STAGES.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="button button--ghost"
                    type="button"
                    onClick={() =>
                      onUpdateLeadStage(lead.id, {
                        stage: getStageValue(lead),
                        status: getStageValue(lead) === 'won' || getStageValue(lead) === 'lost' ? 'closed' : 'open'
                      })
                    }
                  >
                    Save stage
                  </button>
                </div>
                <span className="meta-line">
                  {lead.intent || 'high_intent'} · {lead.status || 'open'} · updated {formatDate(lead.updatedAt ?? lead.createdAt)}
                </span>
              </article>
            ))
          )}
        </div>
      </div>

      <div className="admin-subsection">
        <h3>Recent payments</h3>
        <div className="stack-sm">
          {payments.length === 0 ? (
            <article className="content-card content-card--dense">
              <strong>No payments recorded yet</strong>
              <p>Completed Stripe and PayPal transactions will appear here when the live providers are configured.</p>
            </article>
          ) : (
            payments.map((payment) => (
              <article key={`${payment.provider}-${payment.transactionId}`} className="content-card content-card--dense">
                <div className="content-card__row">
                  <strong>{formatCurrency((payment.amountCents ?? 0) / 100)}</strong>
                  <span>{payment.provider}</span>
                </div>
                <p>{payment.offerSlug || 'Unknown offer'} · {payment.customerEmail || 'No customer email recorded'}</p>
                <span className="meta-line">
                  {payment.status} · recorded {formatDate(payment.recordedAt)}
                </span>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
