#!/usr/bin/env pwsh
# ============================================
# 3000 Studios - Safe PR Merge Release Script
# ============================================
# Three-phase controlled merge process with automatic rollback
# 
# PHASE 1: Freeze & Verify (creates backup)
# PHASE 2: Verify PRs Individually (no merges)
# PHASE 3: Controlled Merge (single release branch)

param(
    [switch]$DryRun = $false,
    [switch]$SkipTests = $false
)

$ErrorActionPreference = "Stop"
$DATE = Get-Date -Format "yyyy-MM-dd"
$BACKUP_BRANCH = "backup/main-before-merge-$DATE"
$BACKUP_TAG = "v-pre-merge-$DATE"
$RELEASE_BRANCH = "release/merge-$DATE"

# Color output helpers
function Write-Phase { param($Message) Write-Host "`n🔷 $Message" -ForegroundColor Cyan }
function Write-Success { param($Message) Write-Host "   ✅ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "   ⚠️  $Message" -ForegroundColor Yellow }
function Write-Error-Custom { param($Message) Write-Host "   ❌ $Message" -ForegroundColor Red }
function Write-Step { param($Message) Write-Host "   → $Message" -ForegroundColor Gray }

# ============================================
# PHASE 1: Freeze & Verify
# ============================================
function Phase1-FreezeAndVerify {
    Write-Phase "PHASE 1: Freeze & Verify"
    
    Write-Step "Checking current branch..."
    $currentBranch = git rev-parse --abbrev-ref HEAD
    
    if ($currentBranch -ne "main") {
        Write-Warning "Not on main branch (current: $currentBranch)"
        Write-Step "Switching to main..."
        git checkout main
    }
    
    Write-Step "Pulling latest changes..."
    git pull origin main
    
    Write-Step "Checking working tree status..."
    $status = git status --porcelain
    if (-not [string]::IsNullOrWhiteSpace($status)) {
        Write-Error-Custom "Working tree is not clean!"
        Write-Host "`nUncommitted changes:" -ForegroundColor Yellow
        git status --short
        Write-Host "`nPlease commit or stash changes before continuing." -ForegroundColor Yellow
        exit 1
    }
    Write-Success "Working tree is clean"
    
    if ($DryRun) {
        Write-Warning "DRY RUN: Would create backup branch: $BACKUP_BRANCH"
        Write-Warning "DRY RUN: Would create backup tag: $BACKUP_TAG"
        return
    }
    
    Write-Step "Creating backup branch: $BACKUP_BRANCH"
    git branch $BACKUP_BRANCH
    git push origin $BACKUP_BRANCH
    Write-Success "Backup branch created"
    
    Write-Step "Creating backup tag: $BACKUP_TAG"
    git tag -a $BACKUP_TAG -m "Snapshot before PR merge on $DATE"
    git push origin $BACKUP_TAG
    Write-Success "Backup tag created"
    
    Write-Success "PHASE 1 Complete: Backups created successfully"
}

# ============================================
# PHASE 2: Verify PRs Individually
# ============================================
function Phase2-VerifyPRs {
    Write-Phase "PHASE 2: Verify PRs Individually"
    
    $prs = @(
        @{Number=35; Name="ESLint 9 + TS fixes"},
        @{Number=34; Name="platform hardening"},
        @{Number=31; Name="nav + pipeline"},
        @{Number=33; Name="Vercel analytics"}
    )
    
    $originalBranch = git rev-parse --abbrev-ref HEAD
    $failedPRs = @()
    
    foreach ($pr in $prs) {
        $prNum = $pr.Number
        $prName = $pr.Name
        
        Write-Host "`n──────────────────────────────────────" -ForegroundColor Cyan
        Write-Host "Testing PR #$prNum`: $prName" -ForegroundColor Cyan
        Write-Host "──────────────────────────────────────" -ForegroundColor Cyan
        
        try {
            if ($DryRun) {
                Write-Warning "DRY RUN: Would checkout PR #$prNum"
                Write-Warning "DRY RUN: Would run tests for PR #$prNum"
                continue
            }
            
            Write-Step "Checking out PR #$prNum..."
            gh pr checkout $prNum
            
            Write-Step "Installing dependencies..."
            pnpm install --frozen-lockfile
            
            if (-not $SkipTests) {
                Write-Step "Running linter..."
                try {
                    pnpm lint
                    Write-Success "Lint passed"
                } catch {
                    Write-Error-Custom "Lint failed for PR #$prNum"
                    $failedPRs += @{PR=$prNum; Name=$prName; Stage="lint"; Error=$_.Exception.Message}
                    continue
                }
                
                Write-Step "Running type check..."
                try {
                    $typecheckResult = & { pnpm typecheck } 2>&1
                    if ($LASTEXITCODE -ne 0) {
                        # Try alternative
                        $typecheckResult = & { pnpm tsc --noEmit } 2>&1
                    }
                    if ($LASTEXITCODE -eq 0) {
                        Write-Success "Type check passed"
                    } else {
                        throw "Type check failed"
                    }
                } catch {
                    Write-Error-Custom "Type check failed for PR #$prNum"
                    $failedPRs += @{PR=$prNum; Name=$prName; Stage="typecheck"; Error=$_.Exception.Message}
                    continue
                }
                
                Write-Step "Building project..."
                try {
                    pnpm build
                    Write-Success "Build passed"
                } catch {
                    Write-Error-Custom "Build failed for PR #$prNum"
                    $failedPRs += @{PR=$prNum; Name=$prName; Stage="build"; Error=$_.Exception.Message}
                    continue
                }
            } else {
                Write-Warning "Tests skipped (--SkipTests flag)"
            }
            
            Write-Success "PR #$prNum verified successfully"
            
        } catch {
            Write-Error-Custom "Failed to verify PR #$prNum`: $_"
            $failedPRs += @{PR=$prNum; Name=$prName; Stage="checkout"; Error=$_.Exception.Message}
        }
    }
    
    # Return to original branch
    Write-Step "Returning to $originalBranch..."
    git checkout $originalBranch
    
    if ($failedPRs.Count -gt 0) {
        Write-Host "`n" -ForegroundColor Red
        Write-Host "❌ PHASE 2 FAILED: $($failedPRs.Count) PR(s) did not pass verification" -ForegroundColor Red
        Write-Host "`nFailed PRs:" -ForegroundColor Yellow
        foreach ($failed in $failedPRs) {
            Write-Host "  - PR #$($failed.PR) ($($failed.Name)): Failed at $($failed.Stage)" -ForegroundColor Yellow
        }
        Write-Host "`nPlease fix the failing PRs before proceeding." -ForegroundColor Yellow
        exit 1
    }
    
    Write-Success "PHASE 2 Complete: All PRs verified successfully"
}

# ============================================
# PHASE 3: Controlled Merge
# ============================================
function Phase3-ControlledMerge {
    Write-Phase "PHASE 3: Controlled Merge"
    
    Write-Step "Ensuring we're on main..."
    git checkout main
    git pull origin main
    
    Write-Step "Creating release branch: $RELEASE_BRANCH"
    if ($DryRun) {
        Write-Warning "DRY RUN: Would create release branch: $RELEASE_BRANCH"
    } else {
        git checkout -b $RELEASE_BRANCH
        Write-Success "Release branch created"
    }
    
    # Define merge order
    $merges = @(
        @{PR=35; Branch="pr-35"; Message="Merge PR #35: ESLint 9 + TS fixes"},
        @{PR=34; Branch="pr-34"; Message="Merge PR #34: platform hardening"},
        @{PR=31; Branch="pr-31"; Message="Merge PR #31: nav + pipeline"},
        @{PR=33; Branch="pr-33"; Message="Merge PR #33: Vercel analytics"}
    )
    
    foreach ($merge in $merges) {
        Write-Host "`n──────────────────────────────────────" -ForegroundColor Cyan
        Write-Host "Merging PR #$($merge.PR)" -ForegroundColor Cyan
        Write-Host "──────────────────────────────────────" -ForegroundColor Cyan
        
        if ($DryRun) {
            Write-Warning "DRY RUN: Would merge $($merge.Branch) with message: $($merge.Message)"
            continue
        }
        
        try {
            # Fetch the PR branch
            Write-Step "Fetching PR branch..."
            gh pr checkout $($merge.PR)
            $prBranch = git rev-parse --abbrev-ref HEAD
            git checkout $RELEASE_BRANCH
            
            Write-Step "Merging with --no-ff..."
            git merge --no-ff $prBranch -m $($merge.Message)
            Write-Success "Merged PR #$($merge.PR)"
        } catch {
            Write-Error-Custom "Failed to merge PR #$($merge.PR)"
            Write-Host "`nMerge conflict or error occurred. Manual intervention required." -ForegroundColor Yellow
            Write-Host "Current branch: $(git rev-parse --abbrev-ref HEAD)" -ForegroundColor Yellow
            Write-Host "`nTo abort and rollback:" -ForegroundColor Yellow
            Write-Host "  git merge --abort" -ForegroundColor Gray
            Write-Host "  git checkout main" -ForegroundColor Gray
            Write-Host "  git branch -D $RELEASE_BRANCH" -ForegroundColor Gray
            exit 1
        }
    }
    
    Write-Host "`n──────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "Running final verification gate" -ForegroundColor Cyan
    Write-Host "──────────────────────────────────────" -ForegroundColor Cyan
    
    if ($DryRun) {
        Write-Warning "DRY RUN: Would run final tests"
    } elseif (-not $SkipTests) {
        Write-Step "Installing dependencies..."
        pnpm install --frozen-lockfile
        
        Write-Step "Running linter..."
        try {
            pnpm lint
            Write-Success "Lint passed"
        } catch {
            Write-Error-Custom "Final lint check failed!"
            Write-Host "`nFix issues and recommit before merging to main." -ForegroundColor Yellow
            exit 1
        }
        
        Write-Step "Running type check..."
        try {
            $typecheckResult = & { pnpm typecheck } 2>&1
            if ($LASTEXITCODE -ne 0) {
                $typecheckResult = & { pnpm tsc --noEmit } 2>&1
            }
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Type check passed"
            } else {
                throw "Type check failed"
            }
        } catch {
            Write-Error-Custom "Final type check failed!"
            Write-Host "`nFix issues and recommit before merging to main." -ForegroundColor Yellow
            exit 1
        }
        
        Write-Step "Building project..."
        try {
            pnpm build
            Write-Success "Build passed"
        } catch {
            Write-Error-Custom "Final build failed!"
            Write-Host "`nFix issues and recommit before merging to main." -ForegroundColor Yellow
            exit 1
        }
        
        Write-Success "All final checks passed!"
    }
    
    if ($DryRun) {
        Write-Warning "DRY RUN: Would merge release branch to main"
        Write-Warning "DRY RUN: Would push to origin/main (triggers Vercel)"
    } else {
        Write-Host "`n──────────────────────────────────────" -ForegroundColor Cyan
        Write-Host "Merging to main" -ForegroundColor Cyan
        Write-Host "──────────────────────────────────────" -ForegroundColor Cyan
        
        Write-Step "Switching to main..."
        git checkout main
        
        Write-Step "Merging release branch..."
        git merge --no-ff $RELEASE_BRANCH
        Write-Success "Release branch merged to main"
        
        Write-Step "Pushing to origin/main (this triggers Vercel deployment)..."
        git push origin main
        Write-Success "Pushed to main - Vercel deployment initiated"
    }
    
    Write-Success "PHASE 3 Complete: All PRs merged successfully"
}

