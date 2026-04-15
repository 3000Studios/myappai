import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight } from 'lucide-react'
import './ThreeDMobileNav.css'

const ThreeDMobileNav = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    // Create audio context for warp sound
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio()
      // Create a simple warp sound using Web Audio API
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        audioContext.currentTime + 0.1
      )

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      )

      // Store the audio context for later use
      audioRef.current.context = audioContext
      audioRef.current.oscillator = oscillator
      audioRef.current.gainNode = gainNode
    }
  }, [])

  const playWarpSound = () => {
    if (audioRef.current && audioRef.current.context) {
      try {
        const audioContext = audioRef.current.context
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(
          400,
          audioContext.currentTime + 0.1
        )

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1
        )

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      } catch (error) {
        console.log('Audio play failed, continuing without sound')
      }
    }
  }

  const toggleMenu = () => {
    playWarpSound()
    setIsOpen(!isOpen)
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  // Default navigation items
  const defaultItems = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'OpenClaw', href: '/openclaw', icon: '🦞' },
    { label: 'Revenue', href: '/revenue', icon: '💰' },
    { label: 'Store', href: '/store', icon: '🛒' },
    { label: 'Games', href: '/games', icon: '🎮' },
    { label: 'Community', href: '/community', icon: '👥' },
    { label: 'Admin', href: '/admin', icon: '⚙️' },
  ]

  const navItems = items.length > 0 ? items : defaultItems

  return (
    <div className="three-d-mobile-nav">
      {/* 3D Hamburger Menu Button */}
      <motion.button
        className={`hamburger-button ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle navigation menu"
      >
        <div className="hamburger-box">
          <div className="hamburger-layer layer-1"></div>
          <div className="hamburger-layer layer-2"></div>
          <div className="hamburger-layer layer-3"></div>
        </div>
      </motion.button>

      {/* Animated Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="nav-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="nav-header">
                <div className="nav-logo">
                  <span className="logo-icon">🦞</span>
                  <span className="logo-text">MyAppAI</span>
                </div>
                <motion.button
                  className="close-button"
                  onClick={toggleMenu}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              <nav className="nav-items">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="nav-item"
                    onClick={handleLinkClick}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      },
                    }}
                    whileHover={{
                      x: 10,
                      backgroundColor: 'rgba(0, 255, 136, 0.1)',
                      borderColor: '#00ff88',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="nav-item-content">
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                      <ChevronRight className="nav-arrow" size={16} />
                    </div>

                    {/* Shimmer effect */}
                    <div className="shimmer-effect"></div>

                    {/* Letters falling into place animation */}
                    <div className="letter-animation">
                      {item.label.split('').map((letter, letterIndex) => (
                        <motion.span
                          key={letterIndex}
                          className="letter"
                          initial={{ y: -20, opacity: 0 }}
                          animate={{
                            y: 0,
                            opacity: 1,
                            transition: {
                              delay: index * 0.1 + letterIndex * 0.05,
                              type: 'spring',
                              stiffness: 400,
                              damping: 25,
                            },
                          }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>
                  </motion.a>
                ))}
              </nav>

              <div className="nav-footer">
                <div className="nav-status">
                  <div className="status-indicator online"></div>
                  <span className="status-text">System Online</span>
                </div>
                <div className="nav-version">
                  <span>v2.0.1</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Background Blur */}
      {isOpen && <div className="nav-backdrop" onClick={toggleMenu} />}
    </div>
  )
}

export default ThreeDMobileNav
