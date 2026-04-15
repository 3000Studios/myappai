# ================================
# RELEASE MERGE & DEPLOY SCRIPT
# Repo: 3000studios-next
# Safe, auditable, interactive
# ================================

$ErrorActionPreference = "Stop"

Write-Host "🚀 RELEASE MERGE & DEPLOY — 3000studios-next" -ForegroundColor Cyan

# ---- helpers ----
function Run($cmd) {
  Write-Host "▶ $cmd" -ForegroundColor Gray
  iex $cmd
}

function Clean-Next {
  if (Test-Path ".next") {
    Write-Host "🧹 Removing .next cache" -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next"
  }
}

function Verify-PR($prNumber) {
  Write-Host "`n🔍 VERIFYING PR #$prNumber" -ForegroundColor Cyan

  Run "gh pr checkout $prNumber"

  $branchName = "pr-$prNumber"
  Run "git branch -M $branchName"

  Clean-Next

  Write-Host "📦 Installing dependencies (non-frozen lockfile)" -ForegroundColor Yellow
  Run "pnpm install --no-frozen-lockfile"

  Write-Host "🔎 Running lint" -ForegroundColor Yellow
  Run "pnpm lint"

  Write-Host "🔎 Running TypeScript check" -ForegroundColor Yellow
  Run "pnpm tsc --noEmit"

  Write-Host "🏗️ Running build" -ForegroundColor Yellow
  Run "pnpm build"

  Write-Host "✅ PR #$prNumber passed all checks" -ForegroundColor Green
}

# ---- start ----
Run "git fetch origin"
Run "git checkout main"
Run "git pull origin main"

# ---- safety snapshot ----
$today = Get-Date -Format "yyyy-MM-dd"
$backupBranch = "backup/main-before-merge-$today"
$backupTag = "v-pre-merge-$today"

Run "git branch $backupBranch"
Run "git push origin $backupBranch"
Run "git tag -a $backupTag -m `"Snapshot before release merge $today`""
Run "git push origin $backupTag"

Write-Host "✅ Backup created: $backupBranch + $backupTag" -ForegroundColor Green

# ---- PR verification order ----
$prs = @(35, 34, 31, 33)

foreach ($pr in $prs) {
  Verify-PR $pr
}

# ---- confirm merge ----
Write-Host "`n⚠️  CONFIRM: All PRs verified. Create release branch and merge?" -ForegroundColor Yellow
$confirm = Read-Host "Type YES to continue"

if ($confirm -ne "YES") {
  Write-Host "❌ ABORT: User aborted" -ForegroundColor Red
  exit 1
}

# ---- merge ----
$releaseBranch = "release/merge-$today"
Run "git checkout -b $releaseBranch"

foreach ($pr in $prs) {
  Run "git merge --no-ff pr-$pr -m `"Merge PR #$pr`""
}

Run "git checkout main"
Run "git merge --no-ff $releaseBranch -m `"Release merge $today`""
Run "git push origin main"

Write-Host "🚀 MAIN UPDATED — Triggering Vercel deploy" -ForegroundColor Cyan
Run "vercel --prod --confirm"

Write-Host "🎉 RELEASE COMPLETE" -ForegroundColor Green
