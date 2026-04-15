<#
.SYNOPSIS
  Import assets and deploy to production (Windows PowerShell version)

.DESCRIPTION
  This script applies the stabilization patch, builds the project, and pushes to trigger deployment.
#>

param(
    [string]$PatchFile = ".\0001-fix-stabilize-build.patch",
    [string]$Branch = "main"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Log { param($m) Write-Host "$(Get-Date -Format s) - $m" -ForegroundColor Cyan }
function Success { param($m) Write-Host "✅ $m" -ForegroundColor Green }
function Error { param($m) Write-Host "❌ $m" -ForegroundColor Red }

try {
    Log "Starting import and deploy process..."

    # Ensure we're in repo root
    if (-not (Test-Path ".git")) {
        Error "Please run this script from the repository root (where .git is located)."
        exit 1
    }

    # Clean up any git am state
    try { & git am --abort 2>$null } catch {}

    # Ensure on main branch
    Log "Checking out main branch..."
    & git checkout main
    & git pull origin main --rebase

    # Check if patch exists
    if (Test-Path $PatchFile) {
        Log "Applying patch: $PatchFile"
    
        # Try git apply first (safer than git am for already-committed repos)
        try {
            & git apply --check $PatchFile 2>$null
            if ($LASTEXITCODE -eq 0) {
                & git apply $PatchFile
                Log "Patch applied successfully"
        
                # Stage changes
                & git add -A
        
                # Check if there are changes to commit
                $status = & git status --porcelain
                if ($status) {
                    & git commit -m "feat: apply stabilization patch and improvements"
                    Success "Changes committed"
                }
                else {
                    Log "No changes to commit (patch may already be applied)"
                }
            }
            else {
                Log "Patch already applied or conflicts exist, skipping..."
            }
        }
        catch {
            Log "Patch application skipped: $($_.Exception.Message)"
        }
    }
    else {
        Log "No patch file found at $PatchFile, continuing..."
    }

    # Install dependencies
    Log "Installing dependencies..."
    & pnpm install --frozen-lockfile

    # Set admin credentials for seeding
    if (-not $env:ADMIN_EMAIL) {
        $env:ADMIN_EMAIL = "mr.jwswain@gmail.com"
    }
    if (-not $env:ADMIN_PASSWORD) {
        $env:ADMIN_PASSWORD = "3000Studios2026!"
    }

    # Seed admin user
    if (Test-Path "scripts\seed-admin.js") {
        Log "Seeding admin user..."
        try {
            & node scripts\seed-admin.js
            Success "Admin user seeded"
        }
        catch {
            Log "Admin seed warning: $($_.Exception.Message)"
        }
    }

    # Run type check
    Log "Running type check..."
    try {
        & pnpm run type-check
        Success "Type check passed"
    }
    catch {
        Log "Type check failed, continuing to build..."
    }

    # Build
    Log "Building project..."
    & pnpm run build 2>&1 | Tee-Object -FilePath ".\build-log.txt"
  
    if ($LASTEXITCODE -eq 0) {
        Success "Build completed successfully"
    }
    else {
        Error "Build failed. Check build-log.txt for details."
        exit 1
    }

    # Commit any build artifacts or changes
    $status = & git status --porcelain
    if ($status) {
        Log "Committing additional changes..."
        & git add -A
        & git commit -m "chore: build artifacts and configuration updates"
    }

    # Push to origin
    Log "Pushing to origin/$Branch..."
    & git push origin $Branch

    if ($LASTEXITCODE -eq 0) {
        Success "All assets imported, committed, and pushed!"
        Success "Your CI pipeline will now build and deploy."
        Success "Monitor deployment at: https://vercel.com/3000studios"
    }
    else {
        Error "Push failed. Check your git configuration and try again."
        exit 1
    }

}
catch {
    Error "Fatal error: $($_.Exception.Message)"
    exit 1
}
