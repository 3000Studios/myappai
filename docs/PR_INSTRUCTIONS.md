```markdown
# Applying the Admin & Stabilization Patch — Instructions

Prerequisites:
- Node 20.x, pnpm, git
- GitHub CLI (gh) installed and authenticated: `gh auth login`
- Optionally Vercel CLI if you deploy with Vercel: `npm i -g vercel`

1. Copy the provided patch file `0001-fix-stabilize-build.patch` into the repo root (or make your local edits).
2. Export environment variables for seeding the admin user (local use only):
   - Windows PowerShell:
     ```
     $env:ADMIN_EMAIL = 'mr.jwswain@gmail.com'
     $env:ADMIN_PASSWORD = '5555'
     ```
   - macOS / Linux:
     ```
     export ADMIN_EMAIL='mr.jwswain@gmail.com'
     export ADMIN_PASSWORD='5555'
     ```

3. Run the orchestrator script:
   - PowerShell:
     ```
     powershell -ExecutionPolicy Bypass -File .\scripts\create-pr-and-deploy.ps1
     ```

4. Set repository secrets (if desired / required):
   - Using GitHub UI or gh:
     ```
     gh secret set ADMIN_EMAIL --body "mr.jwswain@gmail.com"
     gh secret set ADMIN_PASSWORD --body "5555"
     gh secret set NEXTAUTH_SECRET --body "<secure-long-random>"
     gh secret set DATABASE_URL --body "<your-db-url>"
     gh secret set VERCEL_TOKEN --body "<token>"
     ```

5. Review PR and merge. CI will run and deploy (if configured).
6. Log in via API (or create a login form) and use admin dashboard.

Notes:
- The seed script uses Prisma if present, otherwise .data/users.json.
- Replace the placeholder avatar image with a production file in public/images/.
- Hardening: switch to NextAuth / OAuth and rotate secrets in production.
```