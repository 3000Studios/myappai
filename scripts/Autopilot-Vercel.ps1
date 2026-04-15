# Autopilot-Vercel.ps1
# One-shot: merge all remote branches -> main -> vercel deploy --prod -> recheck -> optional second pass -> final report
# Usage (PowerShell 7+ recommended):
#   pwsh -ExecutionPolicy Bypass -File .\Autopilot-Vercel.ps1 -RepoPath "C:\DEV\3000studios-next"
#
# One-time prereq (must be done once because Vercel auth/link can require interaction):
#   vercel login
#   vercel link

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$RepoPath = (Get-Location).Path,

    [Parameter(Mandatory = $false)]
    [string]$IntegrationBranch = "integration/autopilot",

    # If conflicts happen, prefer incoming branch changes ("theirs")
    [Parameter(Mandatory = $false)]
    [switch]$PreferTheirs = $true
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Log([string]$Msg) {
    $ts = Get-Date -Format "HH:mm:ss"
    Write-Host ""
    Write-Host "[$ts] $Msg"
}

function Require-Cmd([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Missing required command: $Name"
    }
}

function Timestamp() {
    return (Get-Date -Format "yyyyMMdd-HHmmss")
}

function Git-Root([string]$Path) {
    Push-Location $Path
    try {
        $root = (& git rev-parse --show-toplevel 2>$null).Trim()
        if (-not $root) { throw "Not a git repository: $Path" }
        return $root
    }
    finally {
        Pop-Location
    }
}

function Find-AppRoot([string]$Root) {
    # Finds the most likely app root by scoring package.json files.
    # No guessing: it reads package.json content and picks the highest score.
    $excludeDirs = @("node_modules", ".git", ".next", "dist", "build", "out", ".vercel")
    $pkgFiles = Get-ChildItem -Path $Root -Recurse -File -Filter "package.json" -ErrorAction SilentlyContinue |
    Where-Object {
        $p = $_.FullName
        foreach ($d in $excludeDirs) {
            if ($p -match [regex]::Escape("$d\")) { return $false }
        }
        return $true
    }

    if (-not $pkgFiles -or $pkgFiles.Count -eq 0) {
        throw "No package.json found under: $Root"
    }

    $best = $null
    foreach ($f in $pkgFiles) {
        try {
            $json = Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
            $deps = @{}
            if ($json.dependencies) { $json.dependencies.psobject.Properties | ForEach-Object { $deps[$_.Name] = $_.Value } }
            if ($json.devDependencies) { $json.devDependencies.psobject.Properties | ForEach-Object { $deps[$_.Name] = $_.Value } }

            $score = 0
            if ($deps.ContainsKey("next")) { $score += 1000 }
            if ($deps.ContainsKey("react")) { $score += 50 }
            if ($deps.ContainsKey("@vercel/analytics")) { $score += 10 }
            if ($json.scripts -and $json.scripts.build) { $score += 20 }
            if ($json.scripts -and $json.scripts.lint) { $score += 5 }
            if ($json.scripts -and $json.scripts.typecheck) { $score += 5 }

            if (-not $best -or $score -gt $best.Score) {
                $best = [pscustomobject]@{ File = $f.FullName; Dir = (Split-Path $f.FullName -Parent); Score = $score; Name = ($json.name ?? "(no-name)") }
            }
        }
        catch {
            continue
        }
    }

    if (-not $best) { throw "Could not parse any package.json files." }
    return $best.Dir
}

function Detect-PackageManager([string]$AppRoot) {
    if (Test-Path (Join-Path $AppRoot "pnpm-lock.yaml")) { return "pnpm" }
    if (Test-Path (Join-Path $AppRoot "yarn.lock")) { return "yarn" }
    if (Test-Path (Join-Path $AppRoot "bun.lockb")) { return "bun" }
    if (Test-Path (Join-Path $AppRoot "package-lock.json")) { return "npm" }
    return "npm"
}

function Ensure-PackageManager([string]$Mgr) {
    switch ($Mgr) {
        "pnpm" {
            if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
                Write-Log "pnpm not found. Enabling corepack and activating pnpm..."
                Require-Cmd corepack
                & corepack enable | Out-Null
                & corepack prepare pnpm@latest --activate | Out-Null
            }
        }
        "yarn" {
            if (-not (Get-Command yarn -ErrorAction SilentlyContinue)) {
                Write-Log "yarn not found. Enabling corepack and activating yarn..."
                Require-Cmd corepack
                & corepack enable | Out-Null
                & corepack prepare yarn@stable --activate | Out-Null
            }
        }
        "bun" {
            if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
                throw "bun.lockb found but bun is not installed. Install bun or remove bun.lockb if unused."
            }
        }
        default { Require-Cmd npm }
    }
}

function NpmScript-Exists([string]$AppRoot, [string]$ScriptName) {
    $pkgPath = Join-Path $AppRoot "package.json"
    $pkg = Get-Content $pkgPath -Raw -Encoding UTF8 | ConvertFrom-Json
    return ($pkg.scripts -and $pkg.scripts.psobject.Properties.Name -contains $ScriptName)
}

function Run-ScriptIfExists([string]$Mgr, [string]$AppRoot, [string]$ScriptName) {
    if (NpmScript-Exists $AppRoot $ScriptName) {
        Write-Log "Running: $Mgr run $ScriptName"
        Push-Location $AppRoot
        try {
            switch ($Mgr) {
                "pnpm" { & pnpm run $ScriptName }
                "yarn" { & yarn run $ScriptName }
                "bun" { & bun run $ScriptName }
                default { & npm run $ScriptName }
            }
        }
        finally { Pop-Location }
    }
    else {
        Write-Log "Skipping: no script '$ScriptName'"
    }
}

function Install-Deps([string]$Mgr, [string]$AppRoot) {
  Ensure-PackageManager $Mgr
  Write-Log "Installing dependencies ($Mgr)..."
  Push-Location $AppRoot
  try {
    switch ($Mgr) {
      "pnpm" { & pnpm install --frozen-lockfile }
      "yarn" { & yarn install --immutable; if ($LASTEXITCODE -ne 0) { & yarn install } }
      "bun"  { & bun install }
      default { & npm ci; if ($LASTEXITCODE -ne 0) { & npm install } }
    }
  } finally { Pop-Location }
}

function Ensure-VercelCli() {
  if (Get-Command vercel -ErrorAction SilentlyContinue) { return }
  Write-Log "Installing Vercel CLI globally..."
  Require-Cmd npm
  & npm i -g vercel@latest
  Require-Cmd vercel
}

function Vercel-Preflight([string]$AppRoot) {
  Ensure-VercelCli

  Write-Log "Checking Vercel auth..."
  & vercel whoami *> $null
  if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Vercel CLI is not authenticated."
    Write-Host "Run once:"
    Write-Host "  vercel login"
    Write-Host "  vercel link"
    Write-Host "Then re-run this script."
    exit 10
  }

  $projFile = Join-Path $AppRoot ".vercel\project.json"
  if (-not (Test-Path $projFile)) {
    Write-Log "No .vercel/project.json found. Attempting non-interactive link: vercel link --yes"
    Push-Location $AppRoot
    try {
      & vercel link --yes
      if ($LASTEXITCODE -ne 0 -or -not (Test-Path $projFile)) {
        Write-Host ""
        Write-Host "Project is not linked and Vercel needs interactive selection."
        Write-Host "Run once:"
        Write-Host "  vercel link"
        Write-Host "Then re-run this script."
        exit 11
      }
    } finally { Pop-Location }
  }

  Write-Log "Pulling Vercel production env config (non-fatal)..."
  Push-Location $AppRoot
  try { & vercel pull --yes --environment=production *> $null } catch { }
  finally { Pop-Location }
}

function Git-StashIfDirty() {
  $dirty = (& git status --porcelain).Trim()
  if ($dirty) {
    Write-Log "Stashing local changes..."
    & git stash push -u -m ("autopilot-stash-" + (Timestamp)) *> $null
  }
}

function Merge-AllRemoteBranches([switch]$PreferTheirs) {
  Write-Log "Merging ALL origin/* branches into $IntegrationBranch (auto-resolve conflicts)..."

  $branches = (& git for-each-ref --format='%(refname:short)' refs/remotes/origin) |
    ForEach-Object { $_ -replace '^origin/', '' } |
    Where-Object { $_ -and $_ -notmatch '^(HEAD|main)$' } |
    Where-Object { $_ -notmatch '^dependabot/' }

  foreach ($b in $branches) {
    Write-Log "Merging origin/$b"
    $strategy = @()
    if ($PreferTheirs) { $strategy = @("-X", "theirs") }

    $ok = $true
    try {
      & git merge --no-ff --no-edit -m ("merge: origin/$b -> $IntegrationBranch") @strategy ("origin/$b")
      if ($LASTEXITCODE -ne 0) { $ok = $false }
    } catch { $ok = $false }

    if (-not $ok) {
      Write-Log "Conflicts detected. Auto-resolving by accepting incoming (theirs)..."
      try { & git checkout --theirs . } catch { }
      & git add -A
      try { & git commit -m ("autofix: accept incoming changes for conflicts from origin/$b") } catch { }
    }
  }
}

function Verify-Build([string]$Mgr, [string]$AppRoot) {
  Install-Deps $Mgr $AppRoot
  Run-ScriptIfExists $Mgr $AppRoot "lint"
  Run-ScriptIfExists $Mgr $AppRoot "typecheck"
  Run-ScriptIfExists $Mgr $AppRoot "test"
  Run-ScriptIfExists $Mgr $AppRoot "build"
}

function Merge-Integration-ToMain-AndPush() {
  Write-Log "Merging $IntegrationBranch -> main"
  & git checkout main
  & git merge --no-ff -m ("merge: $IntegrationBranch -> main") $IntegrationBranch
  & git push origin main
}

