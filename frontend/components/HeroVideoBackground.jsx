import React, { useEffect, useRef, useState } from 'react'
import './HeroVideoBackground.css'

const HeroVideoBackground = ({ videoSrc, children, overlayOpacity = 0.6 }) => {
  const videoRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const video = videoRef.current

    if (video) {
      video.load()

      const handleCanPlay = () => {
        setIsLoaded(true)
        video.play().catch((err) => {
          console.log('Autoplay prevented, will play on user interaction')
        })
      }

      const handleError = (e) => {
        setError(e)
        console.log('Video error, falling back to animated background')
      }

      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)

      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
      }
    }
  }, [videoSrc])

  // Fallback animated gradient if video fails
  if (error) {
    return (
      <div className="hero-video-fallback">
        <div className="animated-gradient">
          <div className="gradient-layer layer-1"></div>
          <div className="gradient-layer layer-2"></div>
          <div className="gradient-layer layer-3"></div>
          <div className="floating-particles">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${15 + Math.random() * 10}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="hero-overlay" style={{ opacity: overlayOpacity }}></div>
        <div className="hero-content">{children}</div>
      </div>
    )
  }

  return (
    <div className="hero-video-container">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%23000' width='1920' height='1080'/%3E%3C/svg%3E"
      >
        <source src={videoSrc} type="video/mp4" />
        {/* Fallback sources */}
        <source
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {!isLoaded && (
        <div className="video-loading">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="hero-overlay" style={{ opacity: overlayOpacity }}></div>
      <div className="hero-content">{children}</div>
    </div>
  )
}

export default HeroVideoBackground
