import React, { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown, ExternalLink, Clock } from 'lucide-react'
import './GlobalTicker.css'

const GlobalTicker = () => {
  const [cryptoData, setCryptoData] = useState([])
  const [newsData, setNewsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const cryptoScrollRef = useRef(null)
  const newsScrollRef = useRef(null)

  // Fetch real crypto data
  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=10&page=1'
      )
      const data = await response.json()

      const formattedCrypto = data.map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change: coin.price_change_percentage_24h,
        volume: coin.total_volume,
        marketCap: coin.market_cap,
        image: coin.image,
      }))

      setCryptoData(formattedCrypto)
    } catch (error) {
      console.error('Crypto API error:', error)
      // Fallback data
      setCryptoData([
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'BTC',
          price: 45234.5,
          change: 2.34,
          volume: 28900000000,
          marketCap: 882000000000,
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          price: 3124.78,
          change: -1.23,
          volume: 15600000000,
          marketCap: 375000000000,
        },
        {
          id: 'binance',
          name: 'Binance',
          symbol: 'BNB',
          price: 423.45,
          change: 3.67,
          volume: 1230000000,
          marketCap: 65000000000,
        },
      ])
    }
  }

  // Fetch real news data
  const fetchNewsData = async () => {
    try {
      const response = await fetch(
        'https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_NEWS_API_KEY&pageSize=10'
      )
      const data = await response.json()

      const formattedNews = data.articles.map((article, index) => ({
        id: index,
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
        image: article.urlToImage,
      }))

      setNewsData(formattedNews)
    } catch (error) {
      console.error('News API error:', error)
      // Fallback data
      setNewsData([
        {
          id: 1,
          title: 'AI Technology Revolutionizes Digital Marketing',
          description: 'New AI tools transform how businesses reach customers',
          url: 'https://techcrunch.com',
          source: 'TechCrunch',
          publishedAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Cryptocurrency Market Shows Strong Recovery',
          description:
            'Major cryptocurrencies surge as institutional adoption increases',
          url: 'https://coindesk.com',
          source: 'CoinDesk',
          publishedAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: 'E-commerce Sales Hit Record Highs',
          description:
            'Online shopping continues to dominate retail sector growth',
          url: 'https://retaildive.com',
          source: 'Retail Dive',
          publishedAt: new Date().toISOString(),
        },
      ])
    }
  }

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)
      await Promise.all([fetchCryptoData(), fetchNewsData()])
      setIsLoading(false)
    }

    initializeData()

    // Update data every 30 seconds
    const interval = setInterval(() => {
      fetchCryptoData()
      fetchNewsData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Auto-scroll animation
  useEffect(() => {
    if (isPaused || isLoading) return

    const cryptoScroll = cryptoScrollRef.current
    const newsScroll = newsScrollRef.current

    if (!cryptoScroll || !newsScroll) return

    const scrollCrypto = () => {
      if (cryptoScroll.scrollLeft >= cryptoScroll.scrollWidth / 2) {
        cryptoScroll.scrollLeft = 0
      } else {
        cryptoScroll.scrollLeft += 1
      }
    }

    const scrollNews = () => {
      if (newsScroll.scrollLeft >= newsScroll.scrollWidth / 2) {
        newsScroll.scrollLeft = 0
      } else {
        newsScroll.scrollLeft += 1
      }
    }

    const cryptoInterval = setInterval(scrollCrypto, 30)
    const newsInterval = setInterval(scrollNews, 40)

    return () => {
      clearInterval(cryptoInterval)
      clearInterval(newsInterval)
    }
  }, [isPaused, isLoading])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price)
  }

  const formatChange = (change) => {
    const isPositive = change >= 0
    return (
      <span className={`crypto-change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(change).toFixed(2)}%
      </span>
    )
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="global-ticker loading">
        <div className="ticker-loading">
          <div className="loading-spinner"></div>
          <span>Loading live data...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="global-ticker"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Crypto Ticker */}
      <div className="ticker-line crypto-ticker">
        <div className="ticker-label">
          <TrendingUp size={16} />
          <span>Top Crypto Movers</span>
        </div>
        <div className="ticker-content" ref={cryptoScrollRef}>
          {/* Duplicate content for seamless loop */}
          {[...cryptoData, ...cryptoData].map((coin, index) => (
            <div
              key={`${coin.id}-${index}`}
              className="ticker-item crypto-item"
              onClick={() =>
                window.open(
                  `https://www.coingecko.com/en/coins/${coin.id}`,
                  '_blank'
                )
              }
            >
              <img src={coin.image} alt={coin.name} className="crypto-logo" />
              <span className="crypto-name">{coin.name}</span>
              <span className="crypto-price">{formatPrice(coin.price)}</span>
              {formatChange(coin.change)}
              <span className="crypto-volume">
                Vol: {(coin.volume / 1000000).toFixed(1)}M
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* News Ticker */}
      <div className="ticker-line news-ticker">
        <div className="ticker-label">
          <Clock size={16} />
          <span>Top News Headlines Today</span>
        </div>
        <div className="ticker-content" ref={newsScrollRef}>
          {/* Duplicate content for seamless loop */}
          {[...newsData, ...newsData].map((article, index) => (
            <div
              key={`${article.id}-${index}`}
              className="ticker-item news-item"
              onClick={() => window.open(article.url, '_blank')}
            >
              <span className="news-source">{article.source}</span>
              <span className="news-title">{article.title}</span>
              <span className="news-time">
                {formatTime(article.publishedAt)}
              </span>
              <ExternalLink size={12} className="news-link-icon" />
            </div>
          ))}
        </div>
      </div>

      {/* Pause Indicator */}
      {isPaused && (
        <div className="pause-indicator">
          <span>⏸️ Paused</span>
        </div>
      )}
    </div>
  )
}

export default GlobalTicker
