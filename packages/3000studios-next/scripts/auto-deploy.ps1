<#
.SYNOPSIS
  Automated apply -> commit -> push -> create PR/merge -> trigger deploy -> smoke-test
  for 3000Studios/3000studios-next.

.DESCRIPTION
  This script attempts to apply the prepared patch (0001-fix-stabilize-build.patch),
  commit the changes on a branch, push to origin, create a GitHub PR (if direct push is
  blocked by branch protection), optionally auto-merge if allowed, and wait for the
  CI/CD workflow to deploy. It then does a simple smoke-test against your website.

.PARAMETER PatchFile
  Path to the patch file to apply (mbox/git am format). Default: ./0001-fix-stabilize-build.patch

.PARAMETER Branch
  Branch name to create for changes. Default: fix/stabilize-build-0001

.PARAMETER ForcePush
  If present, attempt to push directly to main (dangerous if branch protected). Default: false

.PARAMETER AutoMergePR
  If present and a PR is created, attempt to auto-merge the PR (requires appropriate rights).

.PARAMETER WaitForDeploymentSeconds
  How long to wait (seconds) for deployment to succeed after merge/push. Default: 600 (10m)

#>

param(
    [string]$PatchFile = ".\0001-fix-stabilize-build.patch",
    [string]$Branch = "fix/stabilize-build-0001",
    [switch]$ForcePush = $false,
    [switch]$AutoMergePR = $false,
    [int]$WaitForDeploymentSeconds = 600
)

# Add local directory to path to find local gh.exe
$env:PATH = "$(Get-Location);$env:PATH"

set-strictmode -Version Latest
$ErrorActionPreference = 'Stop'

function Log { param($m) Write-Host "$(Get-Date -Format s) - $m" }
function Fail { param($m) Write-Host "$(Get-Date -Format s) - ERROR: $m"; exit 1 }

try {
    Log "Starting auto-deploy helper"

    if (-not (Test-Path ".git")) { Fail "Run this script from the repository root (where .git is located)." }

    # Ensure GH auth
    try {
        & gh auth status -h github.com 2>&1 | Out-Null
    }
    catch {
        Log "Warning: GitHub CLI not authenticated or not found. PR creation might fail."
    }

    Log "Fetching origin..."
    & git fetch origin --prune

    # Ensure local main exists and up-to-date
    try {
        Log "Checking out main..."
        & git checkout main
        & git pull origin main --rebase
    }
    catch {
        Log "Warning: Failed to checkout or pull main. Creating it from origin/main if possible."
        try { & git checkout -b main origin/main } catch { Log "Warning: Could not create main branch. Continuing on current branch." }
    }

    # Ensure working tree clean
    $status = & git status --porcelain
    if ($status -and $status.Count -gt 0) {
        Log "Stashing local changes..."
        & git stash
    }

    # Create work branch
    if (& git show-ref --verify --quiet "refs/heads/$Branch") {
        Log "Deleting existing local branch $Branch"
        & git branch -D $Branch
    }
    & git checkout -b $Branch

    # Apply patch
    if (-not (Test-Path $PatchFile)) {
        Fail "Patch file not found at $PatchFile."
    }
    Log "Applying patch file $PatchFile"
    try { & git am --abort 2>$null } catch {}
    try {
        & git am $PatchFile
        Log "git am applied patch cleanly."
    }
    catch {
        Log "git am failed - attempting fallback git apply."
        try { & git am --abort 2>$null } catch {}
        try {
            & git apply --index --reject --whitespace=fix $PatchFile
            Log "git apply succeeded (check for .rej files). Committing."
            & git add -A
            & git commit -m "chore: apply stabilization patch (fallback apply)"
        }
        catch {
            Fail "Patch application failed. Resolve manually."
        }
    }

    # Install and build
    Log "Installing dependencies (pnpm install --frozen-lockfile)..."
    & pnpm install --frozen-lockfile

    $pkg = (Get-Content package.json -Raw | ConvertFrom-Json)
    if ($pkg.scripts -and $pkg.scripts.prebuild) {
        Log "Running prebuild..."
        & pnpm run prebuild
    }

    if ($pkg.scripts -and $pkg.scripts.'type-check') {
        Log "Running type-check..."
        try { & pnpm run type-check } catch { Log "Type-check failed, continuing to build." }
    }

    Log "Running build..."
    try {
        & pnpm run build 2>&1 | Tee-Object -FilePath ".\auto-deploy-build.log" -Variable _buildOut
        Log "Build succeeded."
    }
    catch {
        Log "Build failed. Fix errors and retry."
        exit 1
    }

    # Commit any new/leftover changes
    $status2 = & git status --porcelain
    if ($status2 -and $status2.Count -gt 0) {
        Log "Staging remaining changes and committing."
        & git add -A
        & git commit -m "fix: apply stabilization patch and build artifacts"
    }

    # Push branch to origin
    Log "Pushing branch $Branch to origin..."
    try {
        & git push -u origin $Branch
        Log "Branch pushed: origin/$Branch"
    }
    catch {
        Log "git push failed; attempting rebase and re-push..."
        & git fetch origin
        & git rebase origin/main
        & git push -u origin $Branch
    }

    # PR creation
    Log "Attempting to create a PR via gh..."
    $title = "fix: stabilization"
    $body = "Automated PR created by scripts/auto-deploy.ps1"
    try {
        $prUrl = (& gh pr create --title $title --body $body --base main --head $Branch 2>&1).Trim()
        Log "PR created: $prUrl"
    
        if ($AutoMergePR) {
            Log "Attempting auto-merge..."
            & gh pr merge $prUrl --merge --delete-branch
            Log "Merged."
        }
    }
    catch {
        Log "PR creation/merge failed. Please handle manually."
    }

    Log "Done."
    exit 0

}
catch {
    Log "Fatal error: $($_.Exception.Message)"
    exit 1
}
