$pollSeconds = 20
$minPhaseSeconds = 120
$stablePhaseSeconds = 60
$minFilesForImmediateCommit = 10
$lastCommitAt = Get-Date
$lastChangeAt = $null
$lastSnapshot = ""

function Get-TrackedChanges {
    git status --porcelain |
        Where-Object {
            $_ -and
            $_ -notmatch '^\?\? dist/' -and
            $_ -notmatch '^\?\? node_modules/' -and
            $_ -notmatch '^\?\? workspace_report.txt'
        }
}

function Get-PhaseLabel {
    param([string[]]$Changes)

    $paths = $Changes | ForEach-Object {
        if ($_ -match '^\S+\s+(.+)$') { $matches[1].Trim() }
    }

    $labels = @()

    if ($paths -match '^content/' -or $paths -match '^content/blog/') { $labels += 'content generated' }
    if ($paths -match '^ai/') { $labels += 'ai task completed' }
    if ($paths -match '^scripts/deploy-site\.js$' -or $paths -match '^worker/' -or $paths -match '^wrangler\.toml$') { $labels += 'deployment phase finished' }
    if ($paths -match '^dist/' -or $paths -match '^frontend/' -or $paths -match '^src/' -or $paths -match '^vite\.config\.js$') { $labels += 'manual build finished' }
    if ($paths -match '^scripts/run-traffic-cycle\.js$' -or $paths -match '^content/system/traffic\.json$') { $labels += 'traffic cycle finished' }
    if ($paths -match '^server/') { $labels += 'server update finished' }
    if ($paths -match '^scripts/') { $labels += 'automation update finished' }

    if (-not $labels) {
        $labels += 'workspace phase finished'
    }

    ($labels | Select-Object -Unique) -join ', '
}

function Write-PhaseStatus {
    param(
        [int]$FileCount,
        [double]$SecondsSinceCommit,
        [double]$SecondsSinceLastChange
    )

    $waitForCommit = [Math]::Max(0, [int]($minPhaseSeconds - $SecondsSinceCommit))
    $waitForStable = [Math]::Max(0, [int]($stablePhaseSeconds - $SecondsSinceLastChange))

    Write-Host "Changes detected in $FileCount file(s). Waiting for phase threshold: ${waitForCommit}s since last commit or ${waitForStable}s of stability."
}

while ($true) {
    $changes = Get-TrackedChanges

    if (-not $changes) {
        $lastChangeAt = $null
        $lastSnapshot = ""
        Start-Sleep -Seconds $pollSeconds
        continue
    }

    $snapshot = $changes -join "`n"

    if ($snapshot -ne $lastSnapshot) {
        $lastSnapshot = $snapshot
        $lastChangeAt = Get-Date
    }

    $now = Get-Date
    $fileCount = ($changes | Measure-Object).Count
    $secondsSinceCommit = ($now - $lastCommitAt).TotalSeconds
    $secondsSinceLastChange = if ($lastChangeAt) { ($now - $lastChangeAt).TotalSeconds } else { 0 }

    $stablePhaseReady = $secondsSinceLastChange -ge $stablePhaseSeconds
    $phaseWindowReached = $secondsSinceCommit -ge $minPhaseSeconds
    $batchLargeEnough = $fileCount -ge $minFilesForImmediateCommit

    if (-not $batchLargeEnough -and -not ($phaseWindowReached -and $stablePhaseReady)) {
        Write-PhaseStatus -FileCount $fileCount -SecondsSinceCommit $secondsSinceCommit -SecondsSinceLastChange $secondsSinceLastChange
        Start-Sleep -Seconds $pollSeconds
        continue
    }

    git add .
    git diff --cached --quiet

    if ($LASTEXITCODE -eq 0) {
        Start-Sleep -Seconds $pollSeconds
        continue
    }

    $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $phase = Get-PhaseLabel -Changes $changes
    $message = "system phase commit [$phase] $time"

    git commit -m $message

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Commit skipped. Git reported no committable phase."
        Start-Sleep -Seconds $pollSeconds
        continue
    }

    git push

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Phase commit pushed [$phase] $time"
        $lastCommitAt = Get-Date
        $lastChangeAt = $null
        $lastSnapshot = ""
    } else {
        Write-Host "Push failed. Leaving changes staged for the next retry."
    }

    Start-Sleep -Seconds $pollSeconds
}
