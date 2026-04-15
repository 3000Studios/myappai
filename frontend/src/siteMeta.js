const runtimeEnv =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined'
      ? process.env
      : {}

export const REPOSITORY_URL = 'https://github.com/3000Studios/myappai'

export const SITE_DISPLAY_NAME = 'MyAppAI'
export const SITE_LEGAL_NAME = 'MyAppAI'
export const SITE_DOMAIN = 'myappai.net'
export const SITE_URL = `https://${SITE_DOMAIN}`
export const WWW_SITE_URL = `https://www.${SITE_DOMAIN}`
export const SITE_CATEGORY =
  'AI operator platform for research, code, and deployment'
export const SITE_DEFAULT_TITLE = `${SITE_DISPLAY_NAME} | Browser-based operator platform`
export const SITE_DEFAULT_DESCRIPTION =
  'MyAppAI lets you research, plan, edit your repository, and deploy from one authenticated operator workspace.'
export const COPYRIGHT_HOLDER = SITE_LEGAL_NAME
export const SUPPORT_EMAIL = 'operator@myappai.net'
export const CONTACT_EMAIL = SUPPORT_EMAIL
export const PAYMENT_FALLBACK_LABEL = 'your configured checkout provider'
export const ADSENSE_CLIENT_ID = runtimeEnv.VITE_ADSENSE_CLIENT_ID ?? ''
export const ADS_ENABLED =
  String(runtimeEnv.VITE_ENABLE_ADS ?? 'false').toLowerCase() === 'true'

export function getCopyrightLine() {
  return `© ${new Date().getFullYear()} ${COPYRIGHT_HOLDER} · ${SITE_DOMAIN} · All rights reserved`
}
