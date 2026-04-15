# ======================================================
# 3000STUDIOS — NUCLEAR NODE / PNPM REPAIR (FINAL)
# ======================================================

$ErrorActionPreference = "Stop"

# ALWAYS CD FIRST
cd C:\ANTIGRAVITY\3000studios-next

Write-Host "=== STOPPING NODE-RELATED PROCESSES ===" -ForegroundColor Cyan
Get-Process node, npm, pnpm -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "=== REMOVING ALL NODE / NPM / PNPM / NVM TRACES ===" -ForegroundColor Cyan

$pathsToRemove = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs",
    "$env:LOCALAPPDATA\Programs\nodejs",
    "$env:APPDATA\npm",
    "$env:APPDATA\npm-cache",
    "$env:LOCALAPPDATA\npm-cache",
    "$env:LOCALAPPDATA\nvm",
    "C:\ProgramData\nvm"
)

foreach ($p in $pathsToRemove) {
    if (Test-Path $p) {
        Write-Host "Removing $p"
        Remove-Item $p -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# ------------------------------------------------------
# CLEAN PATH (SYSTEM + USER)
# ------------------------------------------------------
function Clean-Path {
    param ($scope)
    $path = [Environment]::GetEnvironmentVariable("PATH", $scope)
    $clean = ($path -split ';' | Where-Object {
            $_ -and ($_ -notmatch "nodejs|npm|nvm")
        }) -join ';'
    [Environment]::SetEnvironmentVariable("PATH", $clean, $scope)
}

Clean-Path "Machine"
Clean-Path "User"

# Disable App Execution Aliases (node hijack)
$aliasKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\App Paths"
Remove-Item "$aliasKey\node.exe" -Force -ErrorAction SilentlyContinue
Remove-Item "$aliasKey\npm.exe" -Force -ErrorAction SilentlyContinue

# ------------------------------------------------------
# INSTALL NODE (OFFICIAL, CLEAN)
# ------------------------------------------------------
Write-Host "=== INSTALLING NODE 20.19.0 CLEAN ===" -ForegroundColor Cyan

$msi = "$env:TEMP\node-20.19.0-x64.msi"
Invoke-WebRequest `
    -Uri "https://nodejs.org/dist/v20.19.0/node-v20.19.0-x64.msi" `
    -OutFile $msi

Start-Process msiexec.exe `
    -ArgumentList "/i `"$msi`" /qn /norestart" `
    -Wait

Remove-Item $msi -Force

# ------------------------------------------------------
# HARD PATH REBIND
# ------------------------------------------------------
$nodeDir = "C:\Program Files\nodejs"
$machinePath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
[Environment]::SetEnvironmentVariable(
    "PATH",
    "$machinePath;$nodeDir",
    "Machine"
)

# Refresh current shell
$env:PATH = "$nodeDir;$env:PATH"

# ------------------------------------------------------
# VALIDATE
# ------------------------------------------------------
if (-not (Test-Path "$nodeDir\node.exe")) {
    throw "node.exe still missing after clean install"
}

$nodeVersion = & "$nodeDir\node.exe" -v
if ($nodeVersion -notmatch "20\.19\.0") {
    throw "Node version mismatch: $nodeVersion"
}

Write-Host "NODE OK: $nodeVersion" -ForegroundColor Green

# ------------------------------------------------------
# INSTALL PNPM (NOW IT WILL WORK)
# ------------------------------------------------------
Write-Host "=== INSTALLING PNPM ===" -ForegroundColor Cyan
& "$nodeDir\node.exe" "$nodeDir\node_modules\npm\bin\npm-cli.js" install -g pnpm

# ------------------------------------------------------
# PROJECT INSTALL + TYPECHECK
# ------------------------------------------------------
Write-Host "=== INSTALLING PROJECT DEPENDENCIES ===" -ForegroundColor Cyan
# Run install using the new pnpm directly found in the path or via node if needed, 
# but pnpm install -g usually puts it in APPDATA/npm or Program Files/nodejs/pnpm depending on config.
# Since we just installed fresh node, 'npm install -g pnpm' puts it in the prefix location.
# Windows installer default prefix is C:\Program Files\nodejs

$pnpmPath = "$nodeDir\pnpm.cmd"
if (-not (Test-Path $pnpmPath)) {
    # Try finding it in APPDATA/npm if not in nodejs dir
    $pnpmPath = "$env:APPDATA\npm\pnpm.cmd"
}

if (Test-Path $pnpmPath) {
    & $pnpmPath install
    Write-Host "=== RUNNING TYPE CHECK ===" -ForegroundColor Cyan
    & $pnpmPath run type-check | Tee-Object type-check.log
}
else {
    Write-Host "⚠️ Could not locate pnpm.cmd after install. Attempting generic 'pnpm' command..." -ForegroundColor Yellow
    pnpm install
    pnpm run type-check | Tee-Object type-check.log
}

Write-Host "=== ✅ SYSTEM FULLY REPAIRED ===" -ForegroundColor Green
