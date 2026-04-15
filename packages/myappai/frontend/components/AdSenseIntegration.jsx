import React, { useEffect, useState } from 'react'
import './AdSenseIntegration.css'

const AdSenseIntegration = () => {
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)

  useEffect(() => {
    // Load AdSense script
    const script = document.createElement('script')
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    script.async = true
    script.crossOrigin = 'anonymous'

    script.onload = () => {
      setAdLoaded(true)
      console.log('AdSense script loaded successfully')
    }

    script.onerror = () => {
      setAdError(true)
      console.error('Failed to load AdSense script')
    }

    document.head.appendChild(script)

    // Initialize AdSense
    ;(window.adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: 'ca-pub-YOUR-PUBLISHER-ID',
      enable_page_level_ads: true,
    })

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const AdUnit = ({ slot, format = 'auto', responsive = true }) => {
    if (!adLoaded || adError) return null

    return (
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR-PUBLISHER-ID"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    )
  }

  return (
    <div className="adsense-integration">
      {/* Header Banner */}
      <div className="ad-container header-ad">
        <AdUnit slot="1234567890" format="horizontal" responsive={true} />
      </div>

      {/* Sidebar Banner */}
      <div className="ad-container sidebar-ad">
        <AdUnit slot="0987654321" format="vertical" responsive={false} />
      </div>

      {/* Content Banner */}
      <div className="ad-container content-ad">
        <AdUnit slot="5678901234" format="rectangle" responsive={true} />
      </div>

      {/* Footer Banner */}
      <div className="ad-container footer-ad">
        <AdUnit slot="3456789012" format="horizontal" responsive={true} />
      </div>

      {adError && (
        <div className="ad-error">
          <p>Advertisement temporarily unavailable</p>
        </div>
      )}
    </div>
  )
}

export default AdSenseIntegration
