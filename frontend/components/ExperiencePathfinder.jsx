import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { trackConversionEvent } from '../src/siteApi.js'

const GROUP_OPTIONS = [
  { value: 'family', label: 'Family trip' },
  { value: 'group', label: 'Group retreat' },
  { value: 'exploring', label: 'Still exploring' },
]

const SUPPORT_OPTIONS = [
  { value: 'fast', label: 'Book something simple' },
  { value: 'guided', label: 'Need planning support' },
  { value: 'custom', label: 'Need custom coordination' },
]

const TIMELINE_OPTIONS = [
  { value: 'soon', label: 'This season' },
  { value: 'later', label: 'Next trip window' },
  { value: 'unsure', label: 'Still comparing' },
]

function getRecommendation({ groupType, supportNeed, timeline }) {
  if (groupType === 'group' || supportNeed === 'custom') {
    return {
      eyebrow: 'Best fit',
      title: 'Group Retreat Planning',
      summary:
        'Start with a qualification-first planning conversation when you are coordinating people, timing, and logistics.',
      bullets: [
        'Best for schools, churches, and organizations',
        'Custom scoping before the final route is confirmed',
        'Designed for higher-touch planning and clearer decision-making',
      ],
      href: '/products/enterprise-deployment',
      ctaLabel: 'Plan a group retreat',
      offerSlug: 'enterprise-deployment',
      intent: 'qualification',
    }
  }

  if (supportNeed === 'guided' || groupType === 'family') {
    return {
      eyebrow: 'Recommended path',
      title: 'Family Adventure Weekend',
      summary:
        'Choose the guided family lane when you want a curated experience, stronger planning support, and a more memorable shared trip.',
      bullets: [
        'Best for families who want help narrowing the right fit',
        'Ideal when experience quality matters more than booking speed alone',
        'Moves naturally from inspiration into a planning inquiry',
      ],
      href: '/products/launch-sprint',
      ctaLabel: 'Start family planning',
      offerSlug: 'launch-sprint',
      intent: 'implementation',
    }
  }

  return {
    eyebrow: timeline === 'soon' ? 'Fastest route' : 'Best first step',
    title: 'Season Pass',
    summary:
      'Use the direct booking lane when you already know the fit and want the simplest route from interest to checkout.',
    bullets: [
      'Best for simpler, faster purchase decisions',
      'Direct checkout appears only when the route is truly ready',
      'Keeps the premium feel without adding planning friction',
    ],
    href: '/products/operator-os',
    ctaLabel: 'View Season Pass',
    offerSlug: 'operator-os',
    intent: 'purchase',
  }
}

function OptionGroup({ label, options, value, onChange, name }) {
  return (
    <fieldset className="pathfinder-group">
      <legend>{label}</legend>
      <div className="pathfinder-group__options">
        {options.map((option) => (
          <label
            key={option.value}
            className={`pathfinder-option${value === option.value ? ' pathfinder-option--active' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function ExperiencePathfinder() {
  const [groupType, setGroupType] = useState('family')
  const [supportNeed, setSupportNeed] = useState('guided')
  const [timeline, setTimeline] = useState('soon')
  const hasTrackedRef = useRef(false)

  const recommendation = useMemo(
    () => getRecommendation({ groupType, supportNeed, timeline }),
    [groupType, supportNeed, timeline]
  )

  useEffect(() => {
    if (!hasTrackedRef.current) {
      hasTrackedRef.current = true
      return
    }

    trackConversionEvent('quiz_completed', {
      ctaId: 'experience-pathfinder',
      intent: recommendation.intent,
      offerSlug: recommendation.offerSlug,
      details: {
        groupType,
        supportNeed,
        timeline,
      },
    }).catch(() => {})
  }, [
    groupType,
    recommendation.intent,
    recommendation.offerSlug,
    supportNeed,
    timeline,
  ])

  return (
    <section className="section-card pathfinder">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Pathfinder</span>
          <h2>
            Answer three quick questions and we will point you to the strongest
            next step.
          </h2>
          <p className="section-intro">
            This keeps the site useful and interactive without turning the
            experience into a noisy gimmick.
          </p>
        </div>
        <span className="stat-pill">Interactive planning tool</span>
      </div>

      <div className="pathfinder__grid">
        <div className="pathfinder__controls">
          <OptionGroup
            label="Who are you planning for?"
            options={GROUP_OPTIONS}
            value={groupType}
            onChange={setGroupType}
            name="groupType"
          />
          <OptionGroup
            label="What kind of support do you want?"
            options={SUPPORT_OPTIONS}
            value={supportNeed}
            onChange={setSupportNeed}
            name="supportNeed"
          />
          <OptionGroup
            label="When are you deciding?"
            options={TIMELINE_OPTIONS}
            value={timeline}
            onChange={setTimeline}
            name="timeline"
          />
        </div>

        <aside className="pathfinder__result">
          <span className="meta-line">{recommendation.eyebrow}</span>
          <h3>{recommendation.title}</h3>
          <p>{recommendation.summary}</p>
          <ul className="bullet-list">
            {recommendation.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className="hero__actions">
            <Link
              className="button button--primary"
              to={recommendation.href}
              onClick={() =>
                trackConversionEvent('cta_click', {
                  ctaId: 'experience-pathfinder-primary',
                  intent: recommendation.intent,
                  offerSlug: recommendation.offerSlug,
                  details: {
                    groupType,
                    supportNeed,
                    timeline,
                  },
                }).catch(() => {})
              }
            >
              {recommendation.ctaLabel}
            </Link>
            <Link
              className="button button--ghost"
              to="/contact"
              onClick={() =>
                trackConversionEvent('cta_click', {
                  ctaId: 'experience-pathfinder-secondary',
                  intent: 'implementation',
                  offerSlug: 'launch-sprint',
                  details: {
                    source: 'pathfinder',
                  },
                }).catch(() => {})
              }
            >
              Ask the planning team
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
