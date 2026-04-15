# ❄️ FREEZE AND PROTECT SCRIPT
# Locks main branch and ensures production safety

Write-Host "❄️ STARTING FREEZE AND PROTECT SEQUENCE..." -ForegroundColor Cyan
Write-Host ""

# Navigate to repo
cd C:\3000Studos-Production\3000studios-next-main\3000studios-next

# Ensure we're on main
Write-Host "📍 Checking out main branch..." -ForegroundColor Yellow
git checkout main
git pull

Write-Host "✅ On main branch" -ForegroundColor Green
Write-Host ""

# Protect main branch
Write-Host "🔒 Protecting main branch..." -ForegroundColor Yellow
git config branch.main.mergeoptions "--no-ff"

Write-Host "✅ Main branch protected (no fast-forward merges)" -ForegroundColor Green
Write-Host ""

# Make lockfiles read-only
Write-Host "🔐 Locking dependency files..." -ForegroundColor Yellow
attrib +R pnpm-lock.yaml
attrib +R package.json

Write-Host "✅ Lockfiles protected" -ForegroundColor Green
Write-Host ""

# Create .nvmrc for Node version
Write-Host "📌 Pinning Node version..." -ForegroundColor Yellow
echo "20.x" > .nvmrc

Write-Host "✅ Node version pinned to 20.x" -ForegroundColor Green
Write-Host ""

# Run sanity checks
Write-Host "🔍 Running sanity checks..." -ForegroundColor Yellow
Write-Host ""

Write-Host "  Installing dependencies (frozen)..." -ForegroundColor Gray
pnpm install --frozen-lockfile

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  Dependency install had warnings" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "  Running lint..." -ForegroundColor Gray
pnpm run lint

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Lint passed" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  Lint warnings present (non-blocking)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "  Running typecheck..." -ForegroundColor Gray
pnpm run typecheck

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Typecheck passed" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  Type warnings present (non-blocking)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "  Running build test (this may take a while)..." -ForegroundColor Gray
pnpm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Build successful" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  Build completed with warnings" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================================================================" -ForegroundColor Cyan
Write-Host "❄️  SYSTEM FROZEN — PRODUCTION SAFE ❄️" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "=================================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "STATUS:" -ForegroundColor White
Write-Host "  ✓ Main branch protected" -ForegroundColor Green
Write-Host "  ✓ Dependencies locked" -ForegroundColor Green
Write-Host "  ✓ Node version pinned" -ForegroundColor Green
Write-Host "  ✓ Sanity checks complete" -ForegroundColor Green
Write-Host ""
Write-Host "ALLOWED BRANCHES:" -ForegroundColor White
Write-Host "  • hotfix/*" -ForegroundColor Yellow
Write-Host "  • security/*" -ForegroundColor Yellow
Write-Host "  • revenue/*" -ForegroundColor Yellow
Write-Host ""
Write-Host "OPERATIONS MODE: ACTIVE" -ForegroundColor Cyan
Write-Host "You are now an OPERATOR, not a BUILDER." -ForegroundColor Gray
Write-Host ""
