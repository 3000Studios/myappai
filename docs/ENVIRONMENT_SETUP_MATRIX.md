# Environment Setup Matrix

This repo uses three different env surfaces. Put each variable in the right one so the app, the worker, and the browser all get the values they need without exposing secrets.

## Where Variables Belong

- `.secrets/myappai.local.env`
  Local-only private values for the Express API, scripts, deploy CLI, and repo-backed workflows.
- `.secrets/shared.local.env`
  Optional cross-project private values that can be shared across repos on the same machine.
- `.dev.vars` or Cloudflare Pages project secrets
  Runtime values for the Pages worker and public production endpoints on `myappai.net`.
- `.env` or `.env.local`
  Non-secret local development defaults when you do not want them in `.secrets`.
- `VITE_*`
  Public browser variables only. Never put private API keys here.

## Local Repo Secrets

Put these in `.secrets/myappai.local.env`.

- Core app: `APP_NAME`, `SITE_URL`, `WWW_SITE_URL`, `SITE_ORIGIN`, `WWW_SITE_ORIGIN`
- Admin auth: `ADMIN_EMAIL`, `ADMIN_PASSCODE`, `ADMIN_API_KEY`, `ADMIN_SESSION_SECRET`, `LOGS_ACCESS_CODE`
- Local-only signing: `JWT_SECRET`, `LICENSE_SECRET`
- Deploy + GitHub: `CLOUDFLARE_PAGES_PROJECT_NAME`, `CLOUDFLARE_PAGES_BRANCH`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` or `CLOUDFLARE_PAGES_DEPLOY_TOKEN`, `CLOUDFLARE_ZONE_ID`, `GH_BASE_BRANCH`, `GH_REPO`, `GH_TOKEN`
- AI providers: `PUBLIC_ASSISTANT_PROVIDER`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `ANTHROPIC_API_KEY`, `CLAUDE_MODEL`, `OLLAMA_API_URL`, `OLLAMA_MODEL`, `OLLAMA_PROXY_SECRET`
- Telegram bridge: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_URL`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_ALLOWED_CHAT_IDS`
- Payments: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_OPERATOR_OS`, `STRIPE_MODE_OPERATOR_OS`, `STRIPE_PRICE_LAUNCH_SPRINT`, `STRIPE_MODE_LAUNCH_SPRINT`, `STRIPE_PAYMENT_LINK_OPERATOR_OS`, `STRIPE_PAYMENT_LINK_LAUNCH_SPRINT`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_EMAIL`, `PAYPAL_ENV`, `PAYPAL_PRICE_OPERATOR_OS_USD`, `PAYPAL_PRICE_LAUNCH_SPRINT_USD`
- Media APIs: `UNSPLASH_ACCESS_KEY`, `PEXELS_API_KEY`, `PIXABAY_API_KEY`

## Cloudflare Pages / Worker Secrets

Put these in Cloudflare Pages project secrets or `.dev.vars`.

- Required for admin login on the worker: `APP_NAME`, `SITE_URL`, `WWW_SITE_URL`, `SITE_ORIGIN`, `WWW_SITE_ORIGIN`, `ADMIN_EMAIL`, `ADMIN_PASSCODE`, `ADMIN_API_KEY`, `ADMIN_SESSION_SECRET`
- Required for live Telegram webhook delivery: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_URL`
- Recommended for Telegram hardening: `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_ALLOWED_CHAT_IDS`
- Required for live Ollama proxy: `PUBLIC_ASSISTANT_PROVIDER=ollama`, `OLLAMA_API_URL`, `OLLAMA_MODEL`
- Optional for Ollama hardening: `OLLAMA_PROXY_SECRET`
- Required for Claude on the worker: `ANTHROPIC_API_KEY`, `CLAUDE_MODEL`, `PUBLIC_ASSISTANT_PROVIDER=claude`
- Required for OpenAI on the worker: `OPENAI_API_KEY`, `OPENAI_MODEL`, `PUBLIC_ASSISTANT_PROVIDER=openai`
- Required for live repo edits from the admin dashboard with the GitHub-backed worker path: `GH_REPO`, `GH_TOKEN`, `GH_BASE_BRANCH`, `OPENAI_API_KEY`, `OPENAI_MODEL`
- Required for live repo edits from the admin dashboard with an external repo-backed API: `ADMIN_API_ORIGIN`

`ADMIN_API_ORIGIN` must point to an external repo-backed operator API. It must not point back to `https://myappai.net`.

`OLLAMA_API_URL` must be a public URL Cloudflare can reach. `http://127.0.0.1:11434` only works for local development.

## Public Browser Variables

These are safe to expose in Vite builds.

- `VITE_API_BASE_URL`
- `VITE_ENABLE_ADS`
- `VITE_ADSENSE_CLIENT_ID`
- `VITE_GA4_MEASUREMENT_ID`
- `VITE_GTM_CONTAINER_ID`
- `VITE_META_PIXEL_ID`
- `VITE_CLARITY_PROJECT_ID`

## Current Audit Notes

As of March 27, 2026:

- Local integrations working: Ollama, OpenAI, GitHub, Cloudflare, Stripe, Gemini
- Local integrations failing: Telegram (`HTTP 401`), PayPal (`fetch failed`)
- Production write actions need either the GitHub-backed worker secrets above or `ADMIN_API_ORIGIN` pointing to a real repo-backed operator API
- Production Ollama is still blocked until `OLLAMA_API_URL` is a public reachable endpoint instead of localhost

## Quick Check Commands

```bash
npm run validate:env
npm run secrets:test
npm run check:full
curl https://myappai.net/api/public/telegram/status
curl https://myappai.net/api/ollama/status
```

For a Windows-first guided audit of remaining values, generated local secrets, live endpoint status, and token verification:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Get-MyAppAIRemainingSecrets.ps1 -CheckLive
```
