import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './Navigation.css'

const Navigation = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false)
const [scrolled, setScrolled] = useState(false)
const location = useLocation()

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50)
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/blog', label: 'Blog', icon: '📝' },
  { path: '/about', label: 'About', icon: '💡' },
  { path: '/contact', label: 'Contact', icon: '✉️' },
]

const isActive = (path) => {
  if (path === '/') return location.pathname === '/'
  return location.pathname.startsWith(path)
}

return (
  <motion.nav
    className={`navigation ${scrolled ? 'scrolled' : ''}`}
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="nav-container">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <motion.div
            className="brand-logo"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀
          </motion.div>
          <span className="brand-text">MyAppAI</span>
        </Link>
      </div>

      <div className="nav-menu">
        <div className="nav-links">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={item.path} className="nav-link">
                <span className="nav-label">{item.label}</span>
              </Link>
              {isActive(item.path) && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeIndicator"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="nav-actions">
        <Link to="/admin/login" className="nav-admin-btn">Admin</Link>
        <motion.button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 45, opacity: 1 }}
                exit={{ rotate: 0, opacity: 0 }}
              >
                ✕
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 0, opacity: 0 }}
              >
                ☰
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>

    {/* Mobile Menu */}
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3 }}
        >
          <div className="mobile-menu-content">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  to={item.path}
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-label">{item.label}</span>
                </Link>
              </motion.div>
            ))}
            <motion.div
              className="mobile-nav-item"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/admin/login"
                className="mobile-nav-link mobile-admin-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">⚙️</span>
                <span className="mobile-nav-label">Admin</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.nav>
)
}

export default Navigation