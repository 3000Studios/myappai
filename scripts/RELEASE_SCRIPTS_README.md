# 🚀 Release Merge Scripts - Usage Guide

**Purpose**: Safely merge multiple PRs with automated verification, backup, and rollback capabilities.

---

## 📋 Overview

These scripts implement a three-phase controlled merge process:

1. **PHASE 1**: Freeze & Verify (creates immutable backups)
2. **PHASE 2**: Verify PRs Individually (tests each PR before merge)
3. **PHASE 3**: Controlled Merge (merges to release branch, then main)

---

## 📦 Available Scripts

### PowerShell Script (Windows)

**File**: `release-merge.ps1`

```powershell
# Basic usage
.\scripts\release-merge.ps1

# Dry run (shows what would happen without making changes)
.\scripts\release-merge.ps1 -DryRun

# Skip tests (faster, but not recommended)
.\scripts\release-merge.ps1 -SkipTests

# Combination
.\scripts\release-merge.ps1 -DryRun -SkipTests
```

### Bash Script (Linux/macOS)

**File**: `release-merge.sh`

```bash
# Basic usage
./scripts/release-merge.sh

# Dry run (shows what would happen without making changes)
./scripts/release-merge.sh --dry-run

# Skip tests (faster, but not recommended)
./scripts/release-merge.sh --skip-tests

# Combination
./scripts/release-merge.sh --dry-run --skip-tests
```

---

## 🔒 What the Scripts Do

### PHASE 1: Freeze & Verify (~2 minutes)

**Actions**:

1. ✅ Verifies you're on `main` branch
2. ✅ Pulls latest changes from remote
3. ✅ Checks working tree is clean (no uncommitted changes)
4. ✅ Creates backup branch: `backup/main-before-merge-YYYY-MM-DD`
5. ✅ Creates backup tag: `v-pre-merge-YYYY-MM-DD`
6. ✅ Pushes backups to remote

**Safety**: If anything fails, script stops. No changes made.

### PHASE 2: Verify PRs Individually (~10-15 minutes)

**PRs Verified** (in this order):

- PR #35: ESLint 9 + TS fixes
- PR #34: platform hardening
- PR #31: nav + pipeline
- PR #33: Vercel analytics

**For Each PR**:

1. ✅ Checks out PR branch
2. ✅ Installs dependencies (`pnpm install --frozen-lockfile`)
3. ✅ Runs linter (`pnpm lint`)
4. ✅ Runs type check (`pnpm typecheck` or `pnpm tsc --noEmit`)
5. ✅ Runs build (`pnpm build`)

**Safety**: If any PR fails any check, script stops and reports which PR/stage failed. No merges performed.

### PHASE 3: Controlled Merge (~5-10 minutes)

**Actions**:

1. ✅ Creates release branch: `release/merge-YYYY-MM-DD`
2. ✅ Merges PRs in order using `--no-ff` (preserves history)
3. ✅ Runs final verification gate (lint, typecheck, build)
4. ✅ Merges release branch to `main`
5. ✅ Pushes to `origin/main` (triggers Vercel deployment)

**Safety**: If any merge conflicts or test failures occur, script stops and provides rollback instructions.

---

## 🎯 Prerequisites

### Required Tools

1. **Git** - Version control

   ```bash
   git --version  # Should be 2.x+
   ```

2. **GitHub CLI** - For PR operations

   ```bash
   gh --version  # Should be installed
   gh auth status  # Should show "Logged in"
   ```

3. **pnpm** - Package manager

   ```bash
   pnpm --version  # Should be 8.x+
   ```

4. **Node.js** - Runtime
   ```bash
   node --version  # Should be 18.x+
   ```

### Before Running

- [ ] All PRs you want to merge exist (#35, #34, #31, #33)
- [ ] You're in the project root directory
- [ ] You have push access to the repository
- [ ] Working directory is clean (no uncommitted changes)
- [ ] GitHub CLI is authenticated (`gh auth login`)

---

## 🚀 Usage Examples

### Recommended: Dry Run First

Always do a dry run first to see what will happen:

```powershell
# PowerShell
.\scripts\release-merge.ps1 -DryRun

# Bash
./scripts/release-merge.sh --dry-run
```

**Output**: Shows all steps without making changes. Review carefully.

### Full Production Merge

Once dry run looks good:

```powershell
# PowerShell
.\scripts\release-merge.ps1

# Bash
./scripts/release-merge.sh
```

**Duration**: ~15-25 minutes total  
**Result**: All PRs merged to main, Vercel deployment triggered

### Skip Tests (Not Recommended)

Only use if you're certain all PRs are already tested:

```powershell
# PowerShell
.\scripts\release-merge.ps1 -SkipTests

# Bash
./scripts/release-merge.sh --skip-tests
```

**Warning**: Skipping tests is risky. Only use if you've manually verified all PRs.

---

## 🔍 What to Watch For

### During Execution

The scripts provide color-coded output:

- 🔷 **Cyan**: Phase headers and sections
- ✅ **Green**: Successful operations
- ⚠️ **Yellow**: Warnings or dry-run actions
- ❌ **Red**: Errors requiring attention
- → **Gray**: Step descriptions

### Success Indicators

```
✅ Working tree is clean
✅ Backup branch created
✅ Backup tag created
✅ Lint passed
✅ Type check passed
✅ Build passed
✅ Merged PR #XX
✅ SUCCESS: All phases completed
```

### Failure Indicators

```
❌ Working tree is not clean!
❌ Lint failed for PR #XX
❌ Build failed!
❌ PHASE 2 FAILED: X PR(s) did not pass verification
```

---

## 🚨 Troubleshooting

### Script Fails During PHASE 1

**Error**: "Working tree is not clean"

**Solution**:

```bash
# See what's uncommitted
git status

# Commit or stash changes
git add .
git commit -m "save work"
# OR
git stash
```

### Script Fails During PHASE 2

**Error**: "PR #XX failed at [lint|typecheck|build]"

**Solution**:

1. Checkout that PR: `gh pr checkout XX`
2. Fix the issues locally
3. Run tests: `pnpm lint && pnpm typecheck && pnpm build`
4. Commit fixes
5. Push to PR branch
6. Re-run the release script

### Script Fails During PHASE 3

**Error**: "Merge conflict"

**Solution**:

```bash
# Abort the merge
git merge --abort

# Return to main
git checkout main

# Delete release branch
git branch -D release/merge-YYYY-MM-DD

# Manually resolve conflicts in PRs, then re-run script
```

### Need to Rollback After Successful Merge

If deployment breaks in production:

```bash
# Using backup tag
git checkout v-pre-merge-YYYY-MM-DD
git push origin v-pre-merge-YYYY-MM-DD:main --force

# OR using backup branch
git checkout backup/main-before-merge-YYYY-MM-DD
git push origin backup/main-before-merge-YYYY-MM-DD:main --force
```

**Result**: Vercel automatically redeploys the rollback state.

---

## 📊 Expected Timeline

| Phase     | Duration      | Actions                   |
| --------- | ------------- | ------------------------- |
| Phase 1   | 1-2 min       | Create backups            |
| Phase 2   | 10-15 min     | Test 4 PRs (2-4 min each) |
| Phase 3   | 5-10 min      | Merge, test, push         |
| **Total** | **16-27 min** | **Complete process**      |

Add 5-7 minutes for Vercel deployment after script completes.

---

## 🎯 Best Practices

### DO

- ✅ Always run with `--dry-run` first
- ✅ Review dry-run output carefully
- ✅ Keep terminal open during execution
- ✅ Monitor Vercel dashboard after deployment
- ✅ Test production site after deployment
- ✅ Keep backup references handy for 48 hours

### DON'T

- ❌ Don't close terminal while script is running
- ❌ Don't skip tests unless absolutely necessary
- ❌ Don't force-push to main manually
- ❌ Don't delete backup branches/tags immediately
- ❌ Don't run multiple times simultaneously

---

## 🔐 Security Notes

### What Gets Backed Up

- ✅ All code in main branch
- ✅ Commit history
- ✅ Branch state

### What's NOT Backed Up

- ❌ GitHub Secrets (stored separately)
- ❌ Vercel environment variables (stored in dashboard)
- ❌ Local `.env` files (never committed)

**Action**: Verify environment variables in Vercel dashboard match requirements before deployment.

---

## 📝 Script Output Files

### During Execution

Scripts create these Git references:

- **Branch**: `backup/main-before-merge-YYYY-MM-DD`
  - Full backup of main before merge
  - Pushed to remote
  - Keep for at least 30 days

- **Tag**: `v-pre-merge-YYYY-MM-DD`
  - Immutable snapshot of main
  - Pushed to remote
  - Keep indefinitely

- **Branch**: `release/merge-YYYY-MM-DD`
  - Temporary merge branch
  - Can be deleted after successful merge
  - Preserved automatically in Git history

### Verifying Backups

```bash
# List backup branches
git branch -a | grep backup

# List backup tags
git tag -l "v-pre-merge-*"

# View specific backup
git show v-pre-merge-YYYY-MM-DD
```

---

## 🧪 Testing the Scripts

### Test with Dry Run

```powershell
# PowerShell - shows all actions without executing
.\scripts\release-merge.ps1 -DryRun
```

**Expected Output**:

- "DRY RUN: Would create backup branch..."
- "DRY RUN: Would checkout PR #XX..."
- "DRY RUN: Would merge..."
- No actual Git operations performed

### Verify Prerequisites

```bash
# Check all tools
git --version && \
gh auth status && \
pnpm --version && \
node --version

# All should succeed
```

---

## 📞 Getting Help

### If Script Fails

1. **Read the error message** - Scripts provide specific guidance
2. **Check rollback instructions** - Shown automatically on failure
3. **Review this README** - See troubleshooting section above

### Manual Rollback

Always possible using backups created in Phase 1:

```bash
# View backups
git branch -a | grep backup
git tag -l "v-pre-merge-*"

# Rollback to backup
git checkout [backup-name]
git push origin [backup-name]:main --force
```

### Emergency Stop

If you need to stop the script:

**Windows**: Press `Ctrl+C`  
**Linux/macOS**: Press `Ctrl+C`

Then check current state:

```bash
git status
git branch
```

Clean up if needed:

```bash
git merge --abort  # If in middle of merge
git checkout main
```

---

## ✅ Post-Merge Checklist

After successful merge:

- [ ] Monitor Vercel deployment (~5-7 minutes)
- [ ] Check Vercel dashboard for deployment status
- [ ] Visit production site and test key functionality
- [ ] Check browser console for errors
- [ ] Verify environment variables are correct
- [ ] Monitor error logs for 1 hour
- [ ] Keep backup references for 48 hours
- [ ] Document any issues in GitHub Issues

---

## 🎉 Success Indicators

### Script Completed Successfully

```
✅ SUCCESS: All phases completed

Backup created:
  Branch: backup/main-before-merge-YYYY-MM-DD
  Tag: v-pre-merge-YYYY-MM-DD

Deployment:
  Vercel will deploy main branch in ~5-7 minutes
  Monitor at: https://vercel.com/dashboard
```

### Vercel Deployment Successful

- Vercel dashboard shows "Ready" status
- Production URL loads without errors
- No console errors in browser
- All pages accessible

---

## 📚 Additional Resources

- **Git Documentation**: https://git-scm.com/doc
- **GitHub CLI**: https://cli.github.com/manual/
- **Vercel Deployment**: https://vercel.com/docs/deployments
- **Project Documentation**: See `WORKFLOW_SYNC_GUIDE.md`

---

**Last Updated**: December 14, 2025  
**Maintained By**: 3000 Studios Development Team

**Questions?** See troubleshooting section or create a GitHub issue.
