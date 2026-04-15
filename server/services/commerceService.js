import Stripe from 'stripe'
import {
  getContentBundle,
  readSystemDocument,
  writeSystemDocument,
} from './contentService.js'
import { SITE_DISPLAY_NAME } from '../../frontend/src/siteMeta.js'

const DEFAULT_PAYMENTS = {
  payments: [],
  updatedAt: null,
}
const DEFAULT_PAYPAL_EMAIL = ''

function nowIso() {
  return new Date().toISOString()
}

function slugToEnvSuffix(slug) {
  return String(slug)
    .replace(/[^a-z0-9]+/gi, '_')
    .toUpperCase()
}

function parseAmountToCents(value) {
  if (!value) {
    return null
  }

  const normalized = Number.parseFloat(String(value).replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(normalized) || normalized <= 0) {
    return null
  }

  return Math.round(normalized * 100)
}

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || secretKey.startsWith('replace-with-')) {
    return null
  }

  return new Stripe(secretKey)
}

function getPayPalBaseUrl() {
  return process.env.PAYPAL_ENV === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'
}

function hasPayPalCredentials() {
  return Boolean(
    process.env.PAYPAL_CLIENT_ID &&
    process.env.PAYPAL_CLIENT_SECRET &&
    !process.env.PAYPAL_CLIENT_ID.startsWith('replace-with-') &&
    !process.env.PAYPAL_CLIENT_SECRET.startsWith('replace-with-')
  )
}

function getPayPalBusinessEmail() {
  const email = String(process.env.PAYPAL_EMAIL ?? DEFAULT_PAYPAL_EMAIL).trim()
  return email.includes('@') ? email : ''
}

async function getProductMap() {
  const bundle = await getContentBundle()
  return Object.fromEntries(
    bundle.products
      .filter((entry) => entry.data?.slug)
      .map((entry) => [entry.data.slug, entry.data])
  )
}

async function getProduct(slug) {
  const productLookup = await getProductMap()
  const product = productLookup[slug]

  if (!product) {
    throw new Error(`Unknown product "${slug}".`)
  }

  return product
}

function getStripeConfig(slug, product) {
  const suffix = slugToEnvSuffix(slug)
  const paymentLink = process.env[`STRIPE_PAYMENT_LINK_${suffix}`]
  const priceId = process.env[`STRIPE_PRICE_${suffix}`]
  const mode =
    process.env[`STRIPE_MODE_${suffix}`] ??
    (/month|mo/i.test(product.priceAnchor ?? '') ? 'subscription' : 'payment')

  return {
    paymentLink,
    priceId,
    mode,
  }
}

function getPayPalConfig(slug, product = {}) {
  const suffix = slugToEnvSuffix(slug)
  const amountCents =
    parseAmountToCents(process.env[`PAYPAL_PRICE_${suffix}_USD`]) ??
    parseAmountToCents(product.priceAnchor)

  return {
    amountCents,
    businessEmail: getPayPalBusinessEmail(),
  }
}

async function readPayments() {
  return readSystemDocument('payments.json', DEFAULT_PAYMENTS)
}

async function writePayments(payload) {
  await writeSystemDocument('payments.json', {
    ...payload,
    updatedAt: nowIso(),
  })
}

export async function recordPayment(payment) {
  const ledger = await readPayments()
  const payments = ledger.payments ?? []
  const transactionKey = `${payment.provider}:${payment.transactionId}`
  const existingIndex = payments.findIndex(
    (entry) => `${entry.provider}:${entry.transactionId}` === transactionKey
  )

  const nextPayment = {
    ...payment,
    recordedAt:
      existingIndex >= 0 ? payments[existingIndex].recordedAt : nowIso(),
  }

  if (existingIndex >= 0) {
    payments[existingIndex] = {
      ...payments[existingIndex],
      ...nextPayment,
    }
  } else {
    payments.unshift(nextPayment)
  }

  await writePayments({
    payments,
  })

  return nextPayment
}

export async function getPaymentsSnapshot() {
  const ledger = await readPayments()
  return ledger.payments ?? []
}

