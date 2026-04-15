$vercel = @{
  redirects = @(
    @{
      source = "/(.*)"
      has = @(@{ type = "host"; value = "www.3000studios.com" })
      destination = "https://3000studios.com/{path}"
      permanent = $true
    }
  )
  crons = @(
    @{ path="/api/revenue/status"; schedule="0 */6 * * *" },
    @{ path="/api/automation/blog"; schedule="0 */8 * * *" },
    @{ path="/api/automation/product"; schedule="0 */12 * * *" }
  )
}

$vercel | ConvertTo-Json -Depth 10 | Set-Content vercel.json
