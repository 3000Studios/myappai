# MyAppAI

MyAppAI is a Vite + React public homepage with a local Express admin/API layer, a browser-based operator workspace, and manual Wrangler deployment support for safe operator-driven updates.

## Quick start

```bash
npm install
Copy-Item .env.example .env
npm run cli:doctor
npm run dev
```

The local app runs with:

- public site on `http://localhost:5173`
- local API/admin server on `http://127.0.0.1:8787`

## Core commands

```bash
npm run dev
npm run check:fast
npm run lint
npm run typecheck
npm run test
npm run test:unit
npm run build
npm run cli:doctor
npm run cli -- command "refresh the homepage hero copy"
npm run cli -- pages:list
npm run cli:deploy
```

## Environment files

- `.env.example` is the canonical local template.
- `.dev.vars.example` is the canonical Cloudflare Pages secret template.
- `wrangler.toml` contains only non-secret deployment defaults.

Never commit `.env`, `.env.local`, or `.dev.vars`.

## Cloudflare Pages

This repo expects a Pages project defined by:

- `CLOUDFLARE_PAGES_PROJECT_NAME`
- `CLOUDFLARE_PAGES_BRANCH`

Default values are `myappai` and `main`.

If that project does not exist yet, create it with:

```bash
npm run pages:project:create
```

Then deploy with:

```bash
npm run cli:deploy
```

Deployments are manual Wrangler deploys only. This repo does not rely on GitHub Actions or GitHub-based auto-deploy workflows.

## Faster local workflow

For day-to-day iteration, use the lighter loop first:

```bash
npm run check:fast
```

That runs cached linting, incremental typechecking, and unit tests without the heavier environment validation and platform verification steps. Keep `npm run test`, `npm run build`, or `npm run check:full` for release-ready verification.

## Documentation

- `docs/DEPLOYMENT.md`
- `docs/ARCHITECTURE_AND_ADSENSE.md`
- `docs/CUSTOM_GPT_SITE_OPERATOR.md`
- `docs/ENVIRONMENT_SETUP_MATRIX.md`
- `docs/MASTER_1_ULTRA_PROMPT.md`
- `docs/OPENCLAW_CLAUDE_BOT.md`
- `docs/OLLAMA_FREE_ASSISTANT.md`
