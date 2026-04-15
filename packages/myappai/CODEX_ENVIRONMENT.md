# Codex Environment For `myappai`

Use this when creating a Codex environment for this repository.

## Setup Script

```bash
#!/bin/bash
set -e

echo "=== MYAPPAI ENV SETUP START ==="

apt-get update -y

apt-get install -y \
  git curl wget jq ca-certificates build-essential python3 python3-pip nodejs npm powershell

npm install -g \
  pnpm yarn typescript eslint prettier wrangler vite

pip3 install \
  pytest black flake8 requests

if [ -f package.json ]; then
  npm install
fi

if [ -f requirements.txt ]; then
  pip3 install -r requirements.txt
fi

mkdir -p logs scripts builds

echo "=== MYAPPAI ENV READY ==="
```

## Commands

- Validate env: `npm run validate:env`
- Lint: `npm run lint`
- Test: `npm run test`
- Build: `npm run build`
- Full check: `npm run check:full`

## Optional Environment Variables

- `NODE_ENV=development`
- `PYTHONUNBUFFERED=1`
- `AI_PROJECT_NAME=myappai`
- `CLOUDFLARE_PAGES_PROJECT_NAME=myappai`
- `CLOUDFLARE_PAGES_BRANCH=main`

## Notes

- The repo already defines working `lint`, `test`, and `build` scripts in `package.json`.
- `main` is treated as the live production branch, so pushes may deploy directly depending on Cloudflare Pages settings.
- `AGENTS.md` contains the higher-level operating rules Codex should follow inside this repo.
- Repo-local secrets should load from `.secrets/myappai.local.env` before `.secrets/shared.local.env`.
- For current environment and token guidance, see `docs/ENV_AUDIT_PLAYBOOK.md`.
