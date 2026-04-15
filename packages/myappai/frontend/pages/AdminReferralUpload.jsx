import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Upload,
  Link2,
  Settings,
  Eye,
  TrendingUp,
  DollarSign,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import './AdminReferralUpload.css'

const AdminReferralUpload = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminCode, setAdminCode] = useState('')
  const [referralData, setReferralData] = useState({
    url: '',
    discountCode: '',
    discountPercentage: '',
    contextNotes: '',
    brandColors: {
      primary: '#00ff88',
      secondary: '#0088ff',
      accent: '#ff00ff',
    },
    title: '',
    description: '',
    features: [],
    testimonials: [],
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPages, setGeneratedPages] = useState([])
  const [analytics, setAnalytics] = useState({
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    topPerformers: [],
  })

  // Check authentication
  const handleLogin = (e) => {
    e.preventDefault()
    if (adminCode === '5555') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
    } else {
      alert('Invalid admin code')
    }
  }

  // Load saved data
  React.useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }

    // Load generated pages
    const savedPages = localStorage.getItem('generatedReferralPages')
    if (savedPages) {
      setGeneratedPages(JSON.parse(savedPages))
    }

    // Load analytics
    const savedAnalytics = localStorage.getItem('referralAnalytics')
    if (savedAnalytics) {
      setAnalytics(JSON.parse(savedAnalytics))
    }
  }, [])

  const handleInputChange = (field, value) => {
    setReferralData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleColorChange = (color, value) => {
    setReferralData((prev) => ({
      ...prev,
      brandColors: {
        ...prev.brandColors,
        [color]: value,
      },
    }))
  }

  const analyzeReferralUrl = async () => {
    if (!referralData.url) {
      alert('Please enter a referral URL')
      return
    }

    setIsGenerating(true)

    try {
      // Simulate URL analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock analysis results
      const analysis = {
        title: 'Premium AI Platform',
        description: 'Advanced AI-powered solution for modern businesses',
        features: [
          'AI-powered automation',
          'Real-time analytics',
          'Premium support',
          'Advanced features',
        ],
        testimonials: [
          {
            name: 'John Doe',
            role: 'CEO',
            content: 'Amazing platform, transformed our business!',
            rating: 5,
          },
        ],
      }

      setReferralData((prev) => ({
        ...prev,
        ...analysis,
      }))

      alert('Referral URL analyzed successfully!')
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Failed to analyze URL. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateReferralPage = async () => {
    if (!referralData.url) {
      alert('Please enter a referral URL')
      return
    }

    setIsGenerating(true)

    try {
      // Generate unique ID
      const pageId = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Create page data
      const newPage = {
        id: pageId,
        url: referralData.url,
        discountCode:
          referralData.discountCode ||
          `SAVE${referralData.discountPercentage || '20'}`,
        discountPercentage: referralData.discountPercentage || 20,
        title: referralData.title || 'Special Offer',
        description: referralData.description,
        brandColors: referralData.brandColors,
        contextNotes: referralData.contextNotes,
        createdAt: new Date().toISOString(),
        clicks: 0,
        conversions: 0,
        revenue: 0,
      }

      // Save to generated pages
      const updatedPages = [...generatedPages, newPage]
      setGeneratedPages(updatedPages)
      localStorage.setItem(
        'generatedReferralPages',
        JSON.stringify(updatedPages)
      )

      // Update analytics
      const updatedAnalytics = {
        ...analytics,
        totalClicks: analytics.totalClicks,
        totalConversions: analytics.totalConversions,
        totalRevenue: analytics.totalRevenue,
        topPerformers: updatedPages
          .sort((a, b) => (b.conversions || 0) - (a.conversions || 0))
          .slice(0, 5),
      }
      setAnalytics(updatedAnalytics)
      localStorage.setItem(
        'referralAnalytics',
        JSON.stringify(updatedAnalytics)
      )

      alert(`Referral page generated! ID: ${pageId}`)

      // Reset form
      setReferralData({
        url: '',
        discountCode: '',
        discountPercentage: '',
        contextNotes: '',
        brandColors: {
          primary: '#00ff88',
          secondary: '#0088ff',
          accent: '#ff00ff',
        },
        title: '',
        description: '',
        features: [],
        testimonials: [],
      })
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Failed to generate referral page. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const deletePage = (pageId) => {
    if (confirm('Are you sure you want to delete this referral page?')) {
      const updatedPages = generatedPages.filter((page) => page.id !== pageId)
      setGeneratedPages(updatedPages)
      localStorage.setItem(
        'generatedReferralPages',
        JSON.stringify(updatedPages)
      )
    }
  }

  const trackClick = (pageId) => {
    const updatedPages = generatedPages.map((page) =>
      page.id === pageId ? { ...page, clicks: (page.clicks || 0) + 1 } : page
    )
    setGeneratedPages(updatedPages)
    localStorage.setItem('generatedReferralPages', JSON.stringify(updatedPages))
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-referral-upload">
        <div className="login-container">
          <motion.div
            className="login-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Settings size={48} className="login-icon" />
            <h2>Admin Login</h2>
            <p>Enter your admin code to access the referral upload zone</p>

            <form onSubmit={handleLogin} className="login-form">
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter admin code"
                className="login-input"
                required
              />
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-referral-upload">
      <div className="admin-header">
        <h1>🚀 Admin Referral Upload Zone</h1>
        <p>
          Create high-converting referral pages with AI-powered optimization
        </p>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Site
        </button>
      </div>

      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <h2>📊 Performance Analytics</h2>
        <div className="analytics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <Eye size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                {analytics.totalClicks.toLocaleString()}
              </div>
              <div className="metric-label">Total Clicks</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <CheckCircle size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                {analytics.totalConversions.toLocaleString()}
              </div>
              <div className="metric-label">Conversions</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <DollarSign size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                ${analytics.totalRevenue.toFixed(2)}
              </div>
              <div className="metric-label">Total Revenue</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <TrendingUp size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                {analytics.totalClicks > 0
                  ? (
                      (analytics.totalConversions / analytics.totalClicks) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </div>
              <div className="metric-label">Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Form */}
      <div className="referral-form-section">
        <h2>📝 Create New Referral Page</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Referral URL *</label>
            <input
              type="url"
              value={referralData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://example.com/offer"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Discount Code</label>
            <input
              type="text"
              value={referralData.discountCode}
              onChange={(e) =>
                handleInputChange('discountCode', e.target.value)
              }
              placeholder="SAVE25"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Discount Percentage (%)</label>
            <input
              type="number"
              value={referralData.discountPercentage}
              onChange={(e) =>
                handleInputChange('discountPercentage', e.target.value)
              }
              placeholder="25"
              min="1"
              max="90"
              className="form-input"
            />
          </div>

          <div className="form-group full-width">
            <label>Context Notes</label>
            <textarea
              value={referralData.contextNotes}
              onChange={(e) =>
                handleInputChange('contextNotes', e.target.value)
              }
              placeholder="Additional context for this referral..."
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Page Title</label>
            <input
              type="text"
              value={referralData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Special Offer - Limited Time"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Page Description</label>
            <textarea
              value={referralData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the offer..."
              className="form-textarea"
              rows="3"
            />
          </div>
        </div>

        {/* Brand Colors */}
        <div className="brand-colors-section">
          <h3>🎨 Brand Colors</h3>
          <div className="color-grid">
            <div className="color-group">
              <label>Primary</label>
              <input
                type="color"
                value={referralData.brandColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="color-input"
              />
            </div>
            <div className="color-group">
              <label>Secondary</label>
              <input
                type="color"
                value={referralData.brandColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="color-input"
              />
            </div>
            <div className="color-group">
              <label>Accent</label>
              <input
                type="color"
                value={referralData.brandColors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="color-input"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            onClick={analyzeReferralUrl}
            disabled={isGenerating || !referralData.url}
            className="analyze-button"
          >
            <Eye size={20} />
            {isGenerating ? 'Analyzing...' : 'Analyze URL'}
          </button>

          <button
            onClick={generateReferralPage}
            disabled={isGenerating || !referralData.url}
            className="generate-button"
          >
            <Upload size={20} />
            {isGenerating ? 'Generating...' : 'Generate Page'}
          </button>
        </div>
      </div>

      {/* Generated Pages */}
      <div className="generated-pages-section">
        <h2>📄 Generated Referral Pages</h2>

        {generatedPages.length === 0 ? (
          <div className="no-pages">
            <AlertTriangle size={48} />
            <p>No referral pages generated yet</p>
          </div>
        ) : (
          <div className="pages-grid">
            {generatedPages.map((page) => (
              <motion.div
                key={page.id}
                className="page-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="page-header">
                  <h3>{page.title || 'Untitled Page'}</h3>
                  <div className="page-actions">
                    <button
                      onClick={() => trackClick(page.id)}
                      className="track-button"
                    >
                      <Eye size={16} />
                      Track Click
                    </button>
                    <button
                      onClick={() => deletePage(page.id)}
                      className="delete-button"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="page-stats">
                  <div className="stat">
                    <span className="stat-label">Clicks:</span>
                    <span className="stat-value">{page.clicks || 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Conversions:</span>
                    <span className="stat-value">{page.conversions || 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Revenue:</span>
                    <span className="stat-value">${page.revenue || 0}</span>
                  </div>
                </div>

                <div className="page-info">
                  <p>
                    <strong>Discount:</strong> {page.discountPercentage}%
                  </p>
                  <p>
                    <strong>Code:</strong> {page.discountCode}
                  </p>
                  <p>
                    <strong>Created:</strong>{' '}
                    {new Date(page.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>URL:</strong>
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {page.url}
                    </a>
                  </p>
                </div>

                <div className="page-links">
                  <a
                    href={`/referral/${page.id}`}
                    target="_blank"
                    className="preview-link"
                  >
                    <Eye size={16} />
                    Preview Page
                  </a>
                  <a href={page.url} target="_blank" className="original-link">
                    <Link2 size={16} />
                    Original URL
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReferralUpload
