param(
  [string]$RepoPath = "C:\Users\MrJws\OneDrive\WorkSpaces\3000studios-next\3000studios-next",
  [int]$IntervalSeconds = 6
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Cmd([string]$name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) { throw "Missing tool: $name" }
}

Cmd git
Cmd npm

Set-Location $RepoPath

function SafeStageCommitPush() {
  & git add -A | Out-Null

  $porcelain = & git status --porcelain
  if (-not $porcelain) { return }

  $blocked = @(".env", ".env.", ".vercel")
  foreach ($line in $porcelain) {
    foreach ($b in $blocked) {
      if ($line -match [regex]::Escape($b)) {
        throw "Blocked from auto-commit due to sensitive file match: $b"
      }
    }
  }

  & npm run shadow:autofix | Out-Null
  & npm run build | Out-Null

  $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  & git commit -m "shadow: autofix + build verified @ $ts" | Out-Null
  & git push origin main | Out-Null
}

$last = ""
while ($true) {
  Start-Sleep -Seconds $IntervalSeconds
  $cur = & git status --porcelain
  if ($cur -ne $last) {
    $last = $cur
    if ($cur) {
      try { SafeStageCommitPush } catch { }
    }
  }
}
