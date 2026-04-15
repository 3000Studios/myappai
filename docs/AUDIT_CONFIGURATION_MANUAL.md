# 3000studios-next — Audit, Analysis, and Configuration Manual

## Scope

This document captures a verified audit of the current repository state and a configuration manual grounded in the files present in the repo. Findings below are sourced directly from the codebase.

## Repository Overview (Verified)

Key directories and responsibilities:

- `app/`: Next.js App Router pages and API routes (e.g., `/api/command`, `/api/auth/login`, `/vip`).
- `lib/`: backend service integrations (Stripe, PayPal, Vercel, GitHub, WebRTC, etc.).
- `github/workflows/`: GitHub Actions workflows (automation and sync).
- `middleware.ts`: route protection for `/admin` and `/vip`.

## Audit Findings (Blocking / High Impact)

### 1) TypeScript audit fails due to undefined error placeholders

Multiple files reference `_err`/`_error`/`_e` variables that are never defined, which fails the TypeScript build. A representative example is in the admin stream control component and API routes where `console.error('', _err)` appears inside `catch` blocks that declare `err` instead. This pattern is repeated throughout the repo and prevents type-checking from passing.

**Evidence**

- `app/admin/components/StreamControl.tsx` uses `_err` in `catch` blocks where `err` is defined.【F:app/admin/components/StreamControl.tsx†L24-L82】
- `app/api/realtime-sync/route.ts` logs `_error` that is never defined in scope.【F:app/api/realtime-sync/route.ts†L1-L93】

### 2) NextAuth route wiring is invalid

The NextAuth API route expects `handlers` from `@/auth`, but `auth.ts` does not export `handlers`. This results in a broken auth handler import and fails type-checking.

**Evidence**

- NextAuth route imports `handlers` from `@/auth`.【F:app/api/auth/[...nextauth]/route.ts†L1-L2】
- `auth.ts` exports `auth`, `signIn`, and `signOut`, but no `handlers` export exists.【F:auth.ts†L1-L6】

### 3) Login page missing `use client`

The login page uses client-only React hooks (`useState`, `useRouter`) but does not include the `"use client"` directive required for Client Components in the Next.js App Router. This will error in runtime rendering.

**Evidence**

- `app/login/page.tsx` uses `useRouter` and `useState` without `"use client"`.【F:app/login/page.tsx†L1-L200】

### 4) Admin entry path mismatch

The primary navigation links to `/admin/login`, but the actual login page lives at `/login`. This produces a broken route and causes a dead link from the nav.

**Evidence**

- Navigation links to `/admin/login`.【F:app/ui/Nav.tsx†L11-L23】
- Login page exists at `/login`.【F:app/login/page.tsx†L1-L200】

### 5) VIP Command Center is only a placeholder

The `/vip` route is a placeholder with a link to `/login`, but there is no command center UI nor voice/text command workflow exposed here.

**Evidence**

- `app/vip/page.tsx` renders a basic page with a link to `/login`.【F:app/vip/page.tsx†L1-L14】

### 6) Command Center flow does not trigger the workflow

The command API writes a JSON file into `commands/pending` on the main branch, but the GitHub Action listens for a `repository_dispatch` event and never reacts to file creation alone. This breaks the required “UI → /api/command → instruction JSON → GitHub Action” flow.

**Evidence**

- Command API writes to `commands/pending/...` using Octokit but does not trigger `repository_dispatch`.【F:app/api/command/route.ts†L1-L61】
- The workflow only runs on `repository_dispatch` type `antigravity-command` and ignores file changes.【F:github/workflows/antigravity-cloud.yml†L1-L35】

### 7) Multi-repo sync violates single-source deploy requirement

There is a workflow that syncs from an external repo into this one, which conflicts with the “single source of truth” requirement in the operating principles. This introduces a parallel source of updates.

**Evidence**

- Workflow checks out `3000Studios/3000Studios-VIP` and syncs into this repo.【F:github/workflows/multi-repo-sync.yml†L1-L33】

## Configuration Manual

### Required Runtime Targets

- All admin and VIP routes are protected by `middleware.ts` using the `admin` cookie and redirecting unauthorized users to `/login`.【F:middleware.ts†L1-L22】

### Admin Auth Configuration

- The admin login API validates against `ADMIN_PASSWORD` (fallback `ADMIN_SECRET`) and optional `ADMIN_EMAIL`, then sets the `admin` cookie for 7 days. Ensure these environment variables are set in the deployment environment.

**Evidence**

- Login endpoint checks `ADMIN_PASSWORD`/`ADMIN_SECRET` and `ADMIN_EMAIL`, sets cookie `admin` on success.【F:app/api/auth/login/route.ts†L1-L53】

### Command Center Configuration

- `/api/command` requires `GITHUB_TOKEN` to write commands into the repo. Ensure the token has `repo` scope for `createOrUpdateFileContents`.

**Evidence**

