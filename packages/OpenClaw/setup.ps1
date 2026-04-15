# OpenClaw Setup Script
# Run this in PowerShell as Administrator
# Usage: .\setup.ps1

param(
[switch]$Clean,
[switch]$SkipOllama
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OpenClaw Setup Script" -ForegroundColor Cyan
Write-Host "  3000Studios / myappai.net" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
Write-Host "ERROR: Please run PowerShell as Administrator" -ForegroundColor Red
exit 1
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
$nodeVersion = node --version
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
} catch {
Write-Host "ERROR: Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
exit 1
}

# Check Ollama
if (-not $SkipOllama) {
Write-Host "Checking Ollama..." -ForegroundColor Yellow
try {
    $ollamaStatus = Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/tags" -Method GET -ErrorAction Stop
    Write-Host "Ollama: Running" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Ollama not responding at http://127.0.0.1:11434" -ForegroundColor Yellow
    Write-Host "Start Ollama before running OpenClaw" -ForegroundColor Yellow
}
}

# Clean install if requested or if openclaw exists
if ($Clean) {
Write-Host ""
Write-Host "Cleaning existing install..." -ForegroundColor Yellow

taskkill /F /IM node.exe 2>$null
taskkill /F /IM openclaw.exe 2>$null
Start-Sleep -Seconds 2

$npmModules = "$env:APPDATA
pm
ode_modules"
Remove-Item -Recurse -Force "$npmModules\openclaw" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$npmModules\.openclaw-*" -ErrorAction SilentlyContinue

npm cache clean --force
Write-Host "Clean complete" -ForegroundColor Green
}

# Install OpenClaw
Write-Host ""
Write-Host "Installing OpenClaw..." -ForegroundColor Yellow
npm install -g openclaw@latest

if ($LASTEXITCODE -ne 0) {
Write-Host "ERROR: npm install failed. Try running with -Clean flag" -ForegroundColor Red
exit 1
}

Write-Host "OpenClaw installed" -ForegroundColor Green

# Onboard
Write-Host ""
Write-Host "Running onboard..." -ForegroundColor Yellow
openclaw onboard --install-daemon

# Copy config template if no config exists
$configPath = "$env:APPDATA\openclaw\config.yaml"
$templatePath = Join-Path $PSScriptRoot "config.template.yaml"

if (-not (Test-Path $configPath) -and (Test-Path $templatePath)) {
Write-Host ""
Write-Host "Copying config template..." -ForegroundColor Yellow
$configDir = Split-Path $configPath
New-Item -ItemType Directory -Force -Path $configDir | Out-Null
Copy-Item $templatePath $configPath
Write-Host "Config copied to: $configPath" -ForegroundColor Green
Write-Host "Edit config.yaml to add your API keys" -ForegroundColor Yellow
}

# Start gateway
Write-Host ""
Write-Host "Starting OpenClaw gateway..." -ForegroundColor Yellow
openclaw gateway start

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "  Dashboard: http://127.0.0.1:18789/" -ForegroundColor Cyan
Write-Host "  Remote:    https://openclaw.myappai.net" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
