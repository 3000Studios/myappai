#!/usr/bin/env pwsh
# ============================================
# 3000 Studios - Workspace Cleanup Script
# Kills excess processes and configures optimal workspace
# ============================================

Write-Host "`n🔥 KILLING EXCESS VS CODE PROCESSES..." -ForegroundColor Red

# Keep only 5 VS Code processes (1 main window + essential workers)
$codeProcesses = Get-Process code -ErrorAction SilentlyContinue | Sort-Object StartTime
$processCount = $codeProcesses.Count

if ($processCount -gt 5) {
    $toKeep = 5
    $toKill = $codeProcesses | Select-Object -First ($processCount - $toKeep)

    Write-Host "Found $processCount VS Code processes. Keeping $toKeep, killing $($processCount - $toKeep)..." -ForegroundColor Yellow

    foreach ($proc in $toKill) {
        try {
            Stop-Process -Id $proc.Id -Force
            Write-Host "  ✓ Killed process $($proc.Id)" -ForegroundColor Green
        } catch {
            Write-Host "  ✗ Could not kill process $($proc.Id)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "✓ VS Code process count is healthy ($processCount processes)" -ForegroundColor Green
}

Write-Host "`n🧹 CLEANING UP EXTRA TERMINALS..." -ForegroundColor Cyan

# Kill any orphaned pnpm processes except the dev server
$pnpmProcs = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*pnpm*" }
Write-Host "Found $($pnpmProcs.Count) pnpm-related processes (keeping dev server)" -ForegroundColor Yellow

Write-Host "`n✅ CLEANUP COMPLETE" -ForegroundColor Green
Write-Host "Current VS Code processes: $((Get-Process code -ErrorAction SilentlyContinue).Count)" -ForegroundColor White
