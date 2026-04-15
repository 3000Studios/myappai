import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground.jsx'
import './RevenueStreams.css'

const RevenueStreams = () => {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 784.5,
    dailyGoal: 1000,
    streams: [
      {
        id: 1,
        name: 'Google AdSense',
        type: 'advertising',
        amount: 450.0,
        trend: '+12%',
        status: 'active',
        description: 'AI-optimized ad placements with real-time bidding',
        icon: '🎯',
        color: '#00ff88',
      },
      {
        id: 2,
        name: 'Premium Features',
        type: 'subscription',
        amount: 320.0,
        trend: '+8%',
        status: 'active',
        description: 'Exclusive AI tools and advanced features',
        icon: '💳',
        color: '#0088ff',
      },
      {
        id: 3,
        name: 'AI Services',
        type: 'service',
        amount: 180.0,
        trend: '+25%',
        status: 'active',
        description: 'Custom AI solutions and consulting',
        icon: '🤖',
        color: '#ff00ff',
      },
      {
        id: 4,
        name: 'Analytics Pro',
        type: 'analytics',
        amount: 50.0,
        trend: '0%',
        status: 'inactive',
        description: 'Advanced analytics and insights',
        icon: '📊',
        color: '#ffaa00',
      },
      {
        id: 5,
        name: 'App Store Sales',
        type: 'marketplace',
        amount: 125.0,
        trend: '+15%',
        status: 'active',
        description: 'AI-powered apps and templates',
        icon: '🏪',
        color: '#ff3366',
      },
      {
        id: 6,
        name: 'Affiliate Revenue',
        type: 'affiliate',
        amount: 85.0,
        trend: '+5%',
        status: 'active',
        description: 'Partner programs and referrals',
        icon: '🤝',
        color: '#00ffaa',
      },
    ],
  })

  const [transactions, _setTransactions] = useState([
    {
      id: 1,
      type: 'payment',
      source: 'Premium Subscription',
      amount: 29.99,
      method: 'Stripe',
      timestamp: new Date(Date.now() - 3600000),
      status: 'completed',
    },
    {
      id: 2,
      type: 'payment',
      source: 'AI Service',
      amount: 150.0,
      method: 'PayPal',
      timestamp: new Date(Date.now() - 7200000),
      status: 'completed',
    },
    {
      id: 3,
      type: 'revenue',
      source: 'Google AdSense',
      amount: 45.5,
      method: 'Bank Transfer',
      timestamp: new Date(Date.now() - 10800000),
      status: 'pending',
    },
  ])

  const [newStream, setNewStream] = useState({
    name: '',
    type: 'subscription',
    price: 0,
    description: '',
  })

  useEffect(() => {
    // Simulate real-time revenue updates
    const interval = setInterval(() => {
      setRevenueData((prev) => {
        const increment = Math.random() * 5
        const newTotal = Math.min(prev.totalRevenue + increment, prev.dailyGoal)
        return {
          ...prev,
          totalRevenue: newTotal,
        }
      })
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const handleAddStream = () => {
    if (newStream.name && newStream.price > 0) {
      const stream = {
        id: revenueData.streams.length + 1,
        name: newStream.name,
        type: newStream.type,
        amount: 0,
        trend: '+0%',
        status: 'pending',
        description: newStream.description,
        icon: '💰',
        color: '#00ff88',
      }

      setRevenueData((prev) => ({
        ...prev,
        streams: [...prev.streams, stream],
      }))

      setNewStream({
        name: '',
        type: 'subscription',
        price: 0,
        description: '',
      })
    }
  }

  const toggleStreamStatus = (streamId) => {
    setRevenueData((prev) => ({
      ...prev,
      streams: prev.streams.map((stream) =>
        stream.id === streamId
          ? {
              ...stream,
              status: stream.status === 'active' ? 'inactive' : 'active',
            }
          : stream
      ),
    }))
  }

  const progressPercentage =
    (revenueData.totalRevenue / revenueData.dailyGoal) * 100

  return (
    <div className="revenue-streams-container">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="revenue-header"
      >
        <h1>💰 Revenue Streams Dashboard</h1>
        <div className="revenue-overview">
          <div className="main-metric">
            <h2>${revenueData.totalRevenue.toFixed(2)}</h2>
            <p>Total Revenue Today</p>
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <span className="progress-text">
                {progressPercentage.toFixed(1)}% of ${revenueData.dailyGoal}{' '}
                goal
              </span>
            </div>
          </div>
          <div className="goal-indicator">
            <div className="goal-ring">
              <svg viewBox="0 0 36 36">
                <path
                  className="goal-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="goal-progress"
                  strokeDasharray={`${progressPercentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="goal-text">{progressPercentage.toFixed(0)}%</div>
            </div>
            <p>Daily Goal</p>
          </div>
        </div>
      </motion.div>

      <div className="revenue-content">
        <div className="streams-section">
          <h2>Active Revenue Streams</h2>
          <div className="streams-grid">
            {revenueData.streams.map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`stream-card ${stream.status}`}
                style={{ borderColor: stream.color }}
              >
                <div className="stream-header">
                  <div className="stream-icon" style={{ color: stream.color }}>
                    {stream.icon}
                  </div>
                  <div className="stream-status">
                    <div className={`status-dot ${stream.status}`} />
                    <span>{stream.status}</span>
                  </div>
                </div>
                <h3>{stream.name}</h3>
                <p className="stream-description">{stream.description}</p>
                <div className="stream-metrics">
                  <div
                    className="revenue-amount"
                    style={{ color: stream.color }}
                  >
                    ${stream.amount.toFixed(2)}
                  </div>
                  <div className="revenue-trend">{stream.trend}</div>
                </div>
                <div className="stream-actions">
                  <button
                    onClick={() => toggleStreamStatus(stream.id)}
                    className={`toggle-btn ${stream.status}`}
                  >
                    {stream.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                  <button className="configure-btn">Configure</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="add-stream-section">
          <h2>Add New Revenue Stream</h2>
          <div className="add-stream-form">
            <div className="form-group">
              <label>Stream Name</label>
              <input
                type="text"
                value={newStream.name}
                onChange={(e) =>
                  setNewStream((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., VIP Membership"
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={newStream.type}
                onChange={(e) =>
                  setNewStream((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="subscription">Subscription</option>
                <option value="one-time">One-time Payment</option>
                <option value="usage">Usage-based</option>
                <option value="commission">Commission</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                value={newStream.price}
                onChange={(e) =>
                  setNewStream((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value),
                  }))
                }
                placeholder="29.99"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newStream.description}
                onChange={(e) =>
                  setNewStream((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe your revenue stream..."
                rows={3}
              />
            </div>
            <motion.button
              onClick={handleAddStream}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="add-stream-btn"
            >
              💰 Add Revenue Stream
            </motion.button>
          </div>
        </div>

        <div className="transactions-section">
          <h2>Recent Transactions</h2>
          <div className="transactions-list">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`transaction-item ${transaction.status}`}
              >
                <div className="transaction-icon">
                  {transaction.type === 'payment' ? '💳' : '💰'}
                </div>
                <div className="transaction-details">
                  <div className="transaction-source">{transaction.source}</div>
                  <div className="transaction-method">{transaction.method}</div>
                  <div className="transaction-time">
                    {transaction.timestamp.toLocaleString()}
                  </div>
                </div>
                <div className="transaction-amount">
                  ${transaction.amount.toFixed(2)}
                </div>
                <div className={`transaction-status ${transaction.status}`}>
                  {transaction.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="revenue-insights">
        <h2>AI Revenue Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>🚀 Top Performer</h3>
            <p>Google AdSense generating 45% more revenue this week</p>
            <div className="insight-action">
              <button>Optimize Further</button>
            </div>
          </div>
          <div className="insight-card">
            <h3>📈 Growth Opportunity</h3>
            <p>Premium features could add $200/day with proper marketing</p>
            <div className="insight-action">
              <button>Launch Campaign</button>
            </div>
          </div>
          <div className="insight-card">
            <h3>⚡ Quick Win</h3>
            <p>Activate Analytics Pro to increase revenue by 15%</p>
            <div className="insight-action">
              <button>Activate Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueStreams
