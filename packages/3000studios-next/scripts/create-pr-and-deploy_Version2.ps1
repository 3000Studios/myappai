<#
.SYNOPSIS
  Orchestrate applying fixes, seeding admin, creating a PR, and optionally merging & deploying.
#>

param(
  [string]$PatchFile = ".\0001-fix-stabilize-build.patch",
  [string]$Branch = "fix/stabilize-build-0001",
  [switch]$PushToMain = $false,
  [switch]$AutoMergePR = $false
)

set-strictmode -Version Latest
$ErrorActionPreference = 'Stop'

function Log { param($m) Write-Host "$(Get-Date -Format s) - $m" }

# Basic preflight
Log "Preflight: checking environment..."
foreach ($cmd in @("git","node","pnpm","gh")) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    throw "Required command not found in PATH: $cmd"
  }
}

# Ensure authenticated gh
try {
  & gh auth status -h github.com > $null 2>&1
} catch {
  throw "GitHub CLI not authenticated. Run 'gh auth login' and re-run this script."
}

# Ensure on main and up-to-date
Log "Fetching origin..."
& git fetch origin --prune
Log "Checking out main..."
& git checkout main
& git pull origin main --rebase

# Clean working tree
if ((& git status --porcelain).Trim()) {
  throw "Working tree not clean. Commit or stash changes before running this script."
}

# Create branch
if (& git rev-parse --verify $Branch > $null 2>&1) {
  Log "Deleting existing local branch $Branch"
  & git branch -D $Branch
}
Log "Creating branch $Branch"
& git checkout -b $Branch

# Apply patch if present
if (Test-Path $PatchFile) {
  Log "Applying patch $PatchFile"
  try {
    & git am $PatchFile
    Log "Patch applied via git am."
  } catch {
    Log "git am failed, attempting git apply fallback..."
    try { & git am --abort } catch {}
    & git apply --index --reject --whitespace=fix $PatchFile
    & git add -A
    & git commit -m "chore: apply stabilization patch (fallback apply)"
    Log "Fallback apply committed."
  }
} else {
  Log "No patch file found at $PatchFile; continuing with current working tree (assumes you've made local changes)."
}

# Install deps & validate build
Log "Installing dependencies..."
& pnpm install

$pkg = (Get-Content package.json -Raw | ConvertFrom-Json)
if ($pkg.scripts -and $pkg.scripts.prebuild) {
  Log "Running prebuild..."
  & pnpm run prebuild
}

if ($pkg.scripts -and $pkg.scripts.'type-check') {
  Log "Running type-check..."
  & pnpm run type-check
}

Log "Running build..."
& pnpm run build 2>&1 | Tee-Object -FilePath ".\create-pr-build.log"

# Seed admin user (script will read env ADMIN_EMAIL and ADMIN_PASSWORD)
$adminEmail = $env:ADMIN_EMAIL
$adminPwd = $env:ADMIN_PASSWORD
if (-not $adminEmail -or -not $adminPwd) {
  Log "No ADMIN_EMAIL/ADMIN_PASSWORD in env. Prompting to set interactively for local seed (will NOT store in repo)."
  $adminEmail = Read-Host "Enter admin email (for seed user)"
  $adminPwd = Read-Host "Enter admin password (will be used to seed admin account)"
  $env:ADMIN_EMAIL = $adminEmail
  $env:ADMIN_PASSWORD = $adminPwd
}

Log "Seeding admin user (local store) via node script..."
& node --trace-warnings scripts/seed-admin.js

# Commit any changes created by scripts
if ((& git status --porcelain).Trim()) {
  & git add -A
  & git commit -m "chore: apply admin wiring, seed admin user and scaffolding"
}

# Push branch and create PR
Log "Pushing branch to origin..."
& git push -u origin $Branch

# Determine repo identifier for gh
$origin = (& git remote get-url origin).Trim()
if ($origin -match "[:/](?<owner>[^/]+)/(?<repo>[^/.]+)(\.git)?$") {
  $owner = $Matches.owner
  $repo = $Matches.repo
  $repoFull = "$owner/$repo"
} else {
  throw "Unable to determine repo from origin URL: $origin"
}

Log "Creating PR via gh..."
$prTitle = "chore: stabilization + admin wiring (auto-generated)"
$prBody = @"
This PR applies scaffolding and fixes to:
- Wire up the Admin dashboard and mobile nav/hamburger
- Add login API and admin seeding script (seed-admin)
- Add Playfair Display base font and tidy global styles
- Add an admin avatar placeholder component and mobile-friendly layout
- Add an initial voice-to-web API endpoint stub
"@
$prUrl = & gh pr create --title $prTitle --body $prBody --base main --head $Branch --repo $repoFull --json url --jq ".url"
Log "PR created: $prUrl"

if ($AutoMergePR) {
  Log "Attempting to merge PR automatically..."
  try {
    & gh pr merge $prUrl --merge --delete-branch
    Log "Merged PR $prUrl"
  } catch {
    Log "Auto-merge failed or not permitted: $($_.Exception.Message)"
  }
}

if ($PushToMain) {
  Log "Attempting to merge branch into main locally and push (only do if you have permission)..."
  & git checkout main
  & git merge --no-ff $Branch -m "chore: merge $Branch"
  & git push origin main
  Log "Pushed main; CI should trigger now."
}

Log "All done. Please check the PR on GitHub: $prUrl"
Log "If you want to attempt deployment via Vercel CLI, run: npm i -g vercel; vercel --prod --token <YOUR_TOKEN>"
exit 0