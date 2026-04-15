Write-Host "Repairing known issues..."

# Stripe API version hard fix
$stripeFiles = Get-ChildItem app -Recurse -Filter "route.ts"
foreach ($f in $stripeFiles) {
  (Get-Content $f) -replace '"apiVersion":\s*".*?"',
  '"apiVersion": "2025-11-17.clover"' | Set-Content $f
}

Write-Host "Stripe fixed"
