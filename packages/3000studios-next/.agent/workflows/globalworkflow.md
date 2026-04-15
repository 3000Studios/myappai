---
description: Global autonomous workflow governing continuous audit, self-healing, dependency management, feature verification, routing integrity, monetization validation, and zero-confirmation deploy cycles for 3000Studios.com.
---

# GLOBAL AUTONOMOUS WORKFLOW

// turbo-all

## PHASE 1: PRE-FLIGHT CHECKS

1. Run `pnpm install` to ensure all dependencies are current
2. Run `pnpm lint` to detect and log any linting issues
3. Run `pnpm type-check` to verify TypeScript integrity
4. Run `pnpm build` to confirm production build succeeds

## PHASE 2: INTEGRITY VERIFICATION

1. Verify all required directories exist:
   - `app/` → routes only
   - `components/` → reusable UI
   - `lib/` → systems, registries, automation
   - `app/api/` → server logic, voice endpoints
   - `scripts/` → audits, health checks, repair tools

2. Verify critical files exist:
   - `package.json`
   - `next.config.ts`
   - `tailwind.config.ts`
   - `.env.local` (or `.env.example`)

## PHASE 3: MONETIZATION VALIDATION

1. Verify Stripe integration:
   - Check `app/api/stripe/` endpoints exist
   - Confirm webhook handler is present

2. Verify PayPal integration:
   - Check `@paypal/react-paypal-js` is installed
   - Confirm PayPal components exist

3. Verify ad infrastructure:
   - AdSense-compatible slots prepared
   - Fallback monetization enabled

## PHASE 4: ROUTING INTEGRITY

1. Verify all navigation links resolve correctly
2. Confirm admin routes are protected
3. Validate API routes return expected responses

## PHASE 5: AUTO-DEPLOY

1. Stage all changes: `git add -A`
2. Commit with auto-generated message: `git commit -m "[AUTO] Autonomous workflow cycle"`
3. Push to origin: `git push origin main`
4. Trigger Vercel deployment (if configured)

## PHASE 6: POST-DEPLOY HEALTH CHECK

1. Verify production URL responds with 200
2. Run Lighthouse audit (optional)
3. Log final status to `.autopush-log.txt`

---

## RETURN CONDITIONS

- **SUCCESS**: All phases complete without error
- **FAILURE**: Any phase fails; log error and halt
- **RECOVERY**: On error, attempt self-healing (fix imports, install missing deps, retry once)