# ============================================
# Rollback Function
# ============================================
function Invoke-Rollback {
    Write-Host "`n" -ForegroundColor Red
    Write-Host "🚨 ROLLBACK PROCEDURE" -ForegroundColor Red
    Write-Host "════════════════════════════════════════" -ForegroundColor Red
    
    Write-Host "`nTo rollback to pre-merge state:" -ForegroundColor Yellow
    Write-Host "  git checkout $BACKUP_TAG" -ForegroundColor Gray
    Write-Host "  git push origin ${BACKUP_TAG}:main --force" -ForegroundColor Gray
    Write-Host "`nOr use the backup branch:" -ForegroundColor Yellow
    Write-Host "  git checkout $BACKUP_BRANCH" -ForegroundColor Gray
    Write-Host "  git push origin ${BACKUP_BRANCH}:main --force" -ForegroundColor Gray
    Write-Host "`nVercel will automatically redeploy the rollback." -ForegroundColor Yellow
}

# ============================================
# Main Execution
# ============================================
try {
    Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "3000 Studios - Safe PR Merge Script" -ForegroundColor Cyan
    Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Date: $DATE" -ForegroundColor Gray
    
    if ($DryRun) {
        Write-Warning "DRY RUN MODE: No actual changes will be made"
    }
    if ($SkipTests) {
        Write-Warning "SKIP TESTS MODE: Verification tests will be skipped"
    }
    
    # Execute phases
    Phase1-FreezeAndVerify
    Phase2-VerifyPRs
    Phase3-ControlledMerge
    
    # Success summary
    Write-Host "`n════════════════════════════════════════" -ForegroundColor Green
    Write-Host "✅ SUCCESS: All phases completed" -ForegroundColor Green
    Write-Host "════════════════════════════════════════" -ForegroundColor Green
    Write-Host "`nBackup created:" -ForegroundColor Cyan
    Write-Host "  Branch: $BACKUP_BRANCH" -ForegroundColor Gray
    Write-Host "  Tag: $BACKUP_TAG" -ForegroundColor Gray
    Write-Host "`nDeployment:" -ForegroundColor Cyan
    Write-Host "  Vercel will deploy main branch in ~5-7 minutes" -ForegroundColor Gray
    Write-Host "  Monitor at: https://vercel.com/dashboard" -ForegroundColor Gray
    Write-Host "`nTo rollback if needed:" -ForegroundColor Cyan
    Write-Host "  Run: git checkout $BACKUP_TAG && git push origin ${BACKUP_TAG}:main --force" -ForegroundColor Gray
    
} catch {
    Write-Host "`n" -ForegroundColor Red
    Write-Host "❌ SCRIPT FAILED: $_" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor Red
    Invoke-Rollback
    exit 1
}
