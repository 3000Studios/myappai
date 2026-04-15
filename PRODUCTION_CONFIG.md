# Production Config

Use these names when setting production variables for **MyAppAI**.

## Required deployment secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `ADMIN_EMAIL`
- `ADMIN_PASSCODE`
- `ADMIN_API_KEY`
- `ADMIN_SESSION_SECRET`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`

## Optional integration secrets

- `GH_TOKEN`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`
- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`
- `DEEPSEEK_API_KEY`
- `MISTRAL_API_KEY`
- `TOGETHER_API_KEY`
- `UNSPLASH_ACCESS_KEY`
- `PEXELS_API_KEY`
- `PIXABAY_API_KEY`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`

## Plaintext production variables

- `NODE_ENV=production`
- `APP_NAME=myappai`
- `AI_PROJECT_NAME=myappai`
- `GH_BASE_BRANCH=main`
- `CLOUDFLARE_PAGES_BRANCH=main`
- `CLOUDFLARE_PAGES_PROJECT_NAME=myappai`
- `SITE_URL=https://myappai.net`
- `WWW_SITE_URL=https://www.myappai.net`
- `SITE_ORIGIN=https://myappai.net`
- `WWW_SITE_ORIGIN=https://www.myappai.net`
- `API_MODE=repo-local`
- `OPENAI_MODEL=gpt-4o`
- `PAYPAL_ENV=live`
- `R2_BUCKET_NAME=myappai`
- `R2_S3_ENDPOINT=...`
- `R2_PUBLIC_BASE_URL=...`
- `VITE_ENABLE_ADS=false`
- `VITE_ADSENSE_CLIENT_ID=ca-pub-...`
- `VITE_GA4_MEASUREMENT_ID=G-...`
- `VITE_GTM_CONTAINER_ID=GTM-...`
- `VITE_META_PIXEL_ID=...`
- `VITE_CLARITY_PROJECT_ID=...`

## Important corrections

- Use `CLOUDFLARE_API_TOKEN`, not `CLOUD_FLARE_API_TOKEN`.
- The request header is `x-admin-key`, but the stored secret name is `ADMIN_API_KEY`.
- Keep Cloudflare API tokens, payment credentials, AI provider keys, and R2 S3 credentials out of tracked files.
- Treat any key pasted into chat, tickets, or logs as compromised and rotate it.

## Deploy flow

Preferred flow:

```bash
npm install
npm run validate:env
npm run lint
npm run test
npm run build
npm run pages:deploy
```

If the Pages project does not exist yet:

```bash
npm run pages:project:create
```
