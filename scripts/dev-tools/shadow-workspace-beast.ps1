# ============================================================
# SHADOW MATRIX — BEAST MODE WORKSPACE BOOTSTRAP
# One-time setup for 3000studios-next (idempotent/safe)
# ============================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ROOT = "C:\DEV\3000studios-next"
Set-Location $ROOT

Write-Host "`n🔥 SHADOW MATRIX WORKSPACE INIT 🔥" -ForegroundColor Cyan

# ------------------------------------------------------------
# 1) VERIFY ROOT
# ------------------------------------------------------------
if (-not (Test-Path "$ROOT/package.json")) {
  Write-Error "❌ Not a valid project root"
  exit 1
}
Write-Host "✔ Project root verified"

# ------------------------------------------------------------
# 2) INIT / VERIFY GIT (NO COMMIT)
# ------------------------------------------------------------
if (-not (Test-Path "$ROOT/.git")) {
  git init
  Write-Host "✔ Git initialized (local only)"
} else {
  Write-Host "✔ Git already initialized"
}

# ------------------------------------------------------------
# 3) CONNECT TO EXISTING GITHUB REPO (NO PUSH)
# ------------------------------------------------------------
$repoUrl = "https://github.com/3000Studios/3000studios-next.git"
$remotes = git remote
if ($remotes -notcontains "origin") {
  git remote add origin $repoUrl
  Write-Host "✔ GitHub remote attached"
} else {
  Write-Host "✔ GitHub remote already exists"
}

# ------------------------------------------------------------
# 4) GLOBAL TOOLS (GH CLI, Copilot CLI, Vercel CLI)
# ------------------------------------------------------------
Write-Host "`n🔧 Ensuring global CLIs..."
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  winget install --id GitHub.cli -e
}
if (-not (Get-Command copilot -ErrorAction SilentlyContinue)) {
  try { gh extension install github/gh-copilot } catch { Write-Warning "Copilot CLI install skipped: $_" }
}
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  npm install -g vercel
}
Write-Host "✔ GitHub CLI, Copilot CLI, Vercel CLI ready"

# ------------------------------------------------------------
# 5) NODE & PNPM SETUP
# ------------------------------------------------------------
Write-Host "`n📦 Preparing package manager (pnpm)"
corepack enable | Out-Null
corepack prepare pnpm@latest --activate | Out-Null

# ------------------------------------------------------------
# 6) INSTALL DEPENDENCIES (NO SCRIPTS)
# ------------------------------------------------------------
if (-not (Test-Path "$ROOT/node_modules")) {
  Write-Host "Installing deps with pnpm (ignore scripts)..."
  pnpm install --ignore-scripts
} else {
  Write-Host "✔ node_modules present; run 'pnpm install --ignore-scripts' manually if stale"
}

# ------------------------------------------------------------
# 7) VS CODE EXTENSIONS (WORKSPACE LEVEL)
# ------------------------------------------------------------
$extensions = @(
  "github.copilot",
  "github.copilot-chat",
  "ms-vscode.vscode-typescript-next",
  "esbenp.prettier-vscode",
  "dbaeumer.vscode-eslint",
  "ms-azuretools.vscode-docker",
  "continue.continue",
  "codegpt.codegpt",
  "blackboxapp.blackbox"
)
foreach ($ext in $extensions) { code --install-extension $ext --force }
Write-Host "✔ VS Code extensions installed"

# ------------------------------------------------------------
# 8) WORKSPACE SETTINGS
# ------------------------------------------------------------
$vsDir = "$ROOT/.vscode"
New-Item -ItemType Directory -Force $vsDir | Out-Null
@{
  "editor.formatOnSave" = $true
  "editor.defaultFormatter" = "esbenp.prettier-vscode"
  "files.autoSave" = "afterDelay"
  "typescript.tsdk" = "node_modules/typescript/lib"
  "git.autofetch" = $true
  "git.confirmSync" = $false
  "terminal.integrated.defaultProfile.windows" = "PowerShell"
  "security.workspace.trust.enabled" = $true
  "copilot.enable" = @{ "*" = $true }
} | ConvertTo-Json -Depth 10 | Set-Content "$vsDir/settings.json"
Write-Host "✔ Workspace settings locked"

# ------------------------------------------------------------
# 9) TASKS (DEV / LINT / TYPECHECK / BUILD / DEPLOY)
# ------------------------------------------------------------
@{
  "version" = "2.0.0"
  "tasks" = @(
    @{ "label" = "Dev Server"; "type" = "shell"; "command" = "pnpm dev"; "problemMatcher" = @() },
    @{ "label" = "Lint"; "type" = "shell"; "command" = "pnpm lint"; "problemMatcher" = @() },
    @{ "label" = "Typecheck"; "type" = "shell"; "command" = "pnpm typecheck"; "problemMatcher" = @() },
    @{ "label" = "Build"; "type" = "shell"; "command" = "pnpm build"; "problemMatcher" = @() },
    @{ "label" = "Deploy (Vercel)"; "type" = "shell"; "command" = "vercel --prod --yes"; "problemMatcher" = @() }
  )
} | ConvertTo-Json -Depth 10 | Set-Content "$vsDir/tasks.json"
Write-Host "✔ Tasks configured"

# ------------------------------------------------------------
# 10) FINAL HINTS
# ------------------------------------------------------------
Write-Host "`n✅ SHADOW MATRIX WORKSPACE READY" -ForegroundColor Green
Write-Host "👉 Next: fill .env secrets, run 'pnpm lint', 'pnpm typecheck', 'pnpm build'"

# ------------------------------------------------------------
# 11) OPTIONAL: OPEN VS CODE
# ------------------------------------------------------------
# code $ROOT
