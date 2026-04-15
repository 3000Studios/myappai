$required = @(
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "ELEVENLABS_API_KEY"
)

foreach ($v in $required) {
  if (-not (Get-Item "Env:$v" -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Missing ENV: $v"
    exit 1
  }
}

Write-Host "✔ ENV VALIDATED"