function Deploy-Prod([string]$AppRoot) {
  Vercel-Preflight $AppRoot

  Write-Log "Deploying to Vercel production..."
  Push-Location $AppRoot
  try {
    $out = & vercel deploy --prod --yes 2>&1 | Tee-Object -Variable deployOut
    $url = ($deployOut | Select-String -Pattern 'https://\S+' -AllMatches | ForEach-Object { $_.Matches.Value } | Select-Object -Last 1)
    if (-not $url) { throw "Could not detect deployment URL from vercel output." }
    Write-Log "Deployed URL: $url"
    return $url
  } finally { Pop-Location }
}

function Any-RemoteBranch-AheadOfMain() {
  & git fetch --all --prune *> $null
  $branches = (& git for-each-ref --format='%(refname:short)' refs/remotes/origin) |
    ForEach-Object { $_ -replace '^origin/', '' } |
    Where-Object { $_ -and $_ -notmatch '^(HEAD|main)$' } |
    Where-Object { $_ -notmatch '^dependabot/' }

  foreach ($b in $branches) {
    $counts = (& git rev-list --left-right --count "origin/main...origin/$b" 2>$null).Trim()
    if (-not $counts) { continue }
    $parts = $counts -split "\s+"
    if ($parts.Count -ge 2) {
      $ahead = [int]$parts[1]
      if ($ahead -gt 0) { return $true }
    }
  }
  return $false
}

function Write-FinalReport([string]$RepoRoot, [string]$AppRoot, [string]$Mgr, [string]$DeployUrl, [string]$BackupTag, [string]$BackupBranch) {
  $reportPath = Join-Path $RepoRoot "FINAL_REPORT.md"
  Write-Log "Writing FINAL_REPORT.md"

  $logLines = (& git log --oneline -n 30)
  $status = (& git status --porcelain)

  $content = @()
  $content += "# Autopilot Final Report"
  $content += ""
  $content += "- Timestamp: $(Get-Date -Format o)"
  $content += "- Backup tag: $BackupTag"
  $content += "- Backup branch: $BackupBranch"
  $content += "- Integration branch: $IntegrationBranch"
  $content += "- Repo root: $RepoRoot"
  $content += "- App root: $AppRoot"
  $content += "- Package manager: $Mgr"
  $content += "- Deployed URL: $DeployUrl"
  $content += ""
  $content += "## Recent commits"
  $content += ""
  $content += ($logLines | ForEach-Object { "- $_" })
  $content += ""
  $content += "## Git status"
  $content += ""
  if ($status) {
    $content += '```'
    $content += $status
    $content += '```'
  } else {
    $content += "Clean."
  }

  Set-Content -Path $reportPath -Value ($content -join "`n") -Encoding UTF8

  & git add $reportPath
  try { & git commit -m "docs: autopilot final report" } catch { }
  & git push origin main
}

# =======================
# MAIN
# =======================
Require-Cmd git
Require-Cmd node

# Always cd first (per your preference)
Write-Log "cd `"$RepoPath`""
Set-Location $RepoPath

$repoRoot = Git-Root (Get-Location).Path
Write-Log "Repo root detected: $repoRoot"
Set-Location $repoRoot

Git-StashIfDirty

Write-Log "Fetching remotes..."
& git fetch --all --prune

$backupTag = "pre-autopilot-$(Timestamp)"
$backupBranch = "backup/pre-autopilot-$(Timestamp)"

Write-Log "Creating backup tag + branch..."
try { & git tag $backupTag } catch { }
try { & git branch $backupBranch HEAD } catch { }

Write-Log "Resetting local main to origin/main..."
& git checkout -B main origin/main

Write-Log "Creating integration branch: $IntegrationBranch"
& git checkout -B $IntegrationBranch origin/main

$appRoot = Find-AppRoot $repoRoot
Write-Log "App root detected: $appRoot"

$pkgMgr = Detect-PackageManager $appRoot
Write-Log "Package manager detected: $pkgMgr"

Write-Log "=== PASS 1: merge -> verify -> merge to main -> deploy ==="
Merge-AllRemoteBranches -PreferTheirs:$PreferTheirs
Verify-Build $pkgMgr $appRoot
Merge-Integration-ToMain-AndPush
$deployUrl1 = Deploy-Prod $appRoot
Write-FinalReport $repoRoot $appRoot $pkgMgr $deployUrl1 $backupTag $backupBranch

Write-Log "Rechecking for leftover branches ahead of main..."
if (Any-RemoteBranch-AheadOfMain) {
  Write-Log "=== PASS 2: leftover detected. merge -> verify -> deploy (one more time) ==="
  & git checkout -B $IntegrationBranch origin/main
  Merge-AllRemoteBranches -PreferTheirs:$PreferTheirs
  Verify-Build $pkgMgr $appRoot
  Merge-Integration-ToMain-AndPush
  $deployUrl2 = Deploy-Prod $appRoot
  Write-FinalReport $repoRoot $appRoot $pkgMgr $deployUrl2 $backupTag $backupBranch
  Write-Log "Pass 2 deploy URL: $deployUrl2"
} else {
  Write-Log "No leftover branches ahead of main."
}

Write-Log "DONE. Autopilot complete."
