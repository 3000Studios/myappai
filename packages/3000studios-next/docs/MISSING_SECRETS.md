# Missing Secrets & Credentials

The following environment variables or credentials are required for full functionality and deployment but were not found or could not be verified in the current environment.

## Deployment

- **`VERCEL_TOKEN`**: Required for automated deployment via CLI.
- **`VERCEL_ORG_ID`**: Required for Vercel project linking.
- **`VERCEL_PROJECT_ID`**: Required for Vercel project linking.

## Monetization

- **`NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`**: Required for AdSense integration.
  - _Current Status_: Gracefully handled (ads disabled if missing).
- **`STRIPE_SECRET_KEY`**: Required for store checkout.
- **`PAYPAL_CLIENT_ID`**: Required for PayPal integration.

## Content

- **`OPENAI_API_KEY`**: Likely required for content generation jobs (implied by `ai` dependency).