- Octokit is initialized with `process.env.GITHUB_TOKEN` and writes to `commands/pending/...` on `main`.【F:app/api/command/route.ts†L1-L61】

### Monetization Configuration

- Stripe checkout and webhook handlers are implemented under `/api/stripe/*`. Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`.
- PayPal checkout/capture/order creation are implemented under `/api/paypal/*`. Set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_ENV` (or related PayPal envs referenced in `lib/services/paypal.ts`).

**Evidence**

- Stripe webhook and checkout routes require Stripe keys and webhook secret.【F:app/api/stripe/webhook/route.ts†L1-L35】【F:app/api/stripe/checkout/route.ts†L1-L121】
- PayPal routes reference PayPal credentials and environment selection.【F:app/api/paypal/checkout/route.ts†L1-L146】

### Deployment Configuration (Vercel)

- `vercel.json` configures build-time env for `PNPM_HOME` and `NODE_OPTIONS`. Ensure Vercel uses Node 20 per `package.json` engines.

**Evidence**

- Vercel build environment config.【F:vercel.json†L1-L8】
- Node 20 specified in `package.json` engines.【F:package.json†L5-L8】

### GitHub Actions Configuration

- `ANTIGRAVITY Cloud Sync` runs on `repository_dispatch` type `antigravity-command` and executes `scripts/cloud-apply.js` before committing changes.
- `Sync VIP → Main` syncs a different repo into this one and requires `GH_BOT_TOKEN`.

**Evidence**

- `antigravity-cloud.yml` uses `GH_BOT_TOKEN` and runs `scripts/cloud-apply.js`.【F:github/workflows/antigravity-cloud.yml†L1-L35】
- `multi-repo-sync.yml` checks out external repo and pushes to main.【F:github/workflows/multi-repo-sync.yml†L1-L33】

### Environment Variable Inventory (Verified)

The following environment variables are referenced in code:

```
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_SECRET
AFFILIATE_COMMISSION_RATE
AFFILIATE_COOKIE_DURATION
AFFILIATE_SECRET
ANALYZE
ANTIGRAVITY_PAYLOAD
AUTO_START
CLAUDE_API_KEY
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CRON_SECRET
CSRF_SECRET
FULFILLMENT_SIGNING_SECRET
GEMINI_API_KEY
GH_BOT_TOKEN
GITHUB_PAT
GITHUB_TOKEN
GOOGLE_AI_API_KEY
GOOGLE_API_KEY
GOOGLE_SITE_VERIFICATION
GPT_BRIDGE_TOKEN
GUMROAD_ACCESS_TOKEN
JWT_SECRET
MARKETSTACK_API_KEY
MATRIX_ADMIN_EMAIL
MATRIX_ADMIN_PASSWORD
MONGODB_DB_NAME
MONGODB_URI
MONGO_URI
MUX_TOKEN_ID
MUX_TOKEN_SECRET
NEWS_API_KEY
NEXTAUTH_SECRET
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
NEXT_PUBLIC_BASE_URL
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_GA_MEASUREMENT_ID
NEXT_PUBLIC_GEMINI_API_KEY
NEXT_PUBLIC_MAPS_API
NEXT_PUBLIC_OPENAI_API_KEY
NEXT_PUBLIC_SIGNAL_SERVER
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_VERCEL_ANALYTICS_ID
NODE_ENV
OPENAI_API_KEY
OPENAI_ORG_ID
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
PAYPAL_CLIENT_SECRET_PROD
PAYPAL_ENV
PAYPAL_MODE
PAYPAL_SECRET
PEXELS_API_KEY
SHADOW_ADMIN_EMAIL
SHADOW_ADMIN_PASSWORD
STRIPE_3000_SECRET
STRIPE_BUSINESS_PRICE_ID
STRIPE_PRO_PRICE_ID
STRIPE_PUBLIC
STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE
VALIDATE_ENV_MODE
VERCEL_PROJECT_ID
VERCEL_TOKEN
VIP_SHARED_SECRET
VOICE_CONTINUOUS
VOICE_LANGUAGE
WEATHER_API_KEY
WEBRTC_KEY
WEBRTC_TURN_PASS
WEBRTC_TURN_URL
WEBRTC_TURN_USER
WP_PASS
WP_PASSWORD
WP_URL
WP_USER
WP_USERNAME
```

## Recommended Remediation Plan (Sequenced)

1. Fix `_err`/`_error` placeholders across the codebase to unblock TypeScript. (Search for `console.error('', _err)` patterns.)
2. Fix NextAuth handler export/import to ensure `app/api/auth/[...nextauth]` compiles.
3. Add `"use client"` to `app/login/page.tsx` to ensure client hooks work.
4. Resolve `/admin/login` path mismatch (either create the route or update nav to `/login`).
5. Implement actual VIP Command Center UI under `/vip` that posts to `/api/command` and shows a command log.
6. Wire `/api/command` to trigger `repository_dispatch` or add a workflow that responds to new `commands/pending` files.

---

This manual will be updated as fixes are implemented.