export async function getCommerceSnapshot() {
  const payments = await getPaymentsSnapshot()
  const completedPayments = payments.filter(
    (entry) => entry.status === 'completed'
  )
  const totalRevenueCents = completedPayments.reduce(
    (sum, entry) => sum + (entry.amountCents ?? 0),
    0
  )
  const stripeClient = getStripeClient()
  const productLookup = await getProductMap()

  const offers = Object.values(productLookup).map((product) => {
    const stripeConfig = getStripeConfig(product.slug, product)
    const paypalConfig = getPayPalConfig(product.slug, product)
    const closeMode =
      product.closeMode ??
      (product.slug === 'operator-os'
        ? 'checkout'
        : product.slug === 'launch-sprint'
          ? 'lead'
          : 'qualification')

    return {
      slug: product.slug,
      name: product.name,
      headline: product.headline ?? product.name,
      summary: product.description ?? product.summary ?? '',
      priceAnchor: product.priceAnchor ?? 'Custom',
      idealFor: product.idealFor ?? null,
      closeMode,
      contactOnly: product.slug === 'enterprise-deployment',
      primaryCtaLabel:
        closeMode === 'checkout'
          ? 'Start checkout'
          : closeMode === 'lead'
            ? 'Start implementation brief'
            : 'Start qualification',
      primaryCtaHref:
        closeMode === 'checkout'
          ? `/products/${product.slug}`
          : closeMode === 'lead'
            ? `/products/${product.slug}`
            : '/contact',
      providers: {
        stripe: Boolean(
          stripeConfig.paymentLink || (stripeClient && stripeConfig.priceId)
        ),
        paypal: Boolean(
          (hasPayPalCredentials() || paypalConfig.businessEmail) &&
          paypalConfig.amountCents
        ),
      },
    }
  })

  return {
    offers,
    payments: {
      count: completedPayments.length,
      revenue: totalRevenueCents / 100,
    },
    providers: {
      stripe: Boolean(stripeClient),
      paypal: Boolean(hasPayPalCredentials() || getPayPalBusinessEmail()),
    },
    updatedAt: nowIso(),
  }
}

export async function createStripeCheckout({ slug, origin }) {
  const product = await getProduct(slug)
  const stripeConfig = getStripeConfig(slug, product)

  if (stripeConfig.paymentLink) {
    return { url: stripeConfig.paymentLink, provider: 'stripe' }
  }

  const stripe = getStripeClient()
  if (!stripe || !stripeConfig.priceId) {
    throw new Error('Stripe checkout is not configured for this offer.')
  }

  const session = await stripe.checkout.sessions.create({
    mode: stripeConfig.mode,
    line_items: [
      {
        price: stripeConfig.priceId,
        quantity: 1,
      },
    ],
    success_url: `${origin}/checkout/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel?provider=stripe&offer=${slug}`,
    metadata: {
      offerSlug: slug,
    },
  })

  return {
    url: session.url,
    provider: 'stripe',
    sessionId: session.id,
  }
}

export async function verifyStripeCheckoutSession(sessionId) {
  const stripe = getStripeClient()
  if (!stripe) {
    throw new Error('Stripe is not configured.')
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const isComplete =
    session.status === 'complete' || session.payment_status === 'paid'

  if (!isComplete) {
    return {
      status: session.status,
      completed: false,
    }
  }

  const amountCents = session.amount_total ?? 0
  await recordPayment({
    provider: 'stripe',
    transactionId: session.payment_intent ?? session.id,
    checkoutSessionId: session.id,
    customerEmail: session.customer_details?.email ?? null,
    offerSlug: session.metadata?.offerSlug ?? null,
    status: 'completed',
    amountCents,
    currency: session.currency ?? 'usd',
    raw: {
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
    },
  })

  return {
    status: session.status,
    completed: true,
    amountCents,
    currency: session.currency ?? 'usd',
    offerSlug: session.metadata?.offerSlug ?? null,
  }
}

async function getPayPalAccessToken() {
  if (!hasPayPalCredentials()) {
    throw new Error('PayPal is not configured.')
  }

  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
    'utf8'
  ).toString('base64')

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    throw new Error('Failed to authenticate with PayPal.')
  }

  const payload = await response.json()
  return payload.access_token
}

