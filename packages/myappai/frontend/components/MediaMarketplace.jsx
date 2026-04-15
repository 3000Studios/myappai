import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Download,
  Play,
  Image,
  Video,
  Music,
  X,
  Star,
  ShoppingCart,
  Filter,
  TrendingUp,
  DollarSign,
  Zap,
  Shield,
} from 'lucide-react'
import './MediaMarketplace.css'

const MediaMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [mediaType, setMediaType] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [previewMedia, setPreviewMedia] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [sortBy, setSortBy] = useState('trending')

  // Mock marketplace data
  const marketplaceData = [
    {
      id: 1,
      title: 'Abstract Gradient Pack',
      type: 'image',
      category: 'templates',
      price: 29.99,
      rating: 4.8,
      downloads: 1234,
      thumbnail: 'https://picsum.photos/400/300?random=101',
      preview: 'https://picsum.photos/800/600?random=101',
      description: 'Premium abstract gradient backgrounds for modern designs',
      features: [
        '20 High-Res Images',
        'Commercial License',
        'Instant Download',
      ],
      trending: true,
      featured: true,
    },
    {
      id: 2,
      title: 'Tech Startup Video Kit',
      type: 'video',
      category: 'templates',
      price: 49.99,
      rating: 4.9,
      downloads: 892,
      thumbnail: 'https://picsum.photos/400/300?random=102',
      preview: 'https://www.w3schools.com/html/mov_bbb.mp4',
      description: 'Professional video templates for tech startups',
      features: ['10 Video Templates', 'After Effects Files', 'Music Included'],
      trending: true,
      featured: false,
    },
    {
      id: 3,
      title: 'Corporate Music Bundle',
      type: 'music',
      category: 'audio',
      price: 39.99,
      rating: 4.7,
      downloads: 567,
      thumbnail: 'https://picsum.photos/400/300?random=103',
      preview: '#',
      description: 'Royalty-free music for corporate presentations',
      features: ['15 Tracks', 'Various Lengths', 'Commercial License'],
      trending: false,
      featured: true,
    },
    {
      id: 4,
      title: 'Social Media Templates',
      type: 'image',
      category: 'templates',
      price: 19.99,
      rating: 4.6,
      downloads: 2341,
      thumbnail: 'https://picsum.photos/400/300?random=104',
      preview: 'https://picsum.photos/800/600?random=104',
      description: 'Instagram and Facebook post templates',
      features: ['50 Templates', 'Editable PSD Files', 'Quick Start Guide'],
      trending: true,
      featured: false,
    },
    {
      id: 5,
      title: 'Product Photography Pack',
      type: 'image',
      category: 'stock',
      price: 34.99,
      rating: 4.8,
      downloads: 789,
      thumbnail: 'https://picsum.photos/400/300?random=105',
      preview: 'https://picsum.photos/800/600?random=105',
      description: 'High-quality product photography collection',
      features: ['100 Images', 'White Background', 'E-commerce Ready'],
      trending: false,
      featured: true,
    },
    {
      id: 6,
      title: 'Logo Animation Pack',
      type: 'video',
      category: 'templates',
      price: 59.99,
      rating: 4.9,
      downloads: 456,
      thumbnail: 'https://picsum.photos/400/300?random=106',
      preview: 'https://www.w3schools.com/html/mov_bbb.mp4',
      description: 'Animated logo templates for brands',
      features: ['25 Animations', 'Customizable Colors', 'HD Export'],
      trending: true,
      featured: false,
    },
  ]

  useEffect(() => {
    // Load initial marketplace data
    setSearchResults(marketplaceData)
  }, [])

  // Search and filter media
  const searchMedia = (query, type, price, sort) => {
    setIsSearching(true)

    setTimeout(() => {
      let filtered = marketplaceData

      // Filter by search query
      if (query.trim()) {
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        )
      }

      // Filter by media type
      if (type !== 'all') {
        filtered = filtered.filter((item) => item.type === type)
      }

      // Filter by price range
      if (price !== 'all') {
        const [min, max] = price.split('-').map(Number)
        filtered = filtered.filter((item) => {
          if (max) return item.price >= min && item.price <= max
          return item.price >= min
        })
      }

      // Sort results
      switch (sort) {
        case 'trending':
          filtered.sort(
            (a, b) =>
              (b.trending ? 1 : 0) - (a.trending ? 1 : 0) ||
              b.downloads - a.downloads
          )
          break
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          filtered.sort((a, b) => b.id - a.id)
          break
      }

      setSearchResults(filtered)
      setIsSearching(false)
    }, 500)
  }

  // Handle search input
  const handleSearch = (value) => {
    setSearchQuery(value)
    searchMedia(value, mediaType, priceRange, sortBy)
  }

  // Handle filters
  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'type':
        setMediaType(value)
        break
      case 'price':
        setPriceRange(value)
        break
      case 'sort':
        setSortBy(value)
        break
    }
    searchMedia(
      searchQuery,
      value || mediaType,
      value || priceRange,
      value || sortBy
    )
  }

  // Add to cart
  const addToCart = (media) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === media.id)
      if (existing) {
        return prev.map((item) =>
          item.id === media.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...media, quantity: 1 }]
    })
  }

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  // Get media icon
  const getMediaIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image size={20} />
      case 'video':
        return <Video size={20} />
      case 'music':
        return <Music size={20} />
      default:
        return <Search size={20} />
    }
  }

  // Get price badge color
  const getPriceBadgeColor = (price) => {
    if (price < 20) return 'green'
    if (price < 50) return 'blue'
    return 'purple'
  }

  return (
    <div className="media-marketplace">
      <div className="marketplace-header">
        <h1>🎬 Media Marketplace</h1>
        <p>Premium templates, stock media, and creative assets</p>

        <div className="marketplace-stats">
          <div className="stat-item">
            <TrendingUp size={20} />
            <span>{marketplaceData.length} Products</span>
          </div>
          <div className="stat-item">
            <Star size={20} />
            <span>4.8 Avg Rating</span>
          </div>
          <div className="stat-item">
            <Download size={20} />
            <span>10K+ Downloads</span>
          </div>
        </div>
      </div>

      <div className="search-controls">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search templates, stock media, audio..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="media-type-selector">
            <Filter size={16} />
            {['all', 'image', 'video', 'music'].map((type) => (
              <button
                key={type}
                className={`type-button ${mediaType === type ? 'active' : ''}`}
                onClick={() => handleFilterChange('type', type)}
              >
                {getMediaIcon(type)}
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </button>
            ))}
          </div>

          <div className="price-filter">
            <select
              value={priceRange}
              onChange={(e) => handleFilterChange('price', e.target.value)}
              className="price-select"
            >
              <option value="all">All Prices</option>
              <option value="0-20">Under $20</option>
              <option value="20-50">$20 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100">$100+</option>
            </select>
          </div>

          <div className="sort-filter">
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="sort-select"
            >
              <option value="trending">Trending</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <button
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart size={20} />
            <span className="cart-count">{cartItems.length}</span>
          </button>
        </div>
      </div>

      <div className="search-results">
        {isSearching ? (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <span>Searching marketplace...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="media-grid">
            {searchResults.map((media) => (
              <motion.div
                key={media.id}
                className={`media-card ${media.featured ? 'featured' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
              >
                {media.trending && (
                  <div className="trending-badge">
                    <TrendingUp size={12} />
                    Trending
                  </div>
                )}

                {media.featured && (
                  <div className="featured-badge">
                    <Star size={12} />
                    Featured
                  </div>
                )}

                <div
                  className="media-thumbnail"
                  onClick={() => setPreviewMedia(media)}
                >
                  {media.type === 'video' ? (
                    <div className="video-thumbnail">
                      <img src={media.thumbnail} alt={media.title} />
                      <div className="video-overlay">
                        <Play size={24} />
                      </div>
                    </div>
                  ) : (
                    <img src={media.thumbnail} alt={media.title} />
                  )}
                </div>

                <div className="media-info">
                  <div className="media-title">{media.title}</div>
                  <div className="media-description">{media.description}</div>

                  <div className="media-features">
                    {media.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="media-meta">
                    <div className="rating">
                      <Star size={14} className="star-icon" />
                      <span>{media.rating}</span>
                      <span className="downloads">
                        ({media.downloads} downloads)
                      </span>
                    </div>

                    <div
                      className={`price-badge ${getPriceBadgeColor(media.price)}`}
                    >
                      <DollarSign size={12} />
                      {media.price}
                    </div>
                  </div>
                </div>

                <div className="media-actions">
                  <button
                    className="preview-button"
                    onClick={() => setPreviewMedia(media)}
                  >
                    <Play size={16} />
                    Preview
                  </button>
                  <button
                    className="add-to-cart-button"
                    onClick={() => addToCart(media)}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="no-results">
            <Search size={48} />
            <h3>No products found</h3>
            <p>Try different keywords or filters</p>
          </div>
        ) : (
          <div className="search-prompt">
            <Search size={48} />
            <h3>Browse Premium Media</h3>
            <p>Search for templates, stock photos, videos, and music</p>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            className="cart-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
          >
            <div className="cart-header">
              <h3>Shopping Cart</h3>
              <button className="close-cart" onClick={() => setShowCart(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingCart size={48} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.title}</h4>
                      <div className="cart-item-price">
                        <DollarSign size={14} />
                        {item.price} x {item.quantity}
                      </div>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">
                    <DollarSign size={16} />
                    {cartTotal.toFixed(2)}
                  </span>
                </div>

                <button className="checkout-button">
                  <Shield size={16} />
                  Secure Checkout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewMedia && (
          <motion.div
            className="media-preview-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewMedia(null)}
          >
            <motion.div
              className="preview-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="preview-header">
                <h3>{previewMedia.title}</h3>
                <button
                  className="close-preview"
                  onClick={() => setPreviewMedia(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="preview-media">
                {previewMedia.type === 'video' ? (
                  <video controls autoPlay muted loop>
                    <source src={previewMedia.preview} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={previewMedia.preview} alt={previewMedia.title} />
                )}
              </div>

              <div className="preview-details">
                <p>{previewMedia.description}</p>

                <div className="preview-features">
                  <h4>Features:</h4>
                  <ul>
                    {previewMedia.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="preview-meta">
                  <div className="rating">
                    <Star size={16} className="star-icon" />
                    <span>{previewMedia.rating}</span>
                    <span>({previewMedia.downloads} downloads)</span>
                  </div>

                  <div
                    className={`price-badge ${getPriceBadgeColor(previewMedia.price)}`}
                  >
                    <DollarSign size={16} />
                    {previewMedia.price}
                  </div>
                </div>
              </div>

              <div className="preview-actions">
                <button
                  className="add-to-cart-button"
                  onClick={() => {
                    addToCart(previewMedia)
                    setPreviewMedia(null)
                  }}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  className="buy-now-button"
                  onClick={() => {
                    addToCart(previewMedia)
                    setPreviewMedia(null)
                    setShowCart(true)
                  }}
                >
                  <Zap size={20} />
                  Buy Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MediaMarketplace
