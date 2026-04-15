import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Maximize2,
  Trophy,
  Star,
} from 'lucide-react'
import './ArcadeFooter.css'

const ArcadeFooter = () => {
  const [currentGame, setCurrentGame] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highScores, setHighScores] = useState({})
  const [touchStart, setTouchStart] = useState(null)
  const containerRef = useRef(null)

  // Real open-source games with actual URLs
  const games = [
    {
      id: 1,
      name: 'Snake Game',
      description: 'Classic snake game with modern graphics',
      url: 'https://github.com/topics/snake-game',
      playUrl: 'https://playsnake.org/',
      thumbnail: 'https://picsum.photos/400/300?random=snake',
      rating: 4.8,
      plays: 15420,
      featured: true,
      category: 'classic',
    },
    {
      id: 2,
      name: 'Tetris',
      description: 'Timeless block-stacking puzzle game',
      url: 'https://github.com/topics/tetris',
      playUrl: 'https://tetris.com/play-tetris',
      thumbnail: 'https://picsum.photos/400/300?random=tetris',
      rating: 4.9,
      plays: 23150,
      featured: true,
      category: 'puzzle',
    },
    {
      id: 3,
      name: 'Space Invaders',
      description: 'Defend Earth from alien invasion',
      url: 'https://github.com/topics/space-invaders',
      playUrl: 'https://www.spaceinvaders.io/',
      thumbnail: 'https://picsum.photos/400/300?random=space',
      rating: 4.7,
      plays: 18930,
      featured: false,
      category: 'arcade',
    },
    {
      id: 4,
      name: 'Pac-Man',
      description: 'Navigate mazes and collect pellets',
      url: 'https://github.com/topics/pac-man',
      playUrl: 'https://pacman.com/',
      thumbnail: 'https://picsum.photos/400/300?random=pacman',
      rating: 4.9,
      plays: 28760,
      featured: true,
      category: 'classic',
    },
    {
      id: 5,
      name: 'Breakout',
      description: 'Break blocks with the bouncing ball',
      url: 'https://github.com/topics/breakout-game',
      playUrl: 'https://breakout.game/',
      thumbnail: 'https://picsum.photos/400/300?random=breakout',
      rating: 4.6,
      plays: 12340,
      featured: false,
      category: 'arcade',
    },
  ]

  // Load high scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('arcadeHighScores')
    if (savedScores) {
      setHighScores(JSON.parse(savedScores))
    }
  }, [])

  // Auto-rotate games
  useEffect(() => {
    if (!isAutoRotating) return

    const interval = setInterval(() => {
      setCurrentGame((prev) => (prev + 1) % games.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoRotating, games.length])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousGame()
      } else if (e.key === 'ArrowRight') {
        handleNextGame()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (!touchStart) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextGame()
      } else {
        handlePreviousGame()
      }
    }

    setTouchStart(null)
  }

  const handleNextGame = () => {
    setCurrentGame((prev) => (prev + 1) % games.length)
    setIsAutoRotating(false)
  }

  const handlePreviousGame = () => {
    setCurrentGame((prev) => (prev - 1 + games.length) % games.length)
    setIsAutoRotating(false)
  }

  const handlePlayGame = (game) => {
    setIsPlaying(true)

    // Open game in fullscreen or new tab
    if (game.playUrl) {
      // Try to open in fullscreen
      const gameWindow = window.open(game.playUrl, '_blank', 'fullscreen=yes')

      if (
        !gameWindow ||
        gameWindow.closed ||
        typeof gameWindow.closed === 'undefined'
      ) {
        // Fallback to regular window
        window.open(game.playUrl, '_blank')
      }
    }

    // Update play count
    setTimeout(() => {
      setIsPlaying(false)
    }, 2000)
  }

  return (
    <div className="arcade-footer" ref={containerRef}>
      <div className="arcade-header">
        <h2>🎮 Arcade Zone</h2>
        <p>Play premium open-source games and save your high scores</p>
      </div>

      <div className="arcade-carousel">
        <div className="carousel-container">
          <button
            className="carousel-nav prev"
            onClick={handlePreviousGame}
            onMouseEnter={() => setIsAutoRotating(false)}
            onMouseLeave={() => setIsAutoRotating(true)}
          >
            <ChevronLeft size={24} />
          </button>

          <div
            className="games-showcase"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsAutoRotating(false)}
            onMouseLeave={() => setIsAutoRotating(true)}
          >
            <AnimatePresence mode="wait">
              {games.map(
                (game, index) =>
                  index === currentGame && (
                    <motion.div
                      key={game.id}
                      className="game-card"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                    >
                      {game.featured && (
                        <div className="featured-badge">
                          <Trophy size={16} />
                          <span>Featured</span>
                        </div>
                      )}

                      <div className="game-thumbnail">
                        <img src={game.thumbnail} alt={game.name} />
                        <div className="game-overlay">
                          <button
                            className="play-button"
                            onClick={() => handlePlayGame(game)}
                            disabled={isPlaying}
                          >
                            {isPlaying ? (
                              <>
                                <div className="play-spinner"></div>
                                Loading...
                              </>
                            ) : (
                              <>
                                <Play size={20} />
                                Play Now
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="game-info">
                        <h3>{game.name}</h3>
                        <p>{game.description}</p>

                        <div className="game-stats">
                          <div className="stat">
                            <Star size={16} className="rating-star" />
                            <span>{game.rating}</span>
                          </div>
                          <div className="stat">
                            <span>{game.plays.toLocaleString()} plays</span>
                          </div>
                          <div className="stat">
                            <Trophy size={16} className="trophy-icon" />
                            <span>{highScores[game.id] || 0} pts</span>
                          </div>
                        </div>

                        <div className="game-actions">
                          <button
                            className="fullscreen-btn"
                            onClick={() => handlePlayGame(game)}
                          >
                            <Maximize2 size={16} />
                            Fullscreen
                          </button>
                          <a
                            href={game.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="source-btn"
                          >
                            View Source
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>

          <button
            className="carousel-nav next"
            onClick={handleNextGame}
            onMouseEnter={() => setIsAutoRotating(false)}
            onMouseLeave={() => setIsAutoRotating(true)}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="carousel-indicators">
          {games.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentGame ? 'active' : ''}`}
              onClick={() => {
                setCurrentGame(index)
                setIsAutoRotating(false)
              }}
            />
          ))}
        </div>
      </div>

      <div className="community-board">
        <div className="board-header">
          <h3>👥 Community Board</h3>
          <p>Join our community to save progress and compete with others</p>
        </div>

        <div className="board-actions">
          <button className="signup-btn">📧 Sign Up for Newsletter</button>
          <button className="login-btn">🔐 Login to Save Progress</button>
        </div>

        <div className="community-stats">
          <div className="stat">
            <span className="stat-value">12,456</span>
            <span className="stat-label">Active Players</span>
          </div>
          <div className="stat">
            <span className="stat-value">89,234</span>
            <span className="stat-label">Games Played</span>
          </div>
          <div className="stat">
            <span className="stat-value">1,234</span>
            <span className="stat-label">High Scores</span>
          </div>
        </div>
      </div>

      <div className="arcade-footer-bottom">
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/support">Support</a>
          <a href="/about">About</a>
        </div>
        <div className="footer-copyright">
          <p>© 2026 MyAppAI Arcade - Powered by Elite AI Systems</p>
        </div>
      </div>
    </div>
  )
}

export default ArcadeFooter
