import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  startPayPalCheckout,
  startStripeCheckout,
  trackConversionEvent,
  trackCtaClick,
} from '../src/siteApi.js'

export default function OfferCheckoutCard({ offer }) {
  const [busyProvider, setBusyProvider] = useState('')
  const [error, setError] = useState('')

  async function beginCheckout(provider) {
    try {
      setBusyProvider(provider)
      setError('')
      await trackConversionEvent('checkout_start', {
        ctaId: `checkout-${provider}-${offer.slug}`,
        offerSlug: offer.slug,
        provider,
        intent: 'purchase',
      })
      const response =
        provider === 'stripe'
          ? await startStripeCheckout(offer.slug)
          : await startPayPalCheckout(offer.slug)

      window.location.assign(response.url)
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setBusyProvider('')
    }
  }

  return (
    <article
      className={`content-card pricing-card${offer.providers.stripe ? ' pricing-card--featured' : ''}`}
    >
      <span className="meta-line">{offer.priceAnchor}</span>
      <h3>{offer.name}</h3>
      <p>{offer.summary}</p>
      <div className="tag-row">
        <span className="tag">{offer.closeMode}</span>
        {offer.providers.stripe ? <span className="tag">Stripe</span> : null}
        {offer.providers.paypal ? <span className="tag">PayPal</span> : null}
      </div>
      {offer.idealFor ? (
        <p className="content-card__outcome">{offer.idealFor}</p>
      ) : null}
      <div className="checkout-actions">
        {offer.closeMode === 'checkout' && offer.providers.stripe ? (
          <button
            className="button button--primary"
            type="button"
            onClick={() => beginCheckout('stripe')}
            disabled={busyProvider !== ''}
          >
            {busyProvider === 'stripe'
              ? 'Opening Stripe...'
              : 'Pay with Stripe'}
          </button>
        ) : null}
        {offer.closeMode === 'checkout' && offer.providers.paypal ? (
          <button
            className="button button--ghost"
            type="button"
            onClick={() => beginCheckout('paypal')}
            disabled={busyProvider !== ''}
          >
            {busyProvider === 'paypal'
              ? 'Opening PayPal...'
              : 'Pay with PayPal'}
          </button>
        ) : null}
        {offer.closeMode !== 'checkout' ? (
          <Link
            className="button button--primary"
            to={offer.primaryCtaHref}
            onClick={() =>
              trackCtaClick({
                ctaId: `cta-${offer.slug}`,
                offerSlug: offer.slug,
                intent:
                  offer.closeMode === 'lead'
                    ? 'implementation'
                    : 'qualification',
              }).catch(() => {})
            }
          >
            {offer.primaryCtaLabel}
          </Link>
        ) : null}
        {offer.closeMode === 'checkout' ? (
          <Link
            className="button button--ghost"
            to={offer.primaryCtaHref}
            onClick={() =>
              trackCtaClick({
                ctaId: `details-${offer.slug}`,
                offerSlug: offer.slug,
                intent: 'learn_more',
              }).catch(() => {})
            }
          >
            View offer details
          </Link>
        ) : null}
        {offer.closeMode === 'lead' &&
        (offer.providers.stripe || offer.providers.paypal) ? (
          <button
            className="button button--ghost"
            type="button"
            onClick={() =>
              beginCheckout(offer.providers.stripe ? 'stripe' : 'paypal')
            }
            disabled={busyProvider !== ''}
          >
            {busyProvider ? 'Opening checkout...' : 'Prefer instant checkout'}
          </button>
        ) : null}
      </div>
      {offer.closeMode === 'checkout' &&
      !offer.providers.stripe &&
      !offer.providers.paypal ? (
        <p className="field-note">
          Live checkout activates automatically when real Stripe or PayPal
          configuration is present. Until then, use the product page and lead
          flow.
        </p>
      ) : null}
      {offer.closeMode === 'checkout' && offer.providers.paypal ? (
        <p className="field-note">
          PayPal can route through a secure fallback payment link when direct
          API credentials are not configured.
        </p>
      ) : null}
      {offer.closeMode === 'lead' ? (
        <p className="field-note">
          This offer closes best through an implementation brief, then
          optionally through instant checkout if the live provider is
          configured.
        </p>
      ) : null}
      {offer.closeMode === 'qualification' ? (
        <p className="field-note">
          Qualification comes first here because hosting, governance, and
          rollout scope need review before a paid path is opened.
        </p>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}
    </article>
  )
}
