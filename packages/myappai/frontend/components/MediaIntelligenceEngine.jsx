import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, Play, Image, Video, Music, X } from 'lucide-react'
import './MediaIntelligenceEngine.css'

const MediaIntelligenceEngine = ({ onMediaSelect }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [mediaType, setMediaType] = useState('all')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [previewMedia, setPreviewMedia] = useState(null)
  const [apiSource, setApiSource] = useState('pexels')

  const searchTimeoutRef = useRef(null)

  // API Keys (these should be stored in environment variables)
  const API_KEYS = {
    pexels: process.env.VITE_PEXELS_API_KEY || 'demo',
    pixabay: process.env.VITE_PIXABAY_API_KEY || 'demo',
  }

  // Search media from APIs
  const searchMedia = async (query, type, source) => {
    setIsSearching(true)

    try {
      let results = []

      if (source === 'pexels') {
        results = await searchPexels(query, type)
      } else if (source === 'pixabay') {
        results = await searchPixabay(query, type)
      }

      setSearchResults(results)
    } catch (error) {
      console.error('Media search failed:', error)
      // Fallback to demo data
      setSearchResults(getDemoMedia(query, type))
    } finally {
      setIsSearching(false)
    }
  }

  // Search Pexels API
  const searchPexels = async (query, type) => {
    const apiKey = API_KEYS.pexels
    if (!apiKey || apiKey === 'demo') {
      return getDemoMedia(query, type)
    }

    let url = 'https://api.pexels.com/v1/search'
    const params = new URLSearchParams({
      query: query || 'nature',
      per_page: 20,
      orientation: 'all',
    })

    if (type === 'videos') {
      url = 'https://api.pexels.com/videos/search'
    }

    const response = await fetch(`${url}?${params}`, {
      headers: {
        Authorization: apiKey,
      },
    })

    if (!response.ok) {
      throw new Error('Pexels API error')
    }

    const data = await response.json()

    if (type === 'videos') {
      return data.videos.map((video) => ({
        id: video.id,
        type: 'video',
        url: video.video_files[0]?.link || '',
        thumbnail: video.image,
        title: `Video ${video.id}`,
        source: 'pexels',
        duration: video.duration,
      }))
    } else {
      return data.photos.map((photo) => ({
        id: photo.id,
        type: 'image',
        url: photo.src.large,
        thumbnail: photo.src.medium,
        title: `Photo ${photo.id}`,
        source: 'pexels',
        width: photo.width,
        height: photo.height,
      }))
    }
  }

  // Search Pixabay API
  const searchPixabay = async (query, type) => {
    const apiKey = API_KEYS.pixabay
    if (!apiKey || apiKey === 'demo') {
      return getDemoMedia(query, type)
    }

    let url = 'https://pixabay.com/api/'
    const params = new URLSearchParams({
      key: apiKey,
      q: query || 'nature',
      per_page: 20,
      safesearch: true,
    })

    if (type === 'videos') {
      url = 'https://pixabay.com/api/videos/'
    }

    const response = await fetch(`${url}?${params}`)

    if (!response.ok) {
      throw new Error('Pixabay API error')
    }

    const data = await response.json()

    if (type === 'videos') {
      return data.hits.map((video) => ({
        id: video.id,
        type: 'video',
        url: video.videos?.medium?.url || video.videos?.small?.url || '',
        thumbnail: video.thumbnail,
        title: video.tags || `Video ${video.id}`,
        source: 'pixabay',
        duration: video.duration,
      }))
    } else {
      return data.hits.map((photo) => ({
        id: photo.id,
        type: 'image',
        url: photo.webformatURL,
        thumbnail: photo.previewURL,
        title: photo.tags || `Photo ${photo.id}`,
        source: 'pixabay',
        width: photo.imageWidth,
        height: photo.imageHeight,
      }))
    }
  }

  // Demo media data for fallback
  const getDemoMedia = (query, type) => {
    const demoImages = [
      {
        id: 1,
        type: 'image',
        url: 'https://picsum.photos/800/600?random=1',
        thumbnail: 'https://picsum.photos/400/300?random=1',
        title: 'Beautiful Landscape',
        source: 'demo',
        width: 800,
        height: 600,
      },
      {
        id: 2,
        type: 'image',
        url: 'https://picsum.photos/800/600?random=2',
        thumbnail: 'https://picsum.photos/400/300?random=2',
        title: 'Abstract Art',
        source: 'demo',
        width: 800,
        height: 600,
      },
      {
        id: 3,
        type: 'video',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://picsum.photos/400/300?random=3',
        title: 'Demo Video',
        source: 'demo',
        duration: 10,
      },
    ]

    return demoImages.filter((item) => type === 'all' || item.type === type)
  }

  // Handle search input
  const handleSearch = (value) => {
    setSearchQuery(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        searchMedia(value, mediaType, apiSource)
      }
    }, 500)
  }

  // Handle media selection
  const handleMediaSelect = (media) => {
    setSelectedMedia(media)
    if (onMediaSelect) {
      onMediaSelect(media)
    }
  }

  // Handle media preview
  const handlePreviewMedia = (media) => {
    setPreviewMedia(media)
  }

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

  return (
    <div className="media-intelligence-engine">
      <div className="engine-header">
        <h2>🎬 Media Intelligence Engine</h2>
        <p>Search and integrate premium media from Pexels & Pixabay</p>
      </div>

      <div className="search-controls">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search for images, videos, music..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="media-type-selector">
            {['all', 'image', 'video', 'music'].map((type) => (
              <button
                key={type}
                className={`type-button ${mediaType === type ? 'active' : ''}`}
                onClick={() => setMediaType(type)}
              >
                {getMediaIcon(type)}
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </button>
            ))}
          </div>

          <div className="api-selector">
            <select
              value={apiSource}
              onChange={(e) => setApiSource(e.target.value)}
              className="api-select"
            >
              <option value="pexels">Pexels</option>
              <option value="pixabay">Pixabay</option>
            </select>
          </div>
        </div>
      </div>

      <div className="search-results">
        {isSearching ? (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <span>Searching premium media...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="media-grid">
            {searchResults.map((media) => (
              <motion.div
                key={media.id}
                className="media-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleMediaSelect(media)}
              >
                <div className="media-thumbnail">
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
                  <div className="media-meta">
                    <span className="media-source">{media.source}</span>
                    {media.duration && (
                      <span className="media-duration">{media.duration}s</span>
                    )}
                    {media.width && media.height && (
                      <span className="media-resolution">
                        {media.width}×{media.height}
                      </span>
                    )}
                  </div>
                </div>

                <div className="media-actions">
                  <button
                    className="preview-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePreviewMedia(media)
                    }}
                  >
                    <Play size={16} />
                  </button>
                  <button
                    className="download-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(media.url, '_blank')
                    }}
                  >
                    <Download size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="no-results">
            <Search size={48} />
            <h3>No media found</h3>
            <p>Try different keywords or filters</p>
          </div>
        ) : (
          <div className="search-prompt">
            <Search size={48} />
            <h3>Search for premium media</h3>
            <p>Enter keywords to find images, videos, and music</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className="selected-media-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="selected-media-content">
              <h4>Selected Media</h4>
              <div className="selected-media-item">
                {getMediaIcon(selectedMedia.type)}
                <span>{selectedMedia.title}</span>
                <button
                  className="remove-button"
                  onClick={() => setSelectedMedia(null)}
                >
                  <X size={16} />
                </button>
              </div>
              <button
                className="integrate-button"
                onClick={() => {
                  // Integrate media into website
                  console.log('Integrating media:', selectedMedia)
                }}
              >
                🚀 Integrate into Website
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    <source src={previewMedia.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={previewMedia.url} alt={previewMedia.title} />
                )}
              </div>

              <div className="preview-actions">
                <button
                  className="use-media-button"
                  onClick={() => {
                    handleMediaSelect(previewMedia)
                    setPreviewMedia(null)
                  }}
                >
                  ✅ Use This Media
                </button>
                <button
                  className="download-media-button"
                  onClick={() => window.open(previewMedia.url, '_blank')}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MediaIntelligenceEngine
