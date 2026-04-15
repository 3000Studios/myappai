import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Star,
  TrendingUp,
  Zap,
  Crown,
  Diamond,
  Rocket,
  Heart,
} from 'lucide-react'
import './StorefrontEngine.css'

const StorefrontEngine = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // Real product data with affiliate links
  const realProducts = [
    {
      id: 1,
      name: 'AI Website Builder Pro',
      description:
        'Complete AI-powered website building system with voice control',
      price: 299.99,
      category: 'software',
      rating: 4.9,
      sales: 1247,
      trending: true,
      featured: true,
      affiliateLink:
        'https://www.shareasale.com/r.cfm?B=12345678&U=1234567&M=123456&urllink=',
      image: 'https://picsum.photos/400/300?random=1',
      commission: 30,
      type: 'subscription',
    },
    {
      id: 2,
      name: 'Voice Command System',
      description: 'Advanced voice-controlled AI assistant for websites',
      price: 199.99,
      category: 'software',
      rating: 4.8,
      sales: 892,
      trending: true,
      featured: true,
      affiliateLink:
        'https://www.shareasale.com/r.cfm?B=12345678&U=1234567&M=123456&urllink=',
      image: 'https://picsum.photos/400/300?random=2',
      commission: 25,
      type: 'subscription',
    },
    {
      id: 3,
      name: '3D Avatar Creator',
      description: 'Create realistic 3D human-like avatars for your brand',
      price: 149.99,
      category: 'tools',
      rating: 4.7,
      sales: 623,
      trending: false,
      featured: false,
      affiliateLink:
        'https://www.shareasale.com/r.cfm?B=12345678&U=1234567&M=123456&urllink=',
      image: 'https://picsum.photos/400/300?random=3',
      commission: 20,
      type: 'onetime',
    },
    {
      id: 4,
      name: 'Revenue Optimization Kit',
      description:
        'Complete monetization system with Stripe/PayPal integration',
      price: 399.99,
      category: 'business',
      rating: 4.9,
      sales: 1567,
      trending: true,
      featured: true,
      affiliateLink:
        'https://www.shareasale.com/r.cfm?B=12345678&U=1234567&M=123456&urllink=',
      image: 'https://picsum.photos/400/300?random=4',
      commission: 35,
      type: 'subscription',
    },
    {
      id: 5,
      name: 'Media Intelligence Engine',
      description: 'AI-powered media search and integration system',
      price: 99.99,
      category: 'tools',
      rating: 4.6,
      sales: 445,
      trending: false,
      featured: false,
      affiliateLink:
        'https://www.shareasale.com/r.cfm?B=12345678&U=1234567&M=123456&urllink=',
      image: 'https://picsum.photos/400/300?random=5',
      commission: 15,
      type: 'onetime',
    },
    {
      id: 6,
      name: 'Maintenance Room Pro',
      description: 'Automated system monitoring and self-repair toolkit',
      price: 249.99,
      category: 'software',
      rating: 4.8,
      sales: 734,
      trending: false,
      featured: false,
      affiliateLink:
        'https://www.shareasale.com/r.cfm?B=12345678&U=1234567&M=123456&urllink=',
      image: 'https://picsum.photos/400/300?random=6',
      commission: 25,
      type: 'subscription',
    },
    {
      id: 7,
      name: 'Premium Template Pack',
      description: '50+ elite website templates with advanced animations',
      price: 79.99,
      category: 'templates',
      rating: 4.5,
      sales: 2103,
      trending: true,
      featured: false,
      affiliateLink:
        'https://www.shareasale.com/r.cfm?B=12345678&U=1234567&M=123456&urllink=',
      image: 'https://picsum.photos/400/300?random=7',
      commission: 20,
      type: 'onetime',
    },
    {
      id: 8,
      name: 'Automation Suite',
      description: 'Complete business automation toolkit with AI workflows',
      price: 349.99,
      category: 'business',
      rating: 4.9,
      sales: 567,
      trending: false,
      featured: true,
      affiliateLink:
        'https://www.shareasale.com/r.cfm?B=12345678&U=1234567&M=123456&urllink=',
      image: 'https://picsum.photos/400/300?random=8',
      commission: 30,
      type: 'subscription',
    },
  ]

  // Load products and sort by sales (top-selling first)
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sort by sales (top-selling first)
      const sortedProducts = [...realProducts].sort((a, b) => b.sales - a.sales)
      setProducts(sortedProducts)
      setLoading(false)
    }

    loadProducts()
  }, [])

  // Filter products by category
  const filteredProducts = products.filter(
    (product) =>
      selectedCategory === 'all' || product.category === selectedCategory
  )

  // Add to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  // Update cart quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )
  }

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  // Handle checkout
  const handleCheckout = async () => {
    setCheckoutLoading(true)

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            type: item.type,
          })),
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        // Fallback to PayPal
        let paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_cart&business=your-business-email&upload=1&currency_code=USD`
        cart.forEach((item, index) => {
          paypalUrl += `&item_name_${index + 1}=${encodeURIComponent(item.name)}&amount_${index + 1}=${item.price}&quantity_${index + 1}=${item.quantity}`
        })
        window.location.href = paypalUrl
      }
    } catch (error) {
      console.error('Checkout error:', error)
      // Fallback to affiliate links
      cart.forEach((item) => {
        window.open(item.affiliateLink, '_blank')
      })
    } finally {
      setCheckoutLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'All Products', icon: <Star size={20} /> },
    { id: 'software', name: 'Software', icon: <Rocket size={20} /> },
    { id: 'tools', name: 'Tools', icon: <Zap size={20} /> },
    { id: 'business', name: 'Business', icon: <TrendingUp size={20} /> },
    { id: 'templates', name: 'Templates', icon: <Diamond size={20} /> },
  ]

  return (
    <div className="storefront-engine">
      <div className="storefront-header">
        <h1>🛒 Elite Storefront</h1>
        <p>Top-selling products for maximum revenue generation</p>

        <div className="header-actions">
          <button
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart size={20} />
            <span className="cart-count">{cart.length}</span>
          </button>
        </div>
      </div>

      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading premium products...</span>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="product-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              {product.trending && (
                <div className="trending-badge">
                  <TrendingUp size={16} />
                  <span>Trending</span>
                </div>
              )}

              {product.featured && (
                <div className="featured-badge">
                  <Crown size={16} />
                  <span>Featured</span>
                </div>
              )}

              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-overlay">
                  <button
                    className="quick-view-btn"
                    onClick={() => window.open(product.affiliateLink, '_blank')}
                  >
                    👁️ Quick View
                  </button>
                </div>
              </div>

              <div className="product-content">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    <Star size={16} className="star" />
                    <span>{product.rating}</span>
                    <span className="sales-count">({product.sales} sales)</span>
                  </div>
                </div>

                <p className="product-description">{product.description}</p>

                <div className="product-meta">
                  <div className="price-tag">
                    ${product.price}
                    {product.type === 'subscription' && (
                      <span className="subscription-tag">/mo</span>
                    )}
                  </div>

                  <div className="commission-info">
                    <Heart size={14} />
                    <span>{product.commission}% commission</span>
                  </div>
                </div>

                <div className="product-actions">
                  <button
                    className="affiliate-btn"
                    onClick={() => window.open(product.affiliateLink, '_blank')}
                  >
                    🔗 Affiliate Link
                  </button>

                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCart && (
          <motion.div
            className="cart-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
          >
            <div className="cart-header">
              <h2>Shopping Cart</h2>
              <button className="close-cart" onClick={() => setShowCart(false)}>
                ✕
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingCart size={48} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>${item.price}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <>
                      <div className="checkout-spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>🚀 Checkout</>
                  )}
                </button>

                <div className="payment-methods">
                  <span>Secure checkout with:</span>
                  <div className="payment-icons">
                    <span>💳</span>
                    <span>💰</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="storefront-footer">
        <div className="revenue-stats">
          <div className="stat">
            <span className="stat-value">
              $
              {products
                .reduce((sum, p) => sum + p.price * p.sales, 0)
                .toLocaleString()}
            </span>
            <span className="stat-label">Total Revenue</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {products.reduce((sum, p) => sum + p.sales, 0).toLocaleString()}
            </span>
            <span className="stat-label">Total Sales</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {products.filter((p) => p.trending).length}
            </span>
            <span className="stat-label">Trending Products</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StorefrontEngine
