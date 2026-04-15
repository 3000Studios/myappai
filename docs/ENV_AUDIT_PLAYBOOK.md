# Environment Audit Playbook

This guide is the current source of truth for MyAppAI environment setup, remaining blockers, and token permissions.

## Current Status

As of March 28, 2026:

- Local `npm run validate:env` passes.
- Local `npm run secrets:test` passes for Ollama, OpenAI, GitHub, Cloudflare, Stripe, and Gemini.
- Local `npm run secrets:test` still fails for:
  - Telegram: `HTTP 401`
  - PayPal: network/auth test still failing
- Live `https://myappai.net/api/public/telegram/status` currently reports:
  - `botTokenConfigured: false`
  - `webhookSecretConfigured: false`
  - `ollamaConfigured: false`
- Live `https://myappai.net/api/ollama/status` currently reports:
  - `OLLAMA_API_URL must be configured before the proxy can forward requests.`

That means the remaining blockers are operational config, not missing code paths:

1. The live Pages deployment needs the latest runtime env applied on a fresh production deploy.
2. The local repo still has an invalid `TELEGRAM_BOT_TOKEN`.
3. Production still does not have a public, Cloudflare-reachable `OLLAMA_API_URL`.

## What Is Already Configured Locally

These are already present in the repo-local environment on this machine:

- Core app and site URLs
- Admin auth and session secrets
- GitHub repo + token
- Cloudflare account/project/token/zone values
- OpenAI key + model
- Anthropic key + Claude model
- Gemini key
- Local Ollama URL + model
- Stripe secret + webhook secret
- PayPal client ID + client secret
- JWT, license, webhook, and Ollama proxy secrets

## Remaining Variables And Secrets

## Must Still Be Fixed

- `TELEGRAM_BOT_TOKEN`
  - The currently loaded local value is invalid.
  - Replace it in `.secrets/myappai.local.env`.
  - Re-upload it to Cloudflare Pages production secrets.
- `OLLAMA_API_URL` for production
  - Must be a public upstream URL Cloudflare can reach.
  - Do not use `http://127.0.0.1:11434`.
  - Do not use `https://myappai.net/api/ollama` because that creates a loop.

## Strongly Recommended

- `TELEGRAM_ALLOWED_CHAT_IDS`
  - Restricts who can use the bot.
- `R2_PUBLIC_BASE_URL`
- `R2_S3_ENDPOINT`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`

## Optional Business And Content Variables

- `UNSPLASH_ACCESS_KEY`
- `PEXELS_API_KEY`
- `PIXABAY_API_KEY`
- `STRIPE_PRICE_OPERATOR_OS`
- `STRIPE_MODE_OPERATOR_OS`
- `STRIPE_PRICE_LAUNCH_SPRINT`
- `STRIPE_MODE_LAUNCH_SPRINT`
- `STRIPE_PAYMENT_LINK_OPERATOR_OS`
- `STRIPE_PAYMENT_LINK_LAUNCH_SPRINT`
- `PAYPAL_PRICE_OPERATOR_OS_USD`
- `PAYPAL_PRICE_LAUNCH_SPRINT_USD`

## Where Each Value Belongs

## Local Only

Put these in `.secrets/myappai.local.env`:

- `OLLAMA_API_URL=http://127.0.0.1:11434`
- all repo-local admin values
- deploy CLI credentials
- local-only signing keys

## Cloudflare Pages Plain Text

Set these as plain text in Pages Production:

- `APP_NAME=myappai`
- `API_MODE=repo-local`
- `NODE_ENV=production`
- `SITE_URL=https://myappai.net`
- `WWW_SITE_URL=https://www.myappai.net`
- `SITE_ORIGIN=https://myappai.net`
- `WWW_SITE_ORIGIN=https://www.myappai.net`
- `GH_BASE_BRANCH=main`
- `PUBLIC_ASSISTANT_PROVIDER=ollama`
- `OLLAMA_MODEL=llama3.2:3b`
- `OPENAI_MODEL=gpt-4o`
- `CLAUDE_MODEL=claude-3-5-sonnet-latest`
- `PAYPAL_ENV=live`
- `R2_BUCKET_NAME=myappai`
- `VITE_ENABLE_ADS=false`

## Cloudflare Pages Secrets

Set these as production secrets in Pages:

- `ADMIN_EMAIL`
- `ADMIN_PASSCODE`
- `ADMIN_API_KEY`
- `ADMIN_SESSION_SECRET`
- `LOGS_ACCESS_CODE`
- `JWT_SECRET`
- `LICENSE_SECRET`
- `GH_REPO`
- `GH_TOKEN`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_URL`
- `TELEGRAM_WEBHOOK_SECRET`
- `OLLAMA_API_URL`
- `OLLAMA_PROXY_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ZONE_ID`

## Cloudflare Token Permissions

For the token used by this repo's deploy and Pages management flows, the minimum practical permissions are:

- Account: `Cloudflare Pages:Edit`
- Account: `Account Settings:Read`

Recommended if you want one token that also covers current and likely near-term repo operations:

- Account: `Cloudflare Pages:Edit`
- Account: `Workers Scripts:Edit`
- Account: `Workers Routes:Read`
- Account: `Account Settings:Read`
- Account: `R2:Edit`
- Zone: `Zone:Read`

Use the narrowest token you can. If you keep a separate deploy token, prefer that over a broader personal token.

## GitHub Tokens

This repo does not require GitHub Actions secrets to deploy through Cloudflare's GitHub integration.

The tokens that are useful for MyAppAI are:

1. `GH_TOKEN`
   - Purpose: live admin command center edits through the GitHub-backed worker path, local repo automation, and GitHub API publishing.
   - Recommended token type: fine-grained personal access token.
   - Minimum repo permissions:
     - `Contents: Read and write`
     - `Metadata: Read`
   - Recommended additional permissions:
     - `Pull requests: Read and write`
     - `Issues: Read and write`
     - `Actions: Read`

2. `GH_BOT_TOKEN`
   - Optional separate runtime token if you want the worker to use a different identity than your local developer token.
   - Same permissions as `GH_TOKEN`.

3. `GH_READONLY_TOKEN`
   - Optional diagnostics-only token for read-only automation.
   - Permissions:
     - `Contents: Read`
     - `Metadata: Read`
     - `Pull requests: Read`
     - `Issues: Read`

## GitHub Repository Secrets

Store secrets in GitHub only if you later add GitHub Actions that need them.

Right now, GitHub repo secrets are optional. If you do add Actions, the usual set would be:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ZONE_ID`
- `GH_TOKEN`
- `OPENAI_API_KEY`

Do not duplicate everything into GitHub secrets unless Actions actually need them.

## Fastest Path To Green

1. Replace the invalid `TELEGRAM_BOT_TOKEN` in `.secrets/myappai.local.env`.
2. Upload that same valid token to Cloudflare Pages production.
3. Set production `OLLAMA_API_URL` to a real public upstream.
4. Trigger a fresh production deploy from `main`.
5. Re-run:

```bash
npm run validate:env
npm run secrets:test
node scripts/register-telegram-webhook.js
curl https://myappai.net/api/public/telegram/status
curl https://myappai.net/api/ollama/status
```

## Helper Script

Use the Windows helper to audit and fill what can be safely generated:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Get-MyAppAIRemainingSecrets.ps1 -CheckLive
```

To generate any missing local-only random secrets and append them to `.secrets/myappai.local.env`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Get-MyAppAIRemainingSecrets.ps1 -GenerateLocalSecrets -WriteLocalEnv
```
