import { describe, expect, it } from 'vitest'
import { SITE_DOMAIN, SITE_DISPLAY_NAME, SITE_URL } from './siteMeta.js'

describe('site meta', () => {
  it('uses the MyAppAI public brand', () => {
    expect(SITE_DISPLAY_NAME).toBe('MyAppAI')
    expect(SITE_DOMAIN).toBe('myappai.net')
    expect(SITE_URL).toBe('https://myappai.net')
  })
})
