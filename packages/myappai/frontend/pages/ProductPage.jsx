import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ContactLeadForm from '../components/ContactLeadForm.jsx'
import OfferCheckoutCard from '../components/OfferCheckoutCard.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import RichBlocks from '../components/RichBlocks.jsx'
import { trackCtaClick } from '../src/siteApi.js'
import { useSiteRuntime } from '../src/SiteRuntimeContext.jsx'
import { productLookup } from '../src/siteData.js'

function formatCloseMode(closeMode) {
  switch (closeMode) {
    case 'checkout':
      return 'Direct checkout'
    case 'lead':
      return 'Lead form first'
    case 'qualification':
      return 'Qualification first'
    default:
      return 'Guided close'
  }
}

export default function ProductPage() {
  const { slug } = useParams()
  const product = productLookup[slug]
  const { snapshot } = useSiteRuntime()
  const liveOffer =
    snapshot?.commerce?.offers?.find((offer) => offer.slug === slug) ?? null
  const closeMode = product?.closeMode ?? liveOffer?.closeMode ?? 'checkout'

  if (!product) {
    return <Navigate to="/products" replace />
  }

  return (
    <div className="stack-2xl">
      <section className="section-card section-card--hero product-hero">
        <div className="product-hero__content stack-lg">
          <span className="eyebrow">{product.eyebrow ?? 'Offer'}</span>
          <PrismHeadline text={product.headline ?? product.name} />
          <p className="section-intro">
            {product.description ?? product.summary}
          </p>
          <div className="tag-row">
            <span className="tag">{product.priceAnchor}</span>
            <span className="tag">{formatCloseMode(closeMode)}</span>
            {product.idealFor ? (
              <span className="tag">{product.idealFor}</span>
            ) : null}
          </div>
        </div>

        <aside className="product-hero__aside stack-md">
          <span className="panel-kicker">Offer snapshot</span>
          <div className="product-hero__panel">
            <strong>Best for</strong>
            <p className="field-note">
              {product.idealFor ??
                'Visitors who already know this is the right fit.'}
            </p>
          </div>
          <div className="product-hero__panel">
            <strong>Decision style</strong>
            <p className="field-note">
              {formatCloseMode(closeMode)} keeps the action aligned with how
              much coordination the trip really needs.
            </p>
          </div>
          <div className="product-hero__panel">
            <strong>Commercial role</strong>
            <p className="field-note">
              {product.outcome ??
                'Designed to move visitors from trust into the right next step.'}
            </p>
          </div>
        </aside>
      </section>

      <section className="detail-grid">
        <div className="stack-xl">
          {closeMode === 'checkout' && liveOffer ? (
            <OfferCheckoutCard offer={liveOffer} />
          ) : null}
          {closeMode !== 'checkout' ? (
            <ContactLeadForm
              interestDefault={product.name}
              ctaId={`${slug}-brief-form`}
              heading={
                product.leadForm?.heading ?? `Start the ${product.name} brief`
              }
              intro={
                product.leadForm?.intro ??
                'Use this form to describe the experience, timing, and planning details before the next step is confirmed.'
              }
              submitLabel={
                product.leadForm?.submitLabel ?? `Send ${product.name} inquiry`
              }
            />
          ) : null}

          {product.bullets ? (
            <section className="section-card">
              <h2>What it unlocks</h2>
              <ul className="bullet-list">
                {product.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {product.proofPoints ? (
            <RichBlocks
              title="Proof and readiness"
              intro="This offer earns trust through clarity, premium positioning, and a booking path that matches the visitor."
              items={product.proofPoints}
            />
          ) : null}
        </div>

        <aside className="section-card detail-sidebar">
          <span className="eyebrow">Offer architecture</span>
          <h2>How this lane is meant to work</h2>
          <div className="stack-sm">
            {(product.sections ?? []).map((section) => (
              <article key={section.title} className="board-card">
                <strong>{section.title}</strong>
                <p>{section.description}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      {product.deliverables ? (
        <RichBlocks title="Deliverables" items={product.deliverables} />
      ) : null}
      {product.qualificationChecks ? (
        <RichBlocks
          title="Qualification checks"
          items={product.qualificationChecks}
        />
      ) : null}

      {product.timeline ? (
        <section className="section-card">
          <span className="eyebrow">Timeline</span>
          <h2>From interest to shipped work</h2>
          <div className="card-grid card-grid--compact">
            {product.timeline.map((step, index) => (
              <article
                key={step.title}
                className="content-card content-card--step"
              >
                <span className="step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {product.cta ? (
        <section className="section-card cta-band">
          <div>
            <span className="eyebrow">{product.cta.eyebrow}</span>
            <h2>{product.cta.heading}</h2>
            <p className="section-intro">{product.cta.body}</p>
          </div>
          <div className="hero__actions">
            <Link
              className="button button--primary"
              to={product.cta.primaryHref}
              onClick={() =>
                trackCtaClick({
                  ctaId: `product-${slug}-primary`,
                  offerSlug: slug,
                  intent:
                    closeMode === 'checkout'
                      ? 'purchase'
                      : closeMode === 'qualification'
                        ? 'qualification'
                        : 'implementation',
                }).catch(() => {})
              }
            >
              {product.cta.primaryLabel}
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  )
}
