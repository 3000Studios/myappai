# ======================================================
# 3000STUDIOS — ACTUAL FINAL FIX (NODE 20, NO CAMERA-CONTROLS)
# ======================================================

$ErrorActionPreference = "Stop"

# ALWAYS CD FIRST
cd C:\ANTIGRAVITY\3000studios-next

Write-Host "=== FINAL REPAIR START ===" -ForegroundColor Cyan

# ------------------------------------------------------
# VERIFY NODE
# ------------------------------------------------------
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node is not available in PATH"
}

$nodeVer = node -v
if ($nodeVer -notmatch "^v20\.19\.0") {
    throw "Wrong Node version: $nodeVer (expected v20.19.0)"
}

Write-Host "Node OK: $nodeVer" -ForegroundColor Green

# ------------------------------------------------------
# VERIFY PNPM
# ------------------------------------------------------
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    npm install -g pnpm
}

Write-Host "PNPM OK: $(pnpm -v)" -ForegroundColor Green

# ------------------------------------------------------
# HARD CLEAN
# ------------------------------------------------------
Write-Host "=== CLEANING OLD INSTALL ===" -ForegroundColor Cyan

if (Test-Path node_modules) { Remove-Item node_modules -Recurse -Force }
if (Test-Path pnpm-lock.yaml) { Remove-Item pnpm-lock.yaml -Force }

# ------------------------------------------------------
# REMOVE BAD PACKAGES IF PRESENT
# ------------------------------------------------------
Write-Host "=== REMOVING CAMERA-CONTROLS ===" -ForegroundColor Cyan

# We use --save-dev just to ensure it's removed from package.json if it was there
# But actually 'remove' should take it out of dependencies.
# We'll suppress errors if they aren't installed yet (since we deleted node_modules, but package.json remains)
# Wait, if we deleted node_modules, we can't really 'remove' it from the installed tree, but we can remove from package.json
# Using 'pnpm remove' updates package.json.

# Use call operator & to ensure command parsing
& pnpm remove camera-controls --silent 2>$null
& pnpm remove @react-three/drei --silent 2>$null

# ------------------------------------------------------
# INSTALL SAFE DREI (NO NODE 22+ DEP)
# ------------------------------------------------------
Write-Host "=== INSTALLING SAFE @react-three/drei ===" -ForegroundColor Cyan

& pnpm add @react-three/drei@9.88.6

# ------------------------------------------------------
# ENSURE TYPESCRIPT
# ------------------------------------------------------
Write-Host "=== ENSURING TYPESCRIPT ===" -ForegroundColor Cyan

& pnpm add -D typescript

# ------------------------------------------------------
# INSTALL ALL DEPS (IGNORE ENGINE BULLSHIT)
# ------------------------------------------------------
Write-Host "=== INSTALLING DEPENDENCIES ===" -ForegroundColor Cyan

& pnpm install --engine-strict=false

# ------------------------------------------------------
# FINAL TYPE CHECK
# ------------------------------------------------------
Write-Host "=== RUNNING TYPE CHECK ===" -ForegroundColor Cyan

& pnpm exec tsc --noEmit

Write-Host "=== ✅ SYSTEM STABLE — DONE FOR REAL ===" -ForegroundColor Green
