@echo off
REM Vercel Environment Fix - Batch Launcher
REM This bypasses PowerShell execution policy issues

echo.
echo ========================================
echo   VERCEL ENVIRONMENT VARIABLE FIX
echo ========================================
echo.

cd /d "%~dp0.."

echo Running PowerShell fix script...
echo.

PowerShell -ExecutionPolicy Bypass -File "%~dp0fix-vercel-env.ps1"

echo.
echo ========================================
echo   Script Complete
echo ========================================
echo.

pause
