import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react'
import GlobalTicker from '../components/GlobalTicker'
import HeroVideoBackground from '../components/HeroVideoBackground'
import './ReferralZone.css'

const ReferralZone = () => {
  const { referralId } = useParams()
  const navigate = useNavigate()
  const [referralData, setReferralData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [discountCode, setDiscountCode] = useState('')
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Parse referral data from URL or fetch from API
  useEffect(() => {
    const loadReferralData = async () => {
      setIsLoading(true)

      try {
        // In production, this would fetch from your API
        // For now, we'll simulate with demo data
        const mockReferralData = {
          id: referralId || 'demo',
          title: 'Elite AI Website Builder',
          description:
            'Transform your business with our cutting-edge AI-powered website building platform',
          originalUrl: 'https://example.com/offer',
          brandColors: {
            primary: '#00ff88',
            secondary: '#0088ff',
            accent: '#ff00ff',
          },
          discount: {
            percentage: 25,
            code: 'ELITE25',
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          },
          features: [
            'AI-powered website generation',
            'Voice command integration',
            'Real-time analytics',
            'Premium templates',
            '24/7 support',
            '30-day money-back guarantee',
          ],
          testimonials: [
            {
              name: 'Sarah Johnson',
              role: 'CEO, TechStart Inc.',
              content:
                'This platform transformed our online presence. Sales increased by 300%!',
              rating: 5,
            },
            {
              name: 'Mike Chen',
              role: 'Marketing Director',
              content:
                'The AI features are incredible. We launched our site in hours, not weeks.',
              rating: 5,
            },
          ],
          pricing: {
            original: 299.99,
            discounted: 224.99,
            savings: 75.0,
          },
          stats: {
            usersServed: '50,000+',
            satisfactionRate: '98%',
            uptime: '99.9%',
            awards: '15+ Industry Awards',
          },
        }

        setReferralData(mockReferralData)
        setDiscountCode(mockReferralData.discount.code)

        // Set up countdown
        const countdownInterval = setInterval(() => {
          const now = new Date()
          const validUntil = new Date(mockReferralData.discount.validUntil)
          const difference = validUntil - now

          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24))
            const hours = Math.floor(
              (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            )
            const minutes = Math.floor(
              (difference % (1000 * 60 * 60)) / (1000 * 60)
            )
            const seconds = Math.floor((difference % (1000 * 60)) / 1000)

            setCountdown({ days, hours, minutes, seconds })
          } else {
            setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            clearInterval(countdownInterval)
          }
        }, 1000)

        return () => clearInterval(countdownInterval)
      } catch (error) {
        console.error('Error loading referral data:', error)
        // Redirect to home if invalid referral
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }

    loadReferralData()
  }, [referralId, navigate])

  const handleCTAClick = () => {
    // Track conversion
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'conversion', {
        event_category: 'referral',
        event_label: referralData?.id,
        value: referralData?.pricing?.discounted,
      })
    }

    // Redirect to original referral URL with tracking
    if (referralData?.originalUrl) {
      const trackingUrl = `${referralData.originalUrl}?ref=${referralId}&source=myappai`
      window.open(trackingUrl, '_blank')
    }
  }

  const copyDiscountCode = () => {
    navigator.clipboard.writeText(discountCode)
    // Show success feedback
    const button = document.getElementById('copy-button')
    if (button) {
      button.textContent = 'Copied!'
      setTimeout(() => {
        button.textContent = 'Copy Code'
      }, 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="referral-zone loading">
        <HeroVideoBackground />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Your Exclusive Offer...</h2>
        </div>
      </div>
    )
  }

  if (!referralData) {
    return (
      <div className="referral-zone error">
        <HeroVideoBackground />
        <div className="error-container">
          <h2>Invalid Referral Link</h2>
          <p>This referral link is no longer valid or has expired.</p>
          <button onClick={() => navigate('/')} className="home-button">
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="referral-zone"
      style={{ '--primary-color': referralData.brandColors.primary }}
    >
      <HeroVideoBackground />

      {/* Sticky Mobile CTA */}
      <div className="mobile-sticky-cta">
        <button onClick={handleCTAClick} className="mobile-cta-button">
          Get {referralData.discount.percentage}% OFF
        </button>
      </div>

      {/* Hero Section */}
      <section className="referral-hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="discount-badge">
            <span className="discount-percentage">
              {referralData.discount.percentage}% OFF
            </span>
            <span className="discount-text">Limited Time</span>
          </div>

          <h1 className="hero-title">{referralData.title}</h1>
          <p className="hero-description">{referralData.description}</p>

          <div className="hero-cta">
            <button onClick={handleCTAClick} className="primary-cta">
              Claim Your Discount Now
              <ExternalLink size={20} />
            </button>

            <div className="discount-code-box">
              <input
                type="text"
                value={discountCode}
                readOnly
                className="discount-input"
              />
              <button
                id="copy-button"
                onClick={copyDiscountCode}
                className="copy-button"
              >
                Copy Code
              </button>
            </div>
          </div>

          <div className="urgency-timer">
            <Clock size={16} />
            <span>Offer expires in:</span>
            <div className="countdown">
              <span>{countdown.days}d</span>
              <span>{countdown.hours}h</span>
              <span>{countdown.minutes}m</span>
              <span>{countdown.seconds}s</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Why Choose This Platform?</h2>
          <p>Industry-leading features that deliver real results</p>
        </motion.div>

        <div className="features-grid">
          {referralData.features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CheckCircle size={24} className="feature-icon" />
              <span>{feature}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <motion.div
          className="pricing-card"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="pricing-header">
            <h3>Limited Time Offer</h3>
            <div className="discount-badge-large">
              Save ${referralData.pricing.savings}
            </div>
          </div>

          <div className="pricing-content">
            <div className="price-comparison">
              <div className="original-price">
                <span className="price-label">Regular Price</span>
                <span className="price-strikethrough">
                  ${referralData.pricing.original}
                </span>
              </div>
              <div className="discounted-price">
                <span className="price-label">Your Price</span>
                <span className="price-main">
                  ${referralData.pricing.discounted}
                </span>
                <span className="price-savings">
                  Save {referralData.discount.percentage}%
                </span>
              </div>
            </div>

            <button onClick={handleCTAClick} className="pricing-cta">
              Get Instant Access
              <TrendingUp size={20} />
            </button>

            <div className="guarantee">
              <Shield size={16} />
              <span>30-Day Money-Back Guarantee</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>What Our Users Say</h2>
          <p>Join thousands of satisfied customers</p>
        </motion.div>

        <div className="testimonials-grid">
          {referralData.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="testimonial-header">
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="star-filled" />
                  ))}
                </div>
              </div>
              <p className="testimonial-content">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {Object.entries(referralData.stats).map(([key, value], index) => (
            <motion.div
              key={key}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="stat-value">{value}</div>
              <div className="stat-label">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <motion.div
          className="final-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to Transform Your Business?</h2>
          <p>Join thousands of successful businesses using our platform</p>
          <button onClick={handleCTAClick} className="final-cta-button">
            Get Started with {referralData.discount.percentage}% OFF
            <ExternalLink size={20} />
          </button>
        </motion.div>
      </section>

      {/* Global Ticker */}
      <GlobalTicker />
    </div>
  )
}

export default ReferralZone
