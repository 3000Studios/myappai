import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './RevenueOptimizer.css'

const RevenueOptimizer = () => {
  const [revenue, setRevenue] = useState({
    daily: 784.5,
    goal: 1000,
    streams: {
      adsense: { amount: 450, trend: '+12%', status: 'active' },
      premium: { amount: 320, trend: '+8%', status: 'active' },
      ai_services: { amount: 180, trend: '+25%', status: 'active' },
      analytics: { amount: 50, trend: '0%', status: 'inactive' },
    },
  })

  const [isOptimizing, setIsOptimizing] = useState(false)
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      name: 'Dynamic Ad Placement',
      status: 'active',
      revenue: '+$45/day',
      description: 'AI-powered ad positioning',
    },
    {
      id: 2,
      name: 'Premium Content Gates',
      status: 'pending',
      revenue: '+$120/day',
      description: 'Paywall for premium content',
    },
    {
      id: 3,
      name: 'AI Service Upsells',
      status: 'active',
      revenue: '+$80/day',
      description: 'Cross-sell AI features',
    },
    {
      id: 4,
      name: 'Analytics Pro Tier',
      status: 'inactive',
      revenue: '+$200/day',
      description: 'Advanced analytics subscription',
    },
  ])

  useEffect(() => {
    // Simulate real-time revenue updates
    const interval = setInterval(() => {
      setRevenue((prev) => {
        const increment = Math.random() * 2
        const newDaily = Math.min(prev.daily + increment, prev.goal)
        return { ...prev, daily: newDaily }
      })
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const runOptimization = async () => {
    setIsOptimizing(true)

    // Simulate optimization process
    setTimeout(() => {
      setRevenue((prev) => ({
        ...prev,
        daily: Math.min(prev.daily + Math.random() * 50, prev.goal),
        streams: {
          ...prev.streams,
          adsense: {
            ...prev.streams.adsense,
            amount: prev.streams.adsense.amount + Math.random() * 20,
          },
          ai_services: {
            ...prev.streams.ai_services,
            amount: prev.streams.ai_services.amount + Math.random() * 15,
          },
        },
      }))

      setStrategies((prev) =>
        prev.map((strategy) =>
          Math.random() > 0.5
            ? {
                ...strategy,
                status:
                  strategy.status === 'inactive' ? 'active' : strategy.status,
              }
            : strategy
        )
      )

      setIsOptimizing(false)
    }, 3000)
  }

  const activateStrategy = (strategyId) => {
    setStrategies((prev) =>
      prev.map((strategy) =>
        strategy.id === strategyId
          ? { ...strategy, status: 'active' }
          : strategy
      )
    )
  }

  const progressPercentage = (revenue.daily / revenue.goal) * 100

  return (
    <div className="revenue-optimizer">
      <div className="revenue-header">
        <h2>🚀 Revenue Optimization Center</h2>
        <div className="revenue-metrics">
          <div className="primary-metric">
            <h3>${revenue.daily.toFixed(2)}</h3>
            <p>Today's Revenue</p>
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="progress-text">
                {progressPercentage.toFixed(1)}% of $1,000 goal
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="revenue-streams">
        <h3>Revenue Streams</h3>
        <div className="streams-grid">
          {Object.entries(revenue.streams).map(([key, stream]) => (
            <motion.div
              key={key}
              className={`stream-card ${stream.status}`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="stream-header">
                <h4>
                  {key === 'adsense' && '🎯 Google AdSense'}
                  {key === 'premium' && '💳 Premium Features'}
                  {key === 'ai_services' && '🤖 AI Services'}
                  {key === 'analytics' && '📊 Analytics Pro'}
                </h4>
                <span className={`status-indicator ${stream.status}`} />
              </div>
              <div className="stream-amount">${stream.amount.toFixed(2)}</div>
              <div className="stream-trend">{stream.trend}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="optimization-strategies">
        <h3>Revenue Strategies</h3>
        <div className="strategies-list">
          {strategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              className={`strategy-card ${strategy.status}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="strategy-info">
                <h4>{strategy.name}</h4>
                <p>{strategy.description}</p>
                <div className="strategy-revenue">{strategy.revenue}</div>
              </div>
              <div className="strategy-actions">
                <span className={`strategy-status ${strategy.status}`}>
                  {strategy.status}
                </span>
                {strategy.status !== 'active' && (
                  <motion.button
                    onClick={() => activateStrategy(strategy.id)}
                    className="activate-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Activate
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="optimization-controls">
        <motion.button
          onClick={runOptimization}
          disabled={isOptimizing}
          className={`optimize-button ${isOptimizing ? 'optimizing' : ''}`}
          whileHover={{ scale: isOptimizing ? 1 : 1.05 }}
          whileTap={{ scale: isOptimizing ? 1 : 0.95 }}
        >
          {isOptimizing ? (
            <>
              <div className="spinner" />
              Optimizing Revenue...
            </>
          ) : (
            '🚀 Run Revenue Optimization'
          )}
        </motion.button>
      </div>

      <div className="revenue-insights">
        <h3>AI Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Peak Hours</h4>
            <p>2PM - 6PM shows 45% higher conversion rates</p>
          </div>
          <div className="insight-card">
            <h4>Top Performer</h4>
            <p>AI Services generating 25% more revenue this week</p>
          </div>
          <div className="insight-card">
            <h4>Growth Opportunity</h4>
            <p>Premium content gates could add $200/day</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueOptimizer
