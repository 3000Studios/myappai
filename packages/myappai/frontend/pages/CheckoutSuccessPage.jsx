import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  capturePayPalCheckout,
  trackConversionEvent,
  verifyStripeCheckout,
} from '../src/siteApi.js'
import { useSiteRuntime } from '../src/SiteRuntimeContext.jsx'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const { refresh } = useSiteRuntime()
  const [state, setState] = useState({
    loading: true,
    error: '',
    amountCents: 0,
    offerSlug: '',
    legacyPayPal: false,
  })

  useEffect(() => {
    async function confirm() {
      try {
        const provider = searchParams.get('provider')
        const sessionId = searchParams.get('session_id')
        const token = searchParams.get('token')
        const isLegacyPayPal = searchParams.get('legacy') === '1'
        const offerSlug = searchParams.get('offer') ?? ''

        if (provider === 'paypal' && isLegacyPayPal) {
          setState({
            loading: false,
            error: '',
            amountCents: 0,
            offerSlug,
            legacyPayPal: true,
          })
          await trackConversionEvent('checkout_success', {
            ctaId: 'checkout-success-paypal-legacy',
            offerSlug,
            provider: 'paypal',
            intent: 'purchase',
          })
          await refresh()
          return
        }

        const result =
          provider === 'paypal' && token
            ? await capturePayPalCheckout(token)
            : await verifyStripeCheckout(sessionId ?? '')

        setState({
          loading: false,
          error: result.completed ? '' : 'Payment is not marked complete yet.',
          amountCents: result.amountCents ?? 0,
          offerSlug: result.offerSlug ?? '',
          legacyPayPal: false,
        })
        if (result.completed) {
          await trackConversionEvent('checkout_success', {
            ctaId: `checkout-success-${provider ?? 'unknown'}`,
            offerSlug: result.offerSlug ?? '',
            provider: provider ?? '',
            intent: 'purchase',
          })
        }
        await refresh()
      } catch (error) {
        setState({
          loading: false,
          error: error.message,
          amountCents: 0,
          offerSlug: '',
          legacyPayPal: false,
        })
      }
    }

    confirm()
  }, [refresh, searchParams])

  return (
    <div className="stack-xl">
      <section className="section-card centered-card">
        <span className="eyebrow">Checkout</span>
        <h1>
          {state.loading
            ? 'Confirming payment...'
            : state.error
              ? 'Checkout needs attention'
              : 'Payment received'}
        </h1>
        {state.error ? (
          <p className="section-intro">{state.error}</p>
        ) : state.legacyPayPal ? (
          <p className="section-intro">
            Your PayPal checkout was sent through our secure fallback payment
            link. We will confirm the payment manually and continue from there.
          </p>
        ) : (
          <p className="section-intro">
            {state.amountCents > 0
              ? `${formatCurrency(state.amountCents / 100)} recorded for ${state.offerSlug || 'your offer'}.`
              : 'Your payment has been recorded.'}
          </p>
        )}
        <div className="hero__actions">
          <Link className="button button--primary" to="/products">
            View offers
          </Link>
          <Link className="button button--ghost" to="/contact">
            Continue to delivery
          </Link>
        </div>
      </section>
    </div>
  )
}
