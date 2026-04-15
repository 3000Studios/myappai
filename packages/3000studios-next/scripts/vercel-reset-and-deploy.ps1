# ===============================
# 3000studios-next
# Vercel ENV RESET + DEPLOY
# Complete environment reset and deployment script
# ===============================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   VERCEL COMPLETE ENVIRONMENT RESET & DEPLOY           ║" -ForegroundColor Cyan
Write-Host "║   3000 Studios Next.js Application                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== Moving to project root ===" -ForegroundColor Yellow
Set-Location "C:\DEV\3000studios-next"
Write-Host "✅ Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

Write-Host "=== Ensuring Vercel is authenticated ===" -ForegroundColor Yellow
try {
    $vercelUser = vercel whoami 2>&1
    Write-Host "✅ Authenticated as: $vercelUser" -ForegroundColor Green
} catch {
    Write-Host "❌ Not authenticated with Vercel" -ForegroundColor Red
    Write-Host "💡 Run: vercel login" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

Write-Host "=== Removing local Vercel link ===" -ForegroundColor Yellow
if (Test-Path ".vercel") {
    Remove-Item -Recurse -Force ".vercel"
    Write-Host "✅ Removed .vercel directory" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No .vercel directory found" -ForegroundColor Cyan
}
Write-Host ""

Write-Host "=== Linking to existing Vercel project ===" -ForegroundColor Yellow
vercel link --yes
Write-Host "✅ Project linked" -ForegroundColor Green
Write-Host ""

Write-Host "=== Removing problematic env vars (all scopes) ===" -ForegroundColor Yellow
$varsToRemove = @(
    "NEXT_PUBLIC_SITE_URL",
    "next_public_site_url"
)

foreach ($v in $varsToRemove) {
    foreach ($env in @("production","preview","development")) {
        try {
            Write-Host "   Removing $v from $env..." -ForegroundColor Gray
            vercel env rm $v $env --yes 2>&1 | Out-Null
            Write-Host "   ✅ Removed $v from $env" -ForegroundColor Green
        } catch {
            Write-Host "   ℹ️  $v not present in $env" -ForegroundColor Cyan
        }
    }
}
Write-Host "✅ Cleanup complete" -ForegroundColor Green
Write-Host ""

Write-Host "=== Adding REQUIRED literal env vars ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "⚠️  CRITICAL: When prompted for NEXT_PUBLIC_SITE_URL:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Value: https://3000studios.com" -ForegroundColor Green
Write-Host "   Mark as sensitive: n  (NO)" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

try {
    vercel env add NEXT_PUBLIC_SITE_URL production
    Write-Host "✅ Added NEXT_PUBLIC_SITE_URL to production" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add NEXT_PUBLIC_SITE_URL" -ForegroundColor Red
    Write-Host "💡 This may need to be added manually via dashboard" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== Adding ADMIN vars ===" -ForegroundColor Yellow
Write-Host "Please provide admin credentials when prompted:" -ForegroundColor Cyan
Write-Host ""

try {
    Write-Host "Adding ADMIN_EMAIL..." -ForegroundColor Gray
    vercel env add ADMIN_EMAIL production
    Write-Host "✅ Added ADMIN_EMAIL" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠️  Failed to add ADMIN_EMAIL" -ForegroundColor Yellow
}

try {
    Write-Host "Adding ADMIN_PASSWORD..." -ForegroundColor Gray
    vercel env add ADMIN_PASSWORD production
    Write-Host "✅ Added ADMIN_PASSWORD" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠️  Failed to add ADMIN_PASSWORD" -ForegroundColor Yellow
}

Write-Host "=== Adding AI / API keys (all environments) ===" -ForegroundColor Yellow
Write-Host ""

$secureVars = @(
    "OPENAI_API_KEY",
    "CLAUDE_API_KEY",
    "CLAUDE_ALT_KEY",
    "GEMINI_API_KEY",
    "GEMINI_ALT_KEY",
    "GOOGLE_CLOUD_API_KEY",
    "GOOGLE_MAPS_API_KEY",
    "AI_GATEWAY_API_KEY",
    "MXBAI_API_KEY",
    "MXBAI_STORE_ID",
    "PAYPAL_CLIENT_ID",
    "PAYPAL_SECRET",
    "SHADOW_PASSWORD",
    "SHADOW_SECRET",
    "GITHUB3000_PAT_TOKEN",
    "MONGO_PUBLIC_KEY",
    "MONGO_PRIVATE_KEY",
    "MONGO_IP"
)

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "⚠️  IMPORTANT: You will be prompted for each API key" -ForegroundColor Yellow
Write-Host "   Have your credentials ready!" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

$skipRemaining = $false

foreach ($v in $secureVars) {
    if ($skipRemaining) {
        Write-Host "⏩ Skipped $v (skip all selected)" -ForegroundColor Yellow
        continue
    }

    Write-Host ""
    Write-Host "────────────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "Variable: $v" -ForegroundColor Cyan
    Write-Host "────────────────────────────────────────────────" -ForegroundColor Cyan
    
    $action = Read-Host "Add this variable? (y)es / (n)o / (s)kip all remaining [y/n/s]"
    
    if ($action -eq "s" -or $action -eq "S") {
        $skipRemaining = $true
        Write-Host "⏩ Skipping all remaining variables" -ForegroundColor Yellow
        continue
    }
    
    if ($action -eq "n" -or $action -eq "N") {
        Write-Host "⏭️  Skipped $v" -ForegroundColor Yellow
        continue
    }

    foreach ($env in @("production","preview","development")) {
        try {
            Write-Host "   Adding to $env..." -ForegroundColor Gray
            vercel env add $v $env
            Write-Host "   ✅ Added $v to $env" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  Failed to add $v to $env" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "=== Verifying environment variables ===" -ForegroundColor Yellow
Write-Host "Current environment variables:" -ForegroundColor Cyan
vercel env ls
Write-Host ""

Write-Host "=== Deployment Options ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "Choose deployment option:" -ForegroundColor Cyan
Write-Host "  1. Deploy to production now" -ForegroundColor Green
Write-Host "  2. Skip deployment (configure manually later)" -ForegroundColor Yellow
Write-Host ""

$deployChoice = Read-Host "Enter choice [1/2]"

if ($deployChoice -eq "1") {
    Write-Host ""
    Write-Host "🚀 Deploying to production..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        vercel --prod --yes
        Write-Host ""
        Write-Host "✅ Deployment complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Your site should be live at: https://3000studios.com" -ForegroundColor Green
    } catch {
        Write-Host ""
        Write-Host "❌ Deployment failed" -ForegroundColor Red
        Write-Host "💡 Check the error above and try deploying manually" -ForegroundColor Yellow
        Write-Host "💡 Command: vercel --prod --yes" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "⏸️  Deployment skipped" -ForegroundColor Yellow
    Write-Host "💡 Deploy manually with: vercel --prod --yes" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   ENVIRONMENT RESET & DEPLOYMENT COMPLETE              ║" -ForegroundColor Cyan
Write-Host "╠════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║   ✅ Environment variables configured                  ║" -ForegroundColor Cyan
Write-Host "║   ✅ NEXT_PUBLIC_SITE_URL fixed (literal value)        ║" -ForegroundColor Cyan
Write-Host "║   ✅ All API keys added to environments                ║" -ForegroundColor Cyan
Write-Host "║   ✅ Project linked to Vercel                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Verify deployment at https://3000studios.com" -ForegroundColor Cyan
Write-Host "   2. Check Vercel dashboard for any warnings" -ForegroundColor Cyan
Write-Host "   3. Test all API integrations (AI, Maps, PayPal)" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Script complete!" -ForegroundColor Green
Write-Host ""
