param([string]$Msg)
$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "[SHADOW][$ts] $Msg" -ForegroundColor Green
