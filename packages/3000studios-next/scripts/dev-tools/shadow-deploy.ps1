# ============================================================
# SHADOW DEPLOYMENT ORCHESTRATOR
# Self-Healing • Auto-Fix • Voice-Ready
# ============================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ROOT = "C:\DEV\3000studios-next"
$LOG  = "$ROOT\shadow-deploy.log"

cd $ROOT

function Log($msg) {
  $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  "$ts | $msg" | Tee-Object -FilePath $LOG -Append
}

function Fix-StripeApiVersion {
  Log "Applying Stripe auto-fix..."
  $path = "app/api/webhooks/stripe/route.ts"
  if (Test-Path $path) {
    (Get-Content $path -Raw) `
      -replace 'apiVersion:\s*".*?"', '' |
      Set-Content $path -Encoding UTF8
  }
}

function Fix-AliasPaths {
  Log "Fixing path alias resolution..."
  if (!(Test-Path "tsconfig.json")) { return }
  $ts = Get-Content tsconfig.json -Raw | ConvertFrom-Json
  $ts.compilerOptions.baseUrl = "."
  $ts.compilerOptions.paths = @{ "@/*" = @("/*") }
  $ts | ConvertTo-Json -Depth 10 | Set-Content tsconfig.json -Encoding UTF8
}

function Run-Build {
  try {
    Log "Running clean build..."
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    npm run build
    return $true
  } catch {
    Log "Build failed: $($_.Exception.Message)"
    return $false
  }
}

function Analyze-And-Fix {
  $logText = Get-Content $LOG -Raw

  if ($logText -match "stripe.*apiVersion") {
    Fix-StripeApiVersion
  }

  if ($logText -match "Can't resolve '@/") {
    Fix-AliasPaths
  }
}

# ======================
# DEPLOY LOOP
# ======================
Log "=== SHADOW DEPLOY INIT ==="

for ($i = 1; $i -le 5; $i++) {
  Log "DEPLOY ATTEMPT $i"

  if (Run-Build) {
    Log "Build successful"
    git add .
    git commit -m "chore: shadow auto-fix deploy" -ErrorAction SilentlyContinue
    git push
    vercel --prod --yes
    Log "DEPLOY COMPLETE"
    exit 0
  }

  Analyze-And-Fix
  Log "Auto-fix applied, retrying..."
}

Log "DEPLOY FAILED AFTER AUTO-REPAIR"
exit 1
