import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import './StripePayment.css'

const StripePayment = ({ amount, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [cardData, setCardData] = useState({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    name: '',
    email: '',
    zip: '',
  })

  const handleInputChange = (field, value) => {
    let processedValue = value

    // Format card number
    if (field === 'number') {
      processedValue = value
        .replace(/\s/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
    }

    // Format expiry
    if (field === 'expMonth' && value.length > 2) {
      return
    }
    if (field === 'expYear' && value.length > 4) {
      return
    }

    // Format CVC
    if (field === 'cvc' && value.length > 4) {
      return
    }

    setCardData((prev) => ({
      ...prev,
      [field]: processedValue,
    }))

    // Clear error when user starts typing
    if (error) {
      setError('')
    }
  }

  const validateCard = () => {
    const errors = []

    if (!cardData.number.replace(/\s/g, '').match(/^\d{16}$/)) {
      errors.push('Valid 16-digit card number required')
    }

    if (!cardData.expMonth.match(/^(0[1-9]|1[0-2])$/)) {
      errors.push('Valid expiry month required')
    }

    if (!cardData.expYear.match(/^\d{4}$/)) {
      errors.push('Valid expiry year required')
    }

    if (!cardData.cvc.match(/^\d{3,4}$/)) {
      errors.push('Valid CVC required')
    }

    if (!cardData.name.trim()) {
      errors.push('Cardholder name required')
    }

    if (!cardData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('Valid email required')
    }

    if (!cardData.zip.match(/^\d{5}(-\d{4})?$/)) {
      errors.push('Valid ZIP code required')
    }

    // Check expiry date
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const expYear = parseInt(cardData.expYear)
    const expMonth = parseInt(cardData.expMonth)

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      errors.push('Card has expired')
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateCard()
    if (errors.length > 0) {
      setError(errors[0])
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      // Simulate Stripe payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In production, this would be actual Stripe API call
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: 'usd',
          payment_method: {
            card: {
              number: cardData.number.replace(/\s/g, ''),
              exp_month: cardData.expMonth,
              exp_year: cardData.expYear,
              cvc: cardData.cvc,
            },
            billing_details: {
              name: cardData.name,
              email: cardData.email,
              address: {
                postal_code: cardData.zip,
              },
            },
          },
        }),
      })

      if (response.ok) {
        const paymentResult = await response.json()
        onSuccess && onSuccess(paymentResult)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Payment failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError('Payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatAmount = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents)
  }

  return (
    <div className="stripe-payment">
      <div className="payment-header">
        <div className="payment-icon">
          <CreditCard size={24} />
        </div>
        <div className="payment-title">
          <h3>Secure Payment</h3>
          <p>Powered by Stripe</p>
        </div>
        <div className="payment-amount">{formatAmount(amount)}</div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="name">Cardholder Name</label>
            <input
              id="name"
              type="text"
              value={cardData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
              required
              disabled={isProcessing}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="number">Card Number</label>
            <input
              id="number"
              type="text"
              value={cardData.number}
              onChange={(e) => handleInputChange('number', e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
              disabled={isProcessing}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expMonth">Expiry Month</label>
            <input
              id="expMonth"
              type="text"
              value={cardData.expMonth}
              onChange={(e) => handleInputChange('expMonth', e.target.value)}
              placeholder="MM"
              maxLength={2}
              required
              disabled={isProcessing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expYear">Expiry Year</label>
            <input
              id="expYear"
              type="text"
              value={cardData.expYear}
              onChange={(e) => handleInputChange('expYear', e.target.value)}
              placeholder="YYYY"
              maxLength={4}
              required
              disabled={isProcessing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cvc">CVC</label>
            <input
              id="cvc"
              type="text"
              value={cardData.cvc}
              onChange={(e) => handleInputChange('cvc', e.target.value)}
              placeholder="123"
              maxLength={4}
              required
              disabled={isProcessing}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={cardData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john@example.com"
              required
              disabled={isProcessing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="zip">ZIP Code</label>
            <input
              id="zip"
              type="text"
              value={cardData.zip}
              onChange={(e) => handleInputChange('zip', e.target.value)}
              placeholder="12345"
              maxLength={10}
              required
              disabled={isProcessing}
            />
          </div>
        </div>

        {error && (
          <motion.div
            className="payment-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="payment-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={isProcessing}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-button"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="processing-spinner"></div>
                Processing...
              </>
            ) : (
              <>
                <Lock size={16} />
                Pay {formatAmount(amount)}
              </>
            )}
          </button>
        </div>
      </form>

      <div className="payment-footer">
        <div className="security-badges">
          <div className="security-badge">
            <Lock size={12} />
            <span>256-bit SSL</span>
          </div>
          <div className="security-badge">
            <CheckCircle size={12} />
            <span>PCI Compliant</span>
          </div>
        </div>

        <div className="payment-methods">
          <span>We accept:</span>
          <div className="card-icons">
            <span className="card-icon visa">VISA</span>
            <span className="card-icon mastercard">MC</span>
            <span className="card-icon amex">AMEX</span>
            <span className="card-icon discover">DISC</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StripePayment
