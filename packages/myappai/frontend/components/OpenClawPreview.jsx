import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './OpenClawPreview.css'

const OpenClawPreview = ({ request, isProcessing, onApprove, onReject }) => {
  const [previewMode, setPreviewMode] = useState('desktop')
  const [previewScale, setPreviewScale] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const previewRef = useRef(null)

  const previewSizes = {
    desktop: { width: '100%', height: '600px', scale: 1 },
    tablet: { width: '768px', height: '1024px', scale: 0.8 },
    mobile: { width: '375px', height: '667px', scale: 0.5 },
  }

  const generatePreviewContent = () => {
    if (!request) return null

    // Simulate different preview types based on request
    if (request.type === 'create_page') {
      return (
        <div className="preview-page">
          <header className="preview-header">
            <h1>{request.name || 'New Page'}</h1>
            <nav className="preview-nav">
              <span>Home</span>
              <span>{request.name || 'New Page'}</span>
              <span>Revenue</span>
              <span>OpenClaw</span>
            </nav>
          </header>
          <main className="preview-main">
            <section className="preview-hero">
              <h2>Welcome to {request.name || 'Your New Page'}</h2>
              <p>
                This is a preview of your new page with modern design and
                responsive layout.
              </p>
              <div className="preview-cta">
                <button className="preview-btn primary">Get Started</button>
                <button className="preview-btn secondary">Learn More</button>
              </div>
            </section>
            <section className="preview-features">
              <div className="feature-card">
                <h3>🚀 Fast Performance</h3>
                <p>Optimized for speed and user experience</p>
              </div>
              <div className="feature-card">
                <h3>🎨 Beautiful Design</h3>
                <p>Modern UI with stunning animations</p>
              </div>
              <div className="feature-card">
                <h3>💰 Revenue Ready</h3>
                <p>Built-in monetization features</p>
              </div>
            </section>
          </main>
          <footer className="preview-footer">
            <p>© 2026 MyAppAI - Powered by OpenClaw AI</p>
          </footer>
        </div>
      )
    }

    if (request.type === 'deploy') {
      return (
        <div className="preview-deployment">
          <div className="deployment-status">
            <div className="status-icon">🚀</div>
            <h2>Deployment Preview</h2>
            <p>Your changes are ready to deploy to myappai.net</p>

            <div className="deployment-checklist">
              <h3>Deployment Checklist:</h3>
              <div className="checklist-item">
                <span className="check">✅</span>
                <span>Code validation passed</span>
              </div>
              <div className="checklist-item">
                <span className="check">✅</span>
                <span>Build optimization complete</span>
              </div>
              <div className="checklist-item">
                <span className="check">✅</span>
                <span>Security scan passed</span>
              </div>
              <div className="checklist-item">
                <span className="check">✅</span>
                <span>Performance optimization applied</span>
              </div>
              <div className="checklist-item">
                <span className="check">⏳</span>
                <span>Waiting for approval...</span>
              </div>
            </div>

            <div className="deployment-timeline">
              <h3>Deployment Timeline:</h3>
              <div className="timeline-item">
                <span className="time">0:00</span>
                <span className="event">Build started</span>
              </div>
              <div className="timeline-item">
                <span className="time">0:30</span>
                <span className="event">Assets optimized</span>
              </div>
              <div className="timeline-item">
                <span className="time">1:00</span>
                <span className="event">Deploy to CDN</span>
              </div>
              <div className="timeline-item">
                <span className="time">1:30</span>
                <span className="event">DNS propagation</span>
              </div>
              <div className="timeline-item">
                <span className="time">2:00</span>
                <span className="event">Live at myappai.net</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (request.type === 'setup_monetization') {
      return (
        <div className="preview-monetization">
          <div className="monetization-overview">
            <h2>💰 Revenue Setup Preview</h2>
            <p>
              Your monetization system will be configured with these features:
            </p>

            <div className="revenue-preview-grid">
              <div className="revenue-preview-card">
                <div className="card-icon">🎯</div>
                <h3>Google AdSense</h3>
                <p>AI-optimized ad placements</p>
                <div className="revenue-estimate">+$45/day</div>
              </div>
              <div className="revenue-preview-card">
                <div className="card-icon">💳</div>
                <h3>Premium Features</h3>
                <p>Subscription-based access</p>
                <div className="revenue-estimate">+$120/day</div>
              </div>
              <div className="revenue-preview-card">
                <div className="card-icon">🤖</div>
                <h3>AI Services</h3>
                <p>Custom AI solutions</p>
                <div className="revenue-estimate">+$80/day</div>
              </div>
              <div className="revenue-preview-card">
                <div className="card-icon">🏪</div>
                <h3>App Store</h3>
                <p>Marketplace commissions</p>
                <div className="revenue-estimate">+$200/day</div>
              </div>
            </div>

            <div className="payment-setup">
              <h3>Payment Gateway Setup:</h3>
              <div className="payment-providers">
                <div className="payment-provider">
                  <div className="provider-logo">💳</div>
                  <div className="provider-info">
                    <h4>Stripe</h4>
                    <p>Credit cards & digital wallets</p>
                    <span className="status">Ready</span>
                  </div>
                </div>
                <div className="payment-provider">
                  <div className="provider-logo">💰</div>
                  <div className="provider-info">
                    <h4>PayPal</h4>
                    <p>Global payment processing</p>
                    <span className="status">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="preview-default">
        <div className="default-preview">
          <h2>🦞 OpenClaw Preview</h2>
          <p>Processing your request...</p>
          <div className="preview-loading">
            <div className="loading-spinner"></div>
            <span>Generating preview...</span>
          </div>
        </div>
      </div>
    )
  }

  const currentSize = previewSizes[previewMode]

  return (
    <div className={`openclaw-preview ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="preview-header">
        <h3>🦞 OpenClaw Preview</h3>
        <div className="preview-controls">
          <div className="view-modes">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`mode-btn ${previewMode === 'desktop' ? 'active' : ''}`}
            >
              🖥️ Desktop
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`mode-btn ${previewMode === 'tablet' ? 'active' : ''}`}
            >
              📱 Tablet
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`mode-btn ${previewMode === 'mobile' ? 'active' : ''}`}
            >
              📱 Mobile
            </button>
          </div>
          <div className="preview-actions">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="fullscreen-btn"
            >
              {isFullscreen ? '🗗' : '🗖'}
            </button>
          </div>
        </div>
      </div>

      <div className="preview-content" ref={previewRef}>
        <div className="preview-viewport" style={currentSize}>
          <div className="preview-frame">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="preview-processing"
                >
                  <div className="processing-overlay">
                    <div className="processing-content">
                      <div className="claw-icon">🦞</div>
                      <h3>OpenClaw is processing...</h3>
                      <div className="processing-steps">
                        <div className="step active">Analyzing request</div>
                        <div className="step">Generating code</div>
                        <div className="step">Creating preview</div>
                        <div className="step">Ready for deployment</div>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="preview-rendered"
                >
                  {generatePreviewContent()}
                </motion.div>
              )}
            </AnimatePresence>

            {!isProcessing && request && (
              <div className="preview-decision">
                <motion.button
                  onClick={onApprove}
                  className="approve-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✅ Deploy Live
                </motion.button>
                <motion.button
                  onClick={onReject}
                  className="reject-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ❌ Cancel
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="preview-info">
        <div className="request-details">
          <h4>Request Details:</h4>
          <div className="detail-item">
            <span className="label">Type:</span>
            <span className="value">{request?.type || 'Unknown'}</span>
          </div>
          {request?.name && (
            <div className="detail-item">
              <span className="label">Name:</span>
              <span className="value">{request.name}</span>
            </div>
          )}
          <div className="detail-item">
            <span className="label">Status:</span>
            <span
              className={`value status ${isProcessing ? 'processing' : 'ready'}`}
            >
              {isProcessing ? 'Processing...' : 'Ready to deploy'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenClawPreview
