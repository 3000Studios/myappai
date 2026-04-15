#!/usr/bin/env pwsh
# ============================================
# 3000 Studios - Sync Validation Script
# ============================================
# Validates that all synchronization components are properly configured
# Run this to verify your setup is correct

Write-Host "`n🔍 3000 Studios - Sync Validation`n" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$allGood = $true

# ============================================
# 3. Git Configuration
# ============================================
Write-Host "`n3️⃣  Checking Git Configuration..." -ForegroundColor Yellow

try {
    $gitVersion = git --version
    Write-Host "   ✅ Git installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Git not found. Please install Git." -ForegroundColor Red
    $allGood = $false
}

try {
    $gitUser = git config user.name
    $gitEmail = git config user.email
    if ($gitUser -and $gitEmail) {
        Write-Host "   ✅ Git configured: $gitUser <$gitEmail>" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Git user not configured. Run:" -ForegroundColor Yellow
        Write-Host "      git config --global user.name 'Your Name'" -ForegroundColor Gray
        Write-Host "      git config --global user.email 'your@email.com'" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Could not check Git configuration" -ForegroundColor Yellow
}

try {
    $remote = git remote get-url origin 2>$null
    if ($remote -match "github.com") {
        Write-Host "   ✅ Remote configured: $remote" -ForegroundColor Green
    } elseif ($remote) {
        Write-Host "   ✅ Remote configured: $remote" -ForegroundColor Green
        Write-Host "      (Non-GitHub remote detected)" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  No remote configured" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Git remote not configured" -ForegroundColor Red
    $allGood = $false
}

# ============================================
# 2. GitHub CLI Authentication
# ============================================
Write-Host "`n2️⃣  Checking GitHub CLI..." -ForegroundColor Yellow

try {
    $ghVersion = gh --version 2>$null
    if ($ghVersion) {
        Write-Host "   ✅ GitHub CLI installed" -ForegroundColor Green
        
        $ghStatus = gh auth status 2>&1
        if ($ghStatus -match "Logged in") {
            Write-Host "   ✅ GitHub CLI authenticated" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  GitHub CLI not authenticated. Run: gh auth login" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  GitHub CLI not installed (optional but recommended)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  GitHub CLI not installed (optional but recommended)" -ForegroundColor Yellow
}

# ============================================
# 3. Node.js and pnpm
# ============================================
Write-Host "`n3️⃣  Checking Node.js and pnpm..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    $allGood = $false
}

try {
    $pnpmVersion = pnpm --version
    Write-Host "   ✅ pnpm installed: v$pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ pnpm not found. Install with: npm install -g pnpm" -ForegroundColor Red
    $allGood = $false
}

# ============================================
# 4. Project Files
# ============================================
Write-Host "`n4️⃣  Checking Project Files..." -ForegroundColor Yellow

$requiredFiles = @(
    "package.json",
    "pnpm-lock.yaml",
    "next.config.ts",
    "tsconfig.json",
    ".gitignore",
    ".env.example",
    "3000studios-next.code-workspace"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file missing" -ForegroundColor Red
        $allGood = $false
    }
}

# ============================================
# 5. Environment Variables
# ============================================
Write-Host "`n5️⃣  Checking Environment Variables..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "   ✅ .env.local exists (local configuration)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  .env.local not found. Create with: cp .env.example .env.local" -ForegroundColor Yellow
}

if (Test-Path ".env") {
    Write-Host "   ⚠️  .env file found (should use .env.local instead)" -ForegroundColor Yellow
}

# Check if .env files are ignored
$gitignoreContent = Get-Content ".gitignore" -Raw
if ($gitignoreContent -match "\.env") {
    Write-Host "   ✅ .env files properly ignored in .gitignore" -ForegroundColor Green
} else {
    Write-Host "   ❌ .env files not ignored. Check .gitignore" -ForegroundColor Red
    $allGood = $false
}

# ============================================
# 6. Dependencies
# ============================================
Write-Host "`n6️⃣  Checking Dependencies..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  node_modules not found. Run: pnpm install" -ForegroundColor Yellow
}

# ============================================
# 7. VS Code Workspace
# ============================================
Write-Host "`n7️⃣  Checking VS Code Configuration..." -ForegroundColor Yellow

if (Test-Path ".vscode/settings.json") {
    Write-Host "   ✅ VS Code settings.json exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  VS Code settings.json not found" -ForegroundColor Yellow
}

if (Test-Path ".vscode/tasks.json") {
    Write-Host "   ✅ VS Code tasks.json exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  VS Code tasks.json not found" -ForegroundColor Yellow
}

if (Test-Path "3000studios-next.code-workspace") {
    Write-Host "   ✅ Workspace file exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ Workspace file missing" -ForegroundColor Red
    $allGood = $false
}

# ============================================
# 8. GitHub Workflows
# ============================================
Write-Host "`n8️⃣  Checking GitHub Workflows..." -ForegroundColor Yellow

$workflows = @(
    ".github/workflows/vercel-deploy.yml",
    ".github/workflows/ci.yml"
)

foreach ($workflow in $workflows) {
    if (Test-Path $workflow) {
        Write-Host "   ✅ $(Split-Path $workflow -Leaf) exists" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $(Split-Path $workflow -Leaf) not found" -ForegroundColor Yellow
    }
}

# ============================================
# 9. Documentation
# ============================================
Write-Host "`n9️⃣  Checking Documentation..." -ForegroundColor Yellow

$docs = @(
    "README.md",
    "WORKFLOW_SYNC_GUIDE.md",
    "VSCODE_INTEGRATION_GUIDE.md",
    "ENV_SYNC_GUIDE.md",
    "SYNC_QUICK_REFERENCE.md",
    "SYNC_MASTER_INDEX.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "   ✅ $doc exists" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $doc not found" -ForegroundColor Yellow
    }
}

# ============================================
# 10. Git Status
# ============================================
Write-Host "`n🔟 Checking Git Status..." -ForegroundColor Yellow

try {
    $branch = git rev-parse --abbrev-ref HEAD
    Write-Host "   ✅ Current branch: $branch" -ForegroundColor Green
    
    $status = git status --porcelain
    if ([string]::IsNullOrWhiteSpace($status)) {
        Write-Host "   ✅ Working tree clean" -ForegroundColor Green
    } else {
        $fileCount = ($status -split "`n").Count
        Write-Host "   ℹ️  $fileCount file(s) changed (uncommitted)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ Could not check Git status" -ForegroundColor Red
}

# ============================================
# Summary
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✅ All critical checks passed!" -ForegroundColor Green
    Write-Host "`nYour synchronization setup is ready to use." -ForegroundColor Green
    Write-Host "`n📚 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Review SYNC_MASTER_INDEX.md for documentation" -ForegroundColor Gray
    Write-Host "   2. Start dev server: pnpm dev" -ForegroundColor Gray
    Write-Host "   3. Make changes and use: .\scripts\secure-sync.ps1" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Some critical issues found" -ForegroundColor Yellow
    Write-Host "`nPlease fix the issues marked with ❌ above." -ForegroundColor Yellow
    Write-Host "`n📚 See WORKFLOW_SYNC_GUIDE.md for setup instructions." -ForegroundColor Cyan
}

Write-Host "`n========================================`n" -ForegroundColor Cyan
