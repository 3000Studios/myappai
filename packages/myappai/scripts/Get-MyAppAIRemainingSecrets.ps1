param(
  [switch]$CheckLive,
  [switch]$GenerateLocalSecrets,
  [switch]$WriteLocalEnv
)

$ErrorActionPreference = 'Stop'

function Get-RepoRoot {
  return (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
}

function Read-EnvFile {
  param([string]$Path)

  $values = @{}

  if (-not (Test-Path $Path)) {
    return $values
  }

  foreach ($line in Get-Content -Path $Path) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    if ($line.TrimStart().StartsWith('#')) { continue }
    $index = $line.IndexOf('=')
    if ($index -lt 1) { continue }
    $key = $line.Substring(0, $index).Trim()
    $value = $line.Substring($index + 1)
    if ($key) {
      $values[$key] = $value
    }
  }

  return $values
}

function Merge-EnvMaps {
  param([hashtable[]]$Maps)

  $merged = @{}
  foreach ($map in $Maps) {
    foreach ($key in $map.Keys) {
      $merged[$key] = $map[$key]
    }
  }
  return $merged
}

function Test-ConfiguredValue {
  param([string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) { return $false }
  if ($Value.StartsWith('replace-with-')) { return $false }
  if ($Value.StartsWith('your-')) { return $false }
  return $true
}

function New-RandomSecret {
  param([int]$Bytes = 48)

  $buffer = New-Object byte[] $Bytes
  [System.Security.Cryptography.RandomNumberGenerator]::Fill($buffer)
  return [Convert]::ToBase64String($buffer)
}

function Show-Section {
  param([string]$Title)
  Write-Host ""
  Write-Host "=== $Title ===" -ForegroundColor Cyan
}

function Get-MissingKeys {
  param(
    [hashtable]$EnvMap,
    [string[]]$Keys
  )

  $missing = @()
  foreach ($key in $Keys) {
    if (-not (Test-ConfiguredValue ([string]$EnvMap[$key]))) {
      $missing += $key
    }
  }
  return $missing
}

function Invoke-JsonGet {
  param(
    [string]$Url,
    [hashtable]$Headers = @{}
  )

  try {
    return Invoke-RestMethod -Method Get -Uri $Url -Headers $Headers
  } catch {
    return $null
  }
}

$repoRoot = Get-RepoRoot
$primaryEnvPath = Join-Path $repoRoot '.secrets\myappai.local.env'
$sharedEnvPath = Join-Path $repoRoot '.secrets\shared.local.env'

$primaryEnv = Read-EnvFile -Path $primaryEnvPath
$sharedEnv = Read-EnvFile -Path $sharedEnvPath
$envMap = Merge-EnvMaps @($sharedEnv, $primaryEnv)

$localRequired = @(
  'APP_NAME',
  'SITE_URL',
  'WWW_SITE_URL',
  'SITE_ORIGIN',
  'WWW_SITE_ORIGIN',
  'ADMIN_EMAIL',
  'ADMIN_PASSCODE',
  'ADMIN_API_KEY',
  'ADMIN_SESSION_SECRET',
  'LOGS_ACCESS_CODE',
  'JWT_SECRET',
  'LICENSE_SECRET',
  'CLOUDFLARE_PAGES_PROJECT_NAME',
  'CLOUDFLARE_PAGES_BRANCH',
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ZONE_ID',
  'GH_BASE_BRANCH',
  'GH_REPO',
  'GH_TOKEN',
  'PUBLIC_ASSISTANT_PROVIDER',
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'OLLAMA_API_URL',
  'OLLAMA_MODEL',
  'OLLAMA_PROXY_SECRET',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_WEBHOOK_URL',
  'TELEGRAM_WEBHOOK_SECRET'
)

$pagesPlainText = [ordered]@{
  APP_NAME = 'myappai'
  API_MODE = 'repo-local'
  NODE_ENV = 'production'
  SITE_URL = 'https://myappai.net'
  WWW_SITE_URL = 'https://www.myappai.net'
  SITE_ORIGIN = 'https://myappai.net'
  WWW_SITE_ORIGIN = 'https://www.myappai.net'
  GH_BASE_BRANCH = 'main'
  PUBLIC_ASSISTANT_PROVIDER = 'ollama'
  OLLAMA_MODEL = 'llama3.2:3b'
  OPENAI_MODEL = 'gpt-4o'
  CLAUDE_MODEL = 'claude-3-5-sonnet-latest'
  PAYPAL_ENV = 'live'
  R2_BUCKET_NAME = 'myappai'
  VITE_ENABLE_ADS = 'false'
}

$pagesSecrets = @(
  'ADMIN_EMAIL',
  'ADMIN_PASSCODE',
  'ADMIN_API_KEY',
  'ADMIN_SESSION_SECRET',
  'LOGS_ACCESS_CODE',
  'JWT_SECRET',
  'LICENSE_SECRET',
  'GH_REPO',
  'GH_TOKEN',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'GEMINI_API_KEY',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_WEBHOOK_URL',
  'TELEGRAM_WEBHOOK_SECRET',
  'OLLAMA_API_URL',
  'OLLAMA_PROXY_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ZONE_ID'
)

$stillExternal = @(
  'TELEGRAM_BOT_TOKEN',
  'OLLAMA_API_URL',
  'TELEGRAM_ALLOWED_CHAT_IDS',
  'R2_PUBLIC_BASE_URL',
  'R2_S3_ENDPOINT',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'UNSPLASH_ACCESS_KEY',
  'PEXELS_API_KEY',
  'PIXABAY_API_KEY',
  'STRIPE_PRICE_OPERATOR_OS',
  'STRIPE_MODE_OPERATOR_OS',
  'STRIPE_PRICE_LAUNCH_SPRINT',
  'STRIPE_MODE_LAUNCH_SPRINT',
  'STRIPE_PAYMENT_LINK_OPERATOR_OS',
  'STRIPE_PAYMENT_LINK_LAUNCH_SPRINT',
  'PAYPAL_PRICE_OPERATOR_OS_USD',
  'PAYPAL_PRICE_LAUNCH_SPRINT_USD'
)

$generatedSecrets = @(
  'ADMIN_SESSION_SECRET',
  'JWT_SECRET',
  'LICENSE_SECRET',
  'OLLAMA_PROXY_SECRET',
  'TELEGRAM_WEBHOOK_SECRET'
)

if ($GenerateLocalSecrets) {
  $generated = [ordered]@{}
  foreach ($key in $generatedSecrets) {
    if (-not (Test-ConfiguredValue ([string]$envMap[$key]))) {
      $generated[$key] = New-RandomSecret
      $envMap[$key] = $generated[$key]
    }
  }

  if ($generated.Count -gt 0) {
    Show-Section 'Generated Local Secrets'
    $generated.Keys | ForEach-Object { Write-Host $_ }

    if ($WriteLocalEnv) {
      $lines = @()
      foreach ($key in $generated.Keys) {
        $lines += "$key=$($generated[$key])"
      }
      Add-Content -Path $primaryEnvPath -Value ("`r`n" + ($lines -join "`r`n"))
      Write-Host "Appended generated secrets to $primaryEnvPath" -ForegroundColor Green
    } else {
      Write-Host 'Run again with -WriteLocalEnv to append them to .secrets/myappai.local.env.' -ForegroundColor Yellow
    }
  }
}

Show-Section 'Local Required Status'
$missingLocal = Get-MissingKeys -EnvMap $envMap -Keys $localRequired
if ($missingLocal.Count -eq 0) {
  Write-Host 'All required local values are configured.' -ForegroundColor Green
} else {
  $missingLocal | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
}

Show-Section 'Cloudflare Pages Plain Text'
foreach ($key in $pagesPlainText.Keys) {
  $configured = Test-ConfiguredValue ([string]$envMap[$key])
  $status = if ($configured) { 'configured locally' } else { 'set this in Pages' }
  Write-Host ("{0} = {1} [{2}]" -f $key, $pagesPlainText[$key], $status)
}

Show-Section 'Cloudflare Pages Secrets'
$missingPagesSecrets = Get-MissingKeys -EnvMap $envMap -Keys $pagesSecrets
if ($missingPagesSecrets.Count -eq 0) {
  Write-Host 'Every tracked Pages secret has a local source value.' -ForegroundColor Green
} else {
  $missingPagesSecrets | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
}

Show-Section 'Still External Or Optional'
foreach ($key in $stillExternal) {
  $status = if (Test-ConfiguredValue ([string]$envMap[$key])) { 'present' } else { 'missing' }
  Write-Host ("{0}: {1}" -f $key, $status)
}

if (Test-ConfiguredValue ([string]$envMap['GH_TOKEN'])) {
  Show-Section 'GitHub Check'
  $headers = @{
    Authorization = "Bearer $($envMap['GH_TOKEN'])"
    Accept = 'application/vnd.github+json'
    'X-GitHub-Api-Version' = '2022-11-28'
    'User-Agent' = 'myappai-env-audit'
  }
  $user = Invoke-JsonGet -Url 'https://api.github.com/user' -Headers $headers
  if ($null -ne $user) {
    Write-Host ("Authenticated as GitHub user: {0}" -f $user.login) -ForegroundColor Green
  } else {
    Write-Host 'GitHub token check failed.' -ForegroundColor Yellow
  }
}

if (Test-ConfiguredValue ([string]$envMap['CLOUDFLARE_API_TOKEN'])) {
  Show-Section 'Cloudflare Check'
  $cfHeaders = @{
    Authorization = "Bearer $($envMap['CLOUDFLARE_API_TOKEN'])"
  }
  $verify = Invoke-JsonGet -Url 'https://api.cloudflare.com/client/v4/user/tokens/verify' -Headers $cfHeaders
  if ($null -ne $verify -and $verify.success) {
    Write-Host 'Cloudflare API token verified.' -ForegroundColor Green
  } else {
    Write-Host 'Cloudflare API token check failed.' -ForegroundColor Yellow
  }
}

if (Test-ConfiguredValue ([string]$envMap['TELEGRAM_BOT_TOKEN'])) {
  Show-Section 'Telegram Check'
  $telegram = Invoke-JsonGet -Url ("https://api.telegram.org/bot{0}/getMe" -f $envMap['TELEGRAM_BOT_TOKEN'])
  if ($null -ne $telegram -and $telegram.ok) {
    Write-Host ("Telegram bot: @{0}" -f $telegram.result.username) -ForegroundColor Green
  } else {
    Write-Host 'Telegram bot token check failed.' -ForegroundColor Yellow
  }
}

if ($CheckLive) {
  Show-Section 'Live Endpoint Check'
  foreach ($url in @(
    'https://myappai.net/api/public/telegram/status',
    'https://myappai.net/api/ollama/status'
  )) {
    try {
      $response = Invoke-WebRequest -Uri $url -Method Get
      Write-Host $url -ForegroundColor Green
      Write-Host $response.Content
    } catch {
      Write-Host $url -ForegroundColor Yellow
      if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        Write-Host ($reader.ReadToEnd())
      } else {
        Write-Host $_.Exception.Message
      }
    }
  }
}
