import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Crown, Star, Check, X, Zap, Shield, Headphones } from 'lucide-react'
import StripePayment from './StripePayment'
import './SubscriptionManager.css'

const SubscriptionManager = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for individuals and small projects',
      price: { monthly: 19.99, yearly: 199.99 },
      features: [
        'AI-powered content generation',
        'Basic analytics dashboard',
        '5,000 AI tokens per month',
        'Email support',
        'Community access',
        'Basic templates',
      ],
      icon: <Zap size={24} />,
      color: '#00ff88',
      popular: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses and teams',
      price: { monthly: 49.99, yearly: 499.99 },
      features: [
        'Everything in Starter',
        'Advanced analytics & insights',
        '50,000 AI tokens per month',
        'Priority email support',
        'Advanced templates & customization',
        'API access (10,000 calls/month)',
        'Team collaboration (5 users)',
        'Custom branding',
      ],
      icon: <Star size={24} />,
      color: '#0088ff',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for large organizations',
      price: { monthly: 199.99, yearly: 1999.99 },
      features: [
        'Everything in Professional',
        'Unlimited AI tokens',
        'White-label customization',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'Unlimited team members',
        'Advanced security features',
        'SLA guarantee',
        'On-premise deployment option',
      ],
      icon: <Crown size={24} />,
      color: '#ff00ff',
      popular: false,
    },
  ]

  const addOns = [
    {
      id: 'extra-tokens',
      name: 'Extra AI Tokens',
      description: 'Additional AI generation tokens',
      price: { monthly: 9.99, yearly: 99.99 },
      unit: '10,000 tokens',
      icon: <Zap size={20} />,
    },
    {
      id: 'priority-support',
      name: 'Priority Support',
      description: '24/7 priority customer support',
      price: { monthly: 29.99, yearly: 299.99 },
      unit: 'per month',
      icon: <Headphones size={20} />,
    },
    {
      id: 'security-suite',
      name: 'Security Suite',
      description: 'Advanced security and compliance features',
      price: { monthly: 49.99, yearly: 499.99 },
      unit: 'per month',
      icon: <Shield size={20} />,
    },
  ]

  useEffect(() => {
    // Load current subscription
    const loadSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/current')
        if (response.ok) {
          const subscription = await response.json()
          setCurrentSubscription(subscription)
        }
      } catch (error) {
        console.error('Failed to load subscription:', error)
      }
    }

    loadSubscription()
  }, [])

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (_paymentResult) => {
    setLoading(true)

    // Simulate subscription activation
    setTimeout(() => {
      setCurrentSubscription({
        plan: selectedPlan.id,
        billingCycle,
        status: 'active',
        expiresAt: new Date(
          Date.now() +
            (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000
        ),
      })

      setShowPayment(false)
      setSelectedPlan(null)
      setLoading(false)

      // Show success message
      alert('Subscription activated successfully!')
    }, 2000)
  }

  const handleCancel = () => {
    setShowPayment(false)
    setSelectedPlan(null)
  }

  const formatPrice = (price, _cycle) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const getYearlySavings = (plan) => {
    const monthlyTotal = plan.price.monthly * 12
    const yearlyPrice = plan.price.yearly
    const savings = monthlyTotal - yearlyPrice
    return Math.round((savings / monthlyTotal) * 100)
  }

  const getPlanPrice = (plan) => {
    return billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly
  }

  return (
    <div className="subscription-manager">
      <div className="subscription-header">
        <h2>Choose Your Plan</h2>
        <p>Unlock premium features and accelerate your success</p>

        <div className="billing-toggle">
          <button
            className={`toggle-button ${billingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`toggle-button ${billingCycle === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly
            <span className="savings-badge">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            className={`plan-card ${plan.popular ? 'popular' : ''} ${currentSubscription?.plan === plan.id ? 'current' : ''}`}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {plan.popular && (
              <div className="popular-badge">
                <Star size={16} />
                Most Popular
              </div>
            )}

            {currentSubscription?.plan === plan.id && (
              <div className="current-badge">Current Plan</div>
            )}

            <div className="plan-header">
              <div className="plan-icon" style={{ color: plan.color }}>
                {plan.icon}
              </div>
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
            </div>

            <div className="plan-pricing">
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">
                  {
                    formatPrice(getPlanPrice(plan), billingCycle)
                      .replace('$', '')
                      .split('.')[0]
                  }
                </span>
                <span className="period">
                  /{billingCycle === 'yearly' ? 'year' : 'month'}
                </span>
              </div>

              {billingCycle === 'yearly' && (
                <div className="yearly-savings">
                  Save {getYearlySavings(plan)}% vs monthly
                </div>
              )}
            </div>

            <div className="plan-features">
              {plan.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <Check size={16} className="feature-icon" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="plan-action">
              {currentSubscription?.plan === plan.id ? (
                <button className="manage-button" disabled>
                  Current Plan
                </button>
              ) : (
                <button
                  className="select-button"
                  onClick={() => handlePlanSelect(plan)}
                  disabled={loading}
                >
                  {currentSubscription ? 'Upgrade Plan' : 'Get Started'}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add-ons Section */}
      <div className="addons-section">
        <h3>Enhance Your Plan</h3>
        <div className="addons-grid">
          {addOns.map((addon) => (
            <div key={addon.id} className="addon-card">
              <div className="addon-header">
                <div className="addon-icon">{addon.icon}</div>
                <div className="addon-info">
                  <h4>{addon.name}</h4>
                  <p>{addon.description}</p>
                </div>
              </div>

              <div className="addon-pricing">
                <span className="price">
                  {formatPrice(getPlanPrice(addon), billingCycle)}
                </span>
                <span className="unit">/{addon.unit}</span>
              </div>

              <button className="addon-button">Add to Plan</button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <motion.div
          className="payment-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="payment-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="payment-modal-header">
              <h3>Complete Your Subscription</h3>
              <button className="close-button" onClick={handleCancel}>
                <X size={20} />
              </button>
            </div>

            <div className="order-summary">
              <div className="plan-summary">
                <div className="plan-info">
                  <h4>{selectedPlan.name} Plan</h4>
                  <p>Billing: {billingCycle}</p>
                </div>
                <div className="plan-price">
                  {formatPrice(getPlanPrice(selectedPlan), billingCycle)}
                </div>
              </div>

              <div className="total">
                <span>Total</span>
                <span className="total-amount">
                  {formatPrice(getPlanPrice(selectedPlan), billingCycle)}
                </span>
              </div>
            </div>

            <StripePayment
              amount={getPlanPrice(selectedPlan)}
              onSuccess={handlePaymentSuccess}
              onCancel={handleCancel}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Current Subscription Info */}
      {currentSubscription && (
        <div className="current-subscription-info">
          <h3>Your Current Subscription</h3>
          <div className="subscription-details">
            <div className="detail-item">
              <span>Plan:</span>
              <span>
                {plans.find((p) => p.id === currentSubscription.plan)?.name}
              </span>
            </div>
            <div className="detail-item">
              <span>Status:</span>
              <span className="status-active">
                {currentSubscription.status}
              </span>
            </div>
            <div className="detail-item">
              <span>Billing:</span>
              <span>{currentSubscription.billingCycle}</span>
            </div>
            <div className="detail-item">
              <span>Expires:</span>
              <span>
                {new Date(currentSubscription.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="subscription-actions">
            <button className="manage-button">Manage Subscription</button>
            <button className="cancel-button">Cancel Subscription</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionManager
