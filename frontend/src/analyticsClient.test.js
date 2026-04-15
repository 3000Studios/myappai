import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  mirrorConversionToClientAnalytics,
  trackClientEvent,
} from './analyticsClient.js'

describe('analyticsClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete window.dataLayer
    delete window.gtag
    delete window.fbq
  })

  it('pushes structured events to dataLayer', () => {
    const push = vi.fn()
    vi.stubGlobal('window', { dataLayer: { push } })

    trackClientEvent('cta_click', { label: 'pricing' })

    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'cta_click',
        label: 'pricing',
      })
    )
  })

  it('mirrors conversion payloads without throwing', () => {
    vi.stubGlobal('window', { dataLayer: { push: vi.fn() } })

    expect(() =>
      mirrorConversionToClientAnalytics('checkout_started', {
        path: '/checkout',
        offerSlug: 'launch-sprint',
      })
    ).not.toThrow()
  })
})
