$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "🔍 SANITY CHECK START" -ForegroundColor Cyan
Write-Host ""

Write-Host "▶ Node Version" -ForegroundColor Yellow
node -v

Write-Host ""
Write-Host "▶ PNPM Version" -ForegroundColor Yellow
pnpm -v

Write-Host ""
Write-Host "▶ Git Cleanliness" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "▶ App Router Check" -ForegroundColor Yellow
if (!(Test-Path "app/layout.tsx")) { 
    throw "❌ Missing app/layout.tsx" 
}
else {
    Write-Host "  ✅ app/layout.tsx exists" -ForegroundColor Green
}

if (!(Test-Path "app/page.tsx")) { 
    throw "❌ Missing app/page.tsx" 
}
else {
    Write-Host "  ✅ app/page.tsx exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "▶ Orphan Files Check" -ForegroundColor Yellow
$orphans = Get-ChildItem -Recurse -Include *.js -ErrorAction SilentlyContinue | 
Where-Object { $_.FullName -notmatch "app|components|lib|scripts|node_modules|.next" }

if ($orphans) {
    Write-Host "  ⚠️  Found orphan .js files:" -ForegroundColor Yellow
    $orphans | ForEach-Object { Write-Host "    - $($_.FullName)" -ForegroundColor Gray }
}
else {
    Write-Host "  ✅ No orphan files" -ForegroundColor Green
}

Write-Host ""
Write-Host "▶ ENV CHECK" -ForegroundColor Yellow
if (!(Test-Path ".env.local")) { 
    Write-Host "  ⚠️  .env.local missing (optional)" -ForegroundColor Yellow
}
else {
    Write-Host "  ✅ .env.local exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ SANITY CHECK COMPLETE" -ForegroundColor Green
Write-Host ""
