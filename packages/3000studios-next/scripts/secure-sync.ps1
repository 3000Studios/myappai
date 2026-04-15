# Secure Git Auto-Sync Script
# Uses GitHub CLI + Windows Credential Manager for secure authentication
# No PAT exposure in environment variables

Write-Host "`n🔐 3000 Studios - Secure Git Auto-Sync`n" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verify GitHub CLI is authenticated
Write-Host "🔍 Verifying GitHub CLI authentication..." -ForegroundColor Yellow
$ghStatus = gh auth status 2>&1
if ($ghStatus -match "Logged in") {
    Write-Host "✅ GitHub CLI authenticated securely`n" -ForegroundColor Green
} else {
    Write-Host "❌ GitHub CLI not authenticated. Run: gh auth login`n" -ForegroundColor Red
    exit 1
}

# Step 1: Fetch latest changes
Write-Host "⬇️  Pulling latest changes from origin/main..." -ForegroundColor Yellow
git fetch origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to fetch from remote`n" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fetched latest changes`n" -ForegroundColor Green

# Step 2: Check for local changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ Working tree is clean. No changes to commit.`n" -ForegroundColor Green
    exit 0
}

Write-Host "📊 Changes detected:`n" -ForegroundColor Yellow
Write-Host $status
Write-Host ""

# Step 3: Stage changes
Write-Host "📦 Staging all changes..." -ForegroundColor Yellow
git add .

# Step 4: Commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Auto-sync: $timestamp"

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to commit`n" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes committed`n" -ForegroundColor Green

# Step 5: Push to remote (GitHub CLI handles auth securely)
Write-Host "⬆️  Pushing to origin/main (using secure GitHub CLI auth)..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push to remote`n" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Successfully synced with remote repository!`n" -ForegroundColor Green
Write-Host "🔒 Authentication: Secure (Windows Credential Manager)`n" -ForegroundColor Cyan
