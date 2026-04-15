pnpm install
pnpm run build
git add .
git commit -m "autopilot deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push
Write-Host "✅ Autopilot deployment complete"