export async function createPayPalCheckout({ slug, origin }) {
  const product = await getProduct(slug)
  const paypalConfig = getPayPalConfig(slug, product)

  if (!paypalConfig.amountCents) {
    throw new Error('PayPal checkout is not configured for this offer.')
  }

  if (!hasPayPalCredentials()) {
    if (!paypalConfig.businessEmail) {
      throw new Error('PayPal checkout is not configured for this offer.')
    }

    const returnUrl = new URL(`${origin}/checkout/success`)
    returnUrl.searchParams.set('provider', 'paypal')
    returnUrl.searchParams.set('offer', slug)
    returnUrl.searchParams.set('legacy', '1')

    const cancelUrl = new URL(`${origin}/checkout/cancel`)
    cancelUrl.searchParams.set('provider', 'paypal')
    cancelUrl.searchParams.set('offer', slug)

    const paypalUrl = new URL('https://www.paypal.com/cgi-bin/webscr')
    paypalUrl.searchParams.set('cmd', '_xclick')
    paypalUrl.searchParams.set('business', paypalConfig.businessEmail)
    paypalUrl.searchParams.set('item_name', product.name)
    paypalUrl.searchParams.set(
      'amount',
      (paypalConfig.amountCents / 100).toFixed(2)
    )
    paypalUrl.searchParams.set('currency_code', 'USD')
    paypalUrl.searchParams.set('return', returnUrl.toString())
    paypalUrl.searchParams.set('cancel_return', cancelUrl.toString())
    paypalUrl.searchParams.set('charset', 'UTF-8')

    return {
      url: paypalUrl.toString(),
      provider: 'paypal',
      mode: 'email_redirect',
      businessEmail: paypalConfig.businessEmail,
    }
  }

  const accessToken = await getPayPalAccessToken()
  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: slug,
          description: product.name,
          amount: {
            currency_code: 'USD',
            value: (paypalConfig.amountCents / 100).toFixed(2),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: SITE_DISPLAY_NAME,
            user_action: 'PAY_NOW',
            return_url: `${origin}/checkout/success?provider=paypal`,
            cancel_url: `${origin}/checkout/cancel?provider=paypal&offer=${slug}`,
          },
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create PayPal checkout.')
  }

  const payload = await response.json()
  const approvalLink = payload.links?.find(
    (entry) => entry.rel === 'payer-action'
  )?.href

  if (!approvalLink) {
    throw new Error('PayPal did not return an approval URL.')
  }

  return {
    url: approvalLink,
    provider: 'paypal',
    orderId: payload.id,
  }
}

export async function capturePayPalOrder(orderId) {
  const accessToken = await getPayPalAccessToken()
  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to capture PayPal order.')
  }

  const payload = await response.json()
  const purchaseUnit = payload.purchase_units?.[0]
  const capture = purchaseUnit?.payments?.captures?.[0]

  if (!capture || capture.status !== 'COMPLETED') {
    return {
      completed: false,
      status: capture?.status ?? payload.status ?? 'pending',
    }
  }

  const amountCents = parseAmountToCents(capture.amount?.value) ?? 0
  await recordPayment({
    provider: 'paypal',
    transactionId: capture.id,
    orderId,
    customerEmail: payload.payer?.email_address ?? null,
    offerSlug: purchaseUnit?.reference_id ?? null,
    status: 'completed',
    amountCents,
    currency: String(capture.amount?.currency_code ?? 'USD').toLowerCase(),
    raw: {
      id: payload.id,
      status: payload.status,
    },
  })

  return {
    completed: true,
    status: capture.status,
    amountCents,
    currency: String(capture.amount?.currency_code ?? 'USD').toLowerCase(),
    offerSlug: purchaseUnit?.reference_id ?? null,
  }
}
