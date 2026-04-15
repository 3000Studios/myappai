import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { submitLead, trackConversionEvent } from '../src/siteApi.js'

const OFFER_SLUGS = {
  'Season Pass': 'operator-os',
  'Family Adventure Weekend': 'launch-sprint',
  'Group Retreat Planning': 'enterprise-deployment',
}

function createInitialForm(interestDefault) {
  return {
    name: '',
    email: '',
    company: '',
    interest: interestDefault,
    notes: '',
    intent: 'planning',
    stage: 'new',
  }
}

function toOfferSlug(interest) {
  return OFFER_SLUGS[interest] ?? ''
}

export default function ContactLeadForm({
  interestDefault = 'Family Adventure Weekend',
  ctaId = 'contact-form',
  heading = 'Start a real planning conversation',
  intro = 'Use this form to share what you want so the next step can be routed to the right booking or planning path.',
  submitLabel = 'Send inquiry',
}) {
  const location = useLocation()
  const [form, setForm] = useState(() => createInitialForm(interestDefault))
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setForm((current) => ({
      ...current,
      interest: interestDefault,
    }))
  }, [interestDefault])

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setBusy(true)
      setError('')
      const payload = {
        ...form,
        sourcePath: location.pathname,
        ctaId,
      }
      await submitLead(payload)
      await trackConversionEvent('lead_submit', {
        path: location.pathname,
        ctaId,
        offerSlug: toOfferSlug(form.interest),
        intent: form.intent,
        stage: form.stage,
        details: {
          interest: form.interest,
        },
      })
      setSuccess(
        'Your inquiry has been captured and routed into the planning pipeline. The team can now review the details and guide the next step.'
      )
      setForm(createInitialForm(interestDefault))
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section-card">
      <span className="eyebrow">Lead capture</span>
      <h2>{heading}</h2>
      <p className="section-intro">{intro}</p>
      <form className="lead-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="Your name"
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="you@company.com"
            required
          />
        </label>
        <label className="field">
          <span>Company</span>
          <input
            name="company"
            value={form.company}
            onChange={updateField}
            placeholder="Company or brand"
          />
        </label>
        <label className="field">
          <span>Best-fit offer</span>
          <select name="interest" value={form.interest} onChange={updateField}>
            <option>Season Pass</option>
            <option>Family Adventure Weekend</option>
            <option>Group Retreat Planning</option>
          </select>
        </label>
        <label className="field field--full">
          <span>What outcome do you want?</span>
          <textarea
            name="notes"
            rows="5"
            value={form.notes}
            onChange={updateField}
            placeholder="Describe the kind of camp experience, family trip, retreat, or support you want help with."
          />
        </label>
        <div className="checkout-actions">
          <button
            className="button button--primary"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Sending...' : submitLabel}
          </button>
        </div>
        {success ? <p className="form-success">{success}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
      </form>
    </section>
  )
}
