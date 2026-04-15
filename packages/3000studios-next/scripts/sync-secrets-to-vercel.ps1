# Sync GitHub Secrets to Vercel Environment Variables
# This script reads secrets from GitHub Actions and adds them to Vercel

Write-Host "=== Syncing Secrets to Vercel ===" -ForegroundColor Cyan

$secrets = @(
    "OPENAI_API_KEY",
    "CLAUDE_API_KEY",
    "CLAUDE_ALT_KEY",
    "GEMINI_API_KEY",
    "GEMINI_ALT_KEY",
    "AI_GATEWAY_API_KEY",
    "PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "STRIPE_SECRET_KEY",
    "GOOGLE_MAPS_API_KEY",
    "MXBAI_API_KEY",
    "MXBAI_STORE_ID",
    "NEXT_PUBLIC_SITE_URL"
)

# Check if VERCEL_TOKEN is set
if (-not $env:VERCEL_TOKEN) {
    Write-Host "❌ VERCEL_TOKEN not set. Export it first:" -ForegroundColor Red
    Write-Host '$env:VERCEL_TOKEN = "your-token-here"'
    exit 1
}

Write-Host "✅ VERCEL_TOKEN found" -ForegroundColor Green
Write-Host ""

# Get list of GitHub secrets (names only)
Write-Host "Fetching GitHub secrets..." -ForegroundColor Yellow
$ghSecrets = gh secret list --json name | ConvertFrom-Json

Write-Host "Found $($ghSecrets.Count) GitHub secrets" -ForegroundColor Green
Write-Host ""

# For each secret we want to sync
foreach ($secretName in $secrets) {
    $exists = $ghSecrets | Where-Object { $_.name -eq $secretName }

    if ($exists) {
        Write-Host "📦 $secretName exists in GitHub" -ForegroundColor Cyan

        # Note: GitHub CLI doesn't expose secret values for security
        # User must manually add these to Vercel dashboard OR
        # provide them here if they have them locally

        Write-Host "   → Add this to Vercel: vercel env add $secretName production" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  $secretName NOT found in GitHub secrets" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Instructions ===" -ForegroundColor Cyan
Write-Host "To complete sync, run these commands with actual secret values:"
Write-Host ""
foreach ($secretName in $secrets) {
    Write-Host "vercel env add $secretName production --token `$env:VERCEL_TOKEN" -ForegroundColor Gray
}
Write-Host ""
Write-Host "Or use Vercel dashboard: https://vercel.com/3000studios/3000studios-next/settings/environment-variables"
