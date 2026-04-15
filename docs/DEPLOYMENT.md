# Deployment — MyAppAI (Cloudflare Pages)

## Build output

- **Vite** builds the public app to **`dist/`** (see `vite.config.js`).
- **Wrangler** is configured with `pages_build_output_dir = "dist"` in `wrangler.toml`.

## Preferred operator CLI

Use the repo CLI so the same workflow works locally with manual Wrangler deploys:

```bash
npm run cli:doctor
npm run cli -- pages:list
npm run cli -- pages:create
npm run cli:deploy
```

Useful one-off commands:

```bash
npm run cf:whoami
npm run command -- "{\"action\":\"discover_topics\",\"seedTopics\":[\"Georgia camps\"],\"limit\":3}"
npm run cli -- command "refresh the homepage hero copy"
```

## Create the Pages project (first time)

In the [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → create a Pages project whose name matches `wrangler.toml` / `--project-name`. This repo is set up for manual Wrangler deploys, not GitHub-connected automation. If deploy fails with **project not found**, the name does not exist in that account yet.

This repo defaults to:

- `CLOUDFLARE_PAGES_PROJECT_NAME=myappai`
- `CLOUDFLARE_PAGES_BRANCH=main`

If your Cloudflare account still uses a different Pages project name, set `CLOUDFLARE_PAGES_PROJECT_NAME` in your local `.env` and in Cloudflare before deploying.

## Commands

```bash
npm install
npm run validate:env
npm run lint
npm run typecheck
npm run test
npm run build
npm run pages:deploy
```

Set `CLOUDFLARE_API_TOKEN` in your environment (or run `wrangler login`) before deploy. **Do not** commit tokens.

## Production environment variables

Configure in **Cloudflare Pages → Settings → Environment variables** (and matching local `.env` for dev):

- `CLOUDFLARE_PAGES_PROJECT_NAME`, `CLOUDFLARE_PAGES_BRANCH`
- `SITE_URL`, `WWW_SITE_URL`, `SITE_ORIGIN`, `WWW_SITE_ORIGIN`
- `APP_NAME`, `API_MODE`
- **Public site (Vite `VITE_*`)**:
  `VITE_API_BASE_URL` (optional when the frontend and Worker/API share the same Pages origin)
  `VITE_GA4_MEASUREMENT_ID`
  `VITE_GTM_CONTAINER_ID`
  `VITE_META_PIXEL_ID`
  `VITE_CLARITY_PROJECT_ID`
  `VITE_ENABLE_ADS`
  `VITE_ADSENSE_CLIENT_ID`
- **Server / API**:
  `ADMIN_API_ORIGIN` (Pages only: must point to an external repo-backed operator API, not the Pages site itself)
  `ADMIN_EMAIL`
  `ADMIN_PASSCODE`
  `ADMIN_API_KEY`
  `ADMIN_SESSION_SECRET`
  `OPENAI_API_KEY`
  `OPENAI_MODEL`
  `STRIPE_SECRET_KEY`
  `STRIPE_WEBHOOK_SECRET`
  `PAYPAL_CLIENT_ID`
  `PAYPAL_CLIENT_SECRET`
  `PAYPAL_EMAIL`
  `PAYPAL_ENV`
  `UNSPLASH_ACCESS_KEY`
  `PEXELS_API_KEY`
  `PIXABAY_API_KEY`
  `R2_PUBLIC_BASE_URL`
  `R2_BUCKET_NAME`
  `R2_S3_ENDPOINT`
  `R2_ACCESS_KEY_ID`
  `R2_SECRET_ACCESS_KEY`

## Domains

Point **myappai.net** and **www.myappai.net** to Cloudflare Pages in the Cloudflare dashboard. Prefer a single **canonical** host and redirect the other.

## Bulk secret upload

If you maintain a local `.dev.vars` file, you can sync it to Pages secrets with:

```bash
npm run pages:secret:bulk
```

That command wraps:

```bash
npx wrangler pages secret bulk .dev.vars --project-name myappai
```

## Secret rotation

If any API key, token, or password was **exposed in chat, tickets, or logs**, assume compromise: **rotate** it in the provider console (OpenAI, Cloudflare, GitHub, PayPal, Stripe, etc.) and update env vars only in secure storage — never in the repository.
