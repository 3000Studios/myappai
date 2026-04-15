import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeUp, staggerParent } from '../animations/variants.js'
import { trackCtaClick } from '../src/siteApi.js'

function isExternalHref(href) {
  return (
    typeof href === 'string' &&
    (/^(?:[a-z]+:)?\/\//i.test(href) ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:'))
  )
}

function slugify(value) {
  return (
    String(value ?? 'item')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'item'
  )
}

function inferOfferSlug(item) {
  if (item.offerSlug) {
    return item.offerSlug
  }

  const href = String(item.ctaHref ?? '')
  if (href.includes('operator-os')) {
    return 'operator-os'
  }
  if (href.includes('launch-sprint') || href === '/contact') {
    return 'launch-sprint'
  }
  if (href.includes('enterprise-deployment')) {
    return 'enterprise-deployment'
  }

  return item.slug ?? ''
}

function inferIntent(item) {
  if (item.intent) {
    return item.intent
  }

  const href = String(item.ctaHref ?? '')
  if (href.includes('operator-os') || href === '/pricing') {
    return 'purchase'
  }
  if (href.includes('enterprise-deployment')) {
    return 'qualification'
  }
  if (href.includes('launch-sprint') || href === '/contact') {
    return 'implementation'
  }

  return 'learn_more'
}

function handleClick(item) {
  trackCtaClick({
    ctaId: `rich-block-${slugify(item.slug ?? item.title ?? item.heading ?? item.name)}`,
    offerSlug: inferOfferSlug(item),
    intent: inferIntent(item),
  }).catch(() => {})
}

export default function RichBlocks({ title, intro, items = [] }) {
  return (
    <section className="section-card">
      {title ? <h2>{title}</h2> : null}
      {intro ? <p className="section-intro">{intro}</p> : null}
      <motion.div
        className="card-grid"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {items.map((item) => (
          <motion.article
            key={item.slug ?? item.title ?? item.heading}
            className="content-card"
            variants={fadeUp}
          >
            {item.eyebrow ? (
              <span className="meta-line">{item.eyebrow}</span>
            ) : null}
            <h3>{item.title ?? item.heading ?? item.name}</h3>
            <p>{item.description ?? item.body ?? item.summary}</p>
            {item.outcome ? (
              <p className="content-card__outcome">{item.outcome}</p>
            ) : null}
            {item.bullets ? (
              <ul className="bullet-list">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {item.ctaLabel && item.ctaHref ? (
              isExternalHref(item.ctaHref) ? (
                <a
                  className="button button--ghost"
                  href={item.ctaHref}
                  onClick={() => handleClick(item)}
                >
                  {item.ctaLabel}
                </a>
              ) : (
                <Link
                  className="button button--ghost"
                  to={item.ctaHref}
                  onClick={() => handleClick(item)}
                >
                  {item.ctaLabel}
                </Link>
              )
            ) : null}
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
