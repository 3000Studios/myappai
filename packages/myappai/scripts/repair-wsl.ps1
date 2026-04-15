$ErrorActionPreference = 'Stop'

Write-Host 'Stopping any stuck WSL instances...'
Get-Process wsl -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host 'Enabling required Windows features...'
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

Write-Host 'Shutting down WSL...'
wsl --shutdown

Write-Host 'Installing Ubuntu distro...'
wsl --install -d Ubuntu

Write-Host ''
Write-Host 'If Windows reports that a restart is required, reboot and then run:'
Write-Host 'wsl -l -v'
