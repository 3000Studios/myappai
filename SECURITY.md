# Security Policy

Do not commit:
- .env files
- API keys
- Firebase config values copied from dashboards
- service account JSON
- OAuth secrets
- tokens
- cookies
- private keys
- billing data

Required checks:
- npm run lint
- npm run typecheck
- npm run build
- gitleaks detect --source . --redact
- trivy fs .
- semgrep scan --config auto

Production changes requiring approval:
- deploy
- DNS change
- Firebase rules publish
- Cloudflare setting changes
- billing
- secret rotation
