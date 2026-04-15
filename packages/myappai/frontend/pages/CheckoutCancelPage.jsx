import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { trackConversionEvent } from '../src/siteApi.js'

export default function CheckoutCancelPage() {
  const [searchParams] = useSearchParams()
  const provider = searchParams.get('provider') ?? ''
  const offerSlug = searchParams.get('offer') ?? ''

  useEffect(() => {
    trackConversionEvent('checkout_cancel', {
      ctaId: `checkout-cancel-${provider || 'unknown'}`,
      offerSlug,
      provider,
      intent: 'purchase'
    }).catch(() => {})
  }, [offerSlug, provider])

  return (
    <div className="stack-xl">
      <section className="section-card centered-card">
        <span className="eyebrow">Checkout</span>
        <h1>Checkout canceled</h1>
        <p className="section-intro">
          No payment was recorded. You can return to the offer, review pricing, or switch into the implementation brief flow if you want help before buying.
        </p>
        <div className="hero__actions">
          <Link className="button button--primary" to="/pricing">
            Return to pricing
          </Link>
          <Link className="button button--ghost" to="/contact">
            Start implementation brief
          </Link>
        </div>
      </section>
    </div>
  )
}
