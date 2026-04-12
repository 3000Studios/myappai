import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './HomePage.css'

const apps = [
{
  id: 'myappai',
  name: 'MyAppAI',
  tagline: 'AI-powered operator platform',
  description: 'Manage your entire web presence with plain-language instructions. Research, build, deploy — all from one dashboard.',
  icon: '🚀',
  category: 'Productivity',
  status: 'live',
  tags: ['AI', 'Operator', 'Deploy'],
  url: 'https://myappai.net',
},
{
  id: 'youtune',
  name: 'YouTuneAI',
  tagline: 'AI-powered YouTube toolkit',
  description: 'Automate your YouTube workflow. Generate titles, descriptions, tags, and thumbnails with AI trained on what actually ranks.',
  icon: '🎵',
  category: 'Creator Tools',
  status: 'beta',
  tags: ['YouTube', 'AI', 'Creator'],
  url: null,
},
{
  id: 'findmerates',
  name: 'FindMeRates',
  tagline: 'Compare rates instantly',
  description: 'Find the best rates for loans, insurance, and financial products. Real-time comparisons with no spam.',
  icon: '💰',
  category: 'Finance',
  status: 'live',
  tags: ['Finance', 'Rates', 'Compare'],
  url: 'https://findmerates.pages.dev',
},
{
  id: 'voicetowebsite',
  name: 'VoiceToWebsite',
  tagline: 'Speak your site into existence',
  description: 'Record a voice memo describing what you want. Get a fully deployed website back. No code, no drag-and-drop.',
  icon: '🎙️',
  category: 'No-Code',
  status: 'coming-soon',
  tags: ['Voice', 'AI', 'No-Code'],
  url: null,
},
{
  id: 'shadowos',
  name: 'ShadowOS Stack',
  tagline: 'Next.js AI UI framework',
  description: 'A full-stack Next.js starter with built-in AI UI, monetization engine, voice control, and auto-deploy system.',
  icon: '🌑',
  category: 'Developer Tools',
  status: 'beta',
  tags: ['Next.js', 'AI', 'Framework'],
  url: null,
},
{
  id: 'calistique',
  name: 'Calistique',
  tagline: 'Premium fitness & lifestyle',
  description: 'Curated fitness gear, apparel, and wellness products. Built for people who take their health seriously.',
  icon: '💪',
  category: 'E-Commerce',
  status: 'live',
  tags: ['Fitness', 'Lifestyle', 'Shop'],
  url: null,
},
]

const categories = ['All', 'Productivity', 'Creator Tools', 'Finance', 'No-Code', 'Developer Tools', 'E-Commerce']

const statusConfig = {
live: { label: 'Live', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
beta: { label: 'Beta', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
'coming-soon': { label: 'Coming Soon', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
}

const fadeUp = {
hidden: { opacity: 0, y: 24 },
visible: (i = 0) => ({
  opacity: 1,
  y: 0,
  transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
}),
}

export default function HomePage() {
const [activeCategory, setActiveCategory] = useState('All')

const filtered = activeCategory === 'All'
  ? apps
  : apps.filter(a => a.category === activeCategory)

return (
  <div className="storefront">

    {/* Hero */}
    <section className="storefront-hero">
      <motion.div
        className="storefront-hero__inner"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="storefront-headline">
          Apps built by<br />
          <span className="storefront-headline--accent">3000 Studios</span>
        </h1>
        <p className="storefront-subhead">
          A collection of AI-powered tools, platforms, and products — built in public, shipped fast.
        </p>
      </motion.div>
    </section>

    {/* Category Filter */}
    <section className="storefront-filter">
      <div className="storefront-filter__inner">
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>

    {/* App Grid */}
    <section className="storefront-grid-section">
      <div className="storefront-grid">
        {filtered.map((app, i) => {
          const status = statusConfig[app.status]
          return (
            <motion.div
              key={app.id}
              className="app-card"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="app-card__header">
                <div className="app-card__icon">{app.icon}</div>
                <span
                  className="app-card__status"
                  style={{ color: status.color, background: status.bg }}
                >
                  {status.label}
                </span>
              </div>

              <div className="app-card__body">
                <h3 className="app-card__name">{app.name}</h3>
                <p className="app-card__tagline">{app.tagline}</p>
                <p className="app-card__desc">{app.description}</p>
              </div>

              <div className="app-card__footer">
                <div className="app-card__tags">
                  {app.tags.map(tag => (
                    <span key={tag} className="app-tag">{tag}</span>
                  ))}
                </div>
                {app.url ? (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-card__cta"
                  >
                    Open app →
                  </a>
                ) : (
                  <span className="app-card__cta app-card__cta--disabled">
                    {app.status === 'coming-soon' ? 'Coming soon' : 'In development'}
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>

    {/* News Ticker */}
    <section className="storefront-ticker-section">
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {[
            '🚀 MyAppAI v2 launching soon',
            '🎵 YouTuneAI beta open',
            '💰 FindMeRates now live',
            '🌑 ShadowOS Stack in development',
            '🎙️ VoiceToWebsite coming Q3 2026',
            '💪 Calistique store open',
            '🔥 New apps dropping regularly',
            '🚀 MyAppAI v2 launching soon',
            '🎵 YouTuneAI beta open',
            '💰 FindMeRates now live',
            '🌑 ShadowOS Stack in development',
            '🎙️ VoiceToWebsite coming Q3 2026',
            '💪 Calistique store open',
            '🔥 New apps dropping regularly',
          ].map((item, i) => (
            <span key={i} className="ticker-item">{item}</span>
          ))}
        </div>
      </div>
    </section>

    {/* Footer CTA */}
    <section className="storefront-cta">
      <motion.div
        className="storefront-cta__inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2>Want to work together?</h2>
        <p>We build AI-powered products and tools. If you have an idea, let's talk.</p>
        <Link to="/contact" className="cta-btn">Get in touch →</Link>
      </motion.div>
    </section>

  </div>
)
}