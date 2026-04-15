# 🛡️ Branch Protection & Code Quality Guide

## 📋 Overview

This repository implements comprehensive branch protection for the `main` branch to ensure code quality, prevent accidental changes, and protect revenue-critical code.

## 🎯 Goals

- ✅ **No direct pushes to main** - All changes go through Pull Requests
- ✅ **No silent changes** - Every modification is reviewed and tracked
- ✅ **No accidental revenue breakage** - CI checks catch issues before merge
- ✅ **Code quality enforcement** - Automated linting, type-checking, and testing
- ✅ **Security** - Secret detection and vulnerability scanning

## 🚀 Quick Start

### 1. Setup (One-time)

```bash
# Install git hooks for local validation
./scripts/setup-git-hooks.sh

# Verify branch protection is enabled (requires GITHUB_TOKEN)
export GITHUB_TOKEN=your_github_token
npm run verify-branch-protection
```

### 2. Daily Workflow

```bash
# Create a feature branch
git checkout -b feature/my-awesome-feature

# Make your changes
# ... edit files ...

# Commit your changes
git add .
git commit -m "feat: add awesome feature"

# Push to remote (pre-push hooks will validate)
git push origin feature/my-awesome-feature

# Open Pull Request on GitHub
# - Navigate to repository
# - Click "Pull requests" → "New pull request"
# - Select your branch
# - Add description
# - Request review

# Wait for:
# - CI checks to pass ✅
# - Code review approval ✅
# - Branch up-to-date ✅

# Merge via GitHub UI
```

## 📁 Files and Documentation

### Documentation

- **[BRANCH_PROTECTION_SETUP.md](BRANCH_PROTECTION_SETUP.md)** - Complete setup guide with step-by-step instructions
- **[BRANCH_PROTECTION_RULES.md](BRANCH_PROTECTION_RULES.md)** - Quick reference for required rules
- **[BRANCH_PROTECTION_README.md](BRANCH_PROTECTION_README.md)** - This comprehensive workflow guide

### Scripts

- **[verify-branch-protection.mjs](../scripts/verify-branch-protection.mjs)** - Check branch protection status
- **[pre-push-hook.sh](../scripts/pre-push-hook.sh)** - Git pre-push validation hook
- **[setup-git-hooks.sh](../scripts/setup-git-hooks.sh)** - Install git hooks

### Workflows

- **[branch-protection-check.yml](workflows/branch-protection-check.yml)** - Daily automated verification
- **[ci.yml](workflows/ci.yml)** - Continuous integration checks

## ⚙️ Configuration Required

### GitHub Branch Protection Rules

**Repository Owner Must Configure:**

1. Navigate to: **Settings → Branches**
2. Click "Add rule" under Branch protection rules
3. Branch name pattern: `main`
4. Enable these settings:

```yaml
✅ Require a pull request before merging
   ✅ Require approvals: 1
   ✅ Dismiss stale approvals when new commits are pushed

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   ✅ Status checks required:
      - build
      - lint
      - type-check

✅ Restrict who can push to matching branches
   - Repository Owner ONLY

✅ Do not allow bypassing the above settings (recommended)
✅ Require linear history (recommended)
✅ Include administrators (recommended)
```

**See [BRANCH_PROTECTION_SETUP.md](.github/BRANCH_PROTECTION_SETUP.md) for detailed instructions.**

## 🔄 CI/CD Pipeline

### Automated Checks on Every PR

When you open a Pull Request, the following checks run automatically:

1. **Lint** - ESLint validation
2. **Type Check** - TypeScript validation
3. **Build** - Next.js build verification

All checks must pass before merging is allowed.

### Daily Verification

A GitHub Action runs daily at 9 AM UTC to verify branch protection is still enabled:

- Checks all required rules
- Creates an issue if protection is disabled
- Sends notifications

## 🛠️ Local Validation

### Pre-Push Hook

When git hooks are installed (via `./scripts/setup-git-hooks.sh`), the following validations run before every push:

- ✅ TypeScript type checking
- ✅ ESLint validation
- ✅ Large file detection (>5MB)
- ✅ Secret detection
- ✅ Warning if pushing to main

### Manual Validation

Run checks manually anytime:

```bash
# TypeScript
npm run type-check

# Linting
npm run lint

# Build
npm run build

# All checks
npm run type-check && npm run lint && npm run build

# Branch protection status
npm run verify-branch-protection
```

## 🚨 What If Protection Is Disabled?

If branch protection is accidentally disabled:

1. **Automated Alert** - GitHub Action creates an issue
2. **Manual Check** - Run `npm run verify-branch-protection`
3. **Immediate Action** - Re-enable protection following [BRANCH_PROTECTION_SETUP.md](.github/BRANCH_PROTECTION_SETUP.md)

## ❓ FAQ

### Q: Can I push directly to main?

**A:** No. GitHub will block the push if protection is enabled. All changes must go through Pull Requests.

### Q: What if I need to make an urgent hotfix?

**A:** Create a `hotfix/*` branch, make minimal changes, open PR, get expedited review, and merge. Even hotfixes go through PRs.

### Q: Can I bypass the pre-push hook?

**A:** Yes, with `git push --no-verify`, but this is **NOT recommended**. Your PR will still need to pass CI checks.

### Q: What if CI checks fail?

**A:** Fix the issues in your branch, commit, and push again. CI will re-run automatically.

### Q: How do I update my branch with latest main?

```bash
git checkout your-branch
git fetch origin
git rebase origin/main
git push --force-with-lease
```

### Q: I'm getting "protected branch update failed"

**A:** This is expected! You cannot push directly to main. Create a feature branch instead.

## 🔐 Security Features

### Secret Detection

- Pre-push hook scans for potential secrets
- Warns before pushing sensitive data
- Patterns checked: API keys, passwords, tokens, credentials

### Dependency Security

- Dependabot creates PRs for security updates
- Auto-merge for trusted dependencies
- Weekly security audits

### Code Review

- Minimum 1 approval required
- Stale approvals dismissed on new commits
- Full audit trail maintained

## 📊 Monitoring

### Check Protection Status

```bash
# Command line
npm run verify-branch-protection

# GitHub UI
Settings → Branches → View rules

# Automated
Check .github/workflows/branch-protection-check.yml logs
```

### Audit Log

Every change to main is tracked:

- PR number and title
- Reviewer who approved
- CI check results
- Merge time and author

Access: **Repository → Insights → Network** or **Pulse**

## 🔗 Additional Resources

- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Pull Request Best Practices](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests)
- [Git Workflow Guide](https://guides.github.com/introduction/flow/)

## 🎯 Success Criteria

Branch protection is successfully configured when:

- [ ] All settings from [BRANCH_PROTECTION_RULES.md](.github/BRANCH_PROTECTION_RULES.md) are enabled
- [ ] `npm run verify-branch-protection` passes
- [ ] Direct push to main fails with "Protected branch update failed"
- [ ] PRs require approval before merging
- [ ] CI checks must pass before merging
- [ ] Git hooks are installed locally
- [ ] Daily verification workflow runs successfully

---

**Status:** Documentation Complete
**Last Updated:** 2025-12-17
**Maintained By:** Repository Owner
