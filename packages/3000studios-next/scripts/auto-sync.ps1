# Git Auto-Sync Script for 3000 Studios Next
# This script pulls latest changes, commits local changes, and pushes to GitHub

Write-Host "🚀 3000 Studios - Git Auto-Sync" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check git status
Write-Host "📊 Checking git status..." -ForegroundColor Yellow
git status

# Step 2: Pull latest changes
Write-Host ""
Write-Host "⬇️  Pulling latest changes from remote..." -ForegroundColor Yellow
git pull origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error pulling changes. Please resolve conflicts manually." -ForegroundColor Red
    exit 1
}

# Step 3: Stage all changes
Write-Host ""
Write-Host "📦 Staging all changes..." -ForegroundColor Yellow
git add .

# Step 4: Check if there are changes to commit
$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "✅ No changes to commit. Working tree is clean." -ForegroundColor Green
    exit 0
}

# Step 5: Commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Auto-sync: $timestamp - Updated contact page with Google Maps integration"

Write-Host ""
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error committing changes." -ForegroundColor Red
    exit 1
}

# Step 6: Push to remote
Write-Host ""
Write-Host "⬆️  Pushing changes to remote..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error pushing changes." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Successfully synced with remote repository!" -ForegroundColor Green
Write-Host ""
