# Local Secrets

Never paste secrets into chat or commit them to the repository.

## Primary local secrets file

Paste your local secrets into:

`c:\Workspaces\myappai\.secrets\myappai.local.env`

This file is gitignored and is automatically loaded by:

- local scripts in `scripts/`
- the local server
- validation and deploy commands that use `scripts/lib/loadEnvironment.js`
- repo-local bots and agents that follow the project instructions

For Cloudflare Pages deploys, you can optionally add:

`CLOUDFLARE_PAGES_DEPLOY_TOKEN=...`

If this variable is not set, manual Pages write commands in this repo will
fall back to your local Wrangler OAuth login instead of forcing the default
environment API token.

## Shared local secrets file

Cross-project tokens and bot credentials can live in:

`c:\Workspaces\myappai\.secrets\shared.local.env`

## Archive local secrets file

Legacy or alternate values that should not load by default can live in:

`c:\Workspaces\myappai\.secrets\archive.local.env`

The loader checks files in this order:

1. `.secrets/myappai.local.env`
2. `.secrets/shared.local.env`
3. `.env.local`
4. `.env`
5. `.dev.vars.local`
6. `.dev.vars`

`.secrets/archive.local.env` is intentionally not auto-loaded.

The `.secrets/*` files take precedence over ambient machine-level variables so
broken user or system env values do not contaminate repo-local commands.

## Fast start

1. Copy `.secrets/myappai.local.env.example` to `.secrets/myappai.local.env`
2. Put repo-active values in `myappai.local.env`
3. Put reusable cross-project values in `shared.local.env`
4. Put old or alternate values in `archive.local.env`
5. Keep `ADMIN_PASSCODE=5555` and `LOGS_ACCESS_CODE=8888` if you want the current admin + secure log flow
6. Run `npm run validate:env`
7. Run `npm run secrets:test`
8. Run `npm run secrets:path` any time you want to confirm the exact primary file path
9. Run `powershell -ExecutionPolicy Bypass -File .\scripts\Get-MyAppAIRemainingSecrets.ps1 -CheckLive` for a current audit of what is configured, what is still missing, and what the live site is reporting

## Important boundary

Local bots and scripts in this repository can read these variables through the normal environment loader.

Remote chat systems and browser-based tools should not be given raw secret values directly.

## Frontend warning

Do not put real private API keys in `VITE_*` variables unless you intentionally want them exposed to the browser bundle.
