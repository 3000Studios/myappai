/**
 * Client-side analytics bridge: dataLayer (GTM), GA4 gtag, Meta Pixel, Clarity.
 * Configure via Vite env — never hardcode measurement IDs in source.
 */

function ensureDataLayer() {
  if (typeof window === 'undefined') {
    return null
  }
  window.dataLayer = window.dataLayer || []
  return window.dataLayer
}

function loadScript(src, attrs = {}) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      resolve()
      return
    }
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.async = true
    s.src = src
    Object.entries(attrs).forEach(([k, v]) => {
      s.setAttribute(k, v)
    })
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

let initialized = false

/**
 * Idempotent: safe to call on every app boot.
 */
export function initClientAnalytics() {
  if (typeof window === 'undefined' || initialized) {
    return
  }
  initialized = true

  const gtmId = import.meta.env.VITE_GTM_CONTAINER_ID
  const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID
  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID
  const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID

  if (gtmId) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    loadScript(
      `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`
    ).catch(() => {})
  }

  if (ga4Id && !gtmId) {
    loadScript(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`
    ).catch(() => {})
    window.dataLayer = window.dataLayer || []
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments)
      }
    window.gtag('js', new Date())
    window.gtag('config', ga4Id, { anonymize_ip: true })
  }

  if (metaPixelId) {
    loadScript('https://connect.facebook.net/en_US/fbevents.js')
      .then(() => {
        if (typeof window.fbq === 'function') {
          window.fbq('init', metaPixelId)
        }
      })
      .catch(() => {})
  }

  if (clarityId) {
    ;(function clarityStub(c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          ;(c[a].q = c[a].q || []).push(arguments)
        }
      t = l.createElement(r)
      t.async = 1
      t.src = `https://www.clarity.ms/tag/${i}`
      y = l.getElementsByTagName(r)[0]
      y.parentNode.insertBefore(t, y)
    })(window, document, 'clarity', 'script', clarityId)
  }
}

/**
 * Unified event mirror for GTM dataLayer + gtag event (when GA4 direct mode).
 */
export function trackClientEvent(name, params = {}) {
  const dl = ensureDataLayer()
  if (dl) {
    dl.push({
      event: name,
      ...params,
    })
  }

  if (
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    import.meta.env.VITE_GA4_MEASUREMENT_ID
  ) {
    try {
      window.gtag('event', name, params)
    } catch {
      /* ignore */
    }
  }

  if (
    typeof window !== 'undefined' &&
    typeof window.fbq === 'function' &&
    name === 'page_view'
  ) {
    try {
      window.fbq('track', 'PageView', params)
    } catch {
      /* ignore */
    }
  }
}

export function trackPageView(path) {
  trackClientEvent('page_view', {
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_title: typeof document !== 'undefined' ? document.title : '',
  })
}

/**
 * Called alongside server-side /api/public/events — keeps third-party tags in sync.
 */
export function mirrorConversionToClientAnalytics(type, details = {}) {
  trackClientEvent(type, {
    path: details.path,
    cta_id: details.ctaId,
    offer_slug: details.offerSlug,
    provider: details.provider,
    intent: details.intent,
    stage: details.stage,
  })
}
