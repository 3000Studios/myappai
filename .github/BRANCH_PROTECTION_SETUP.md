# Branch Protection Rules Setup Guide

This guide provides step-by-step instructions for configuring branch protection rules for the `main` branch to ensure code quality, security, and prevent accidental changes.

## 🎯 Objective

Protect the `main` branch from:

- Direct pushes without review
- Unreviewed code changes
- Breaking changes
- Accidental revenue-impacting modifications
- Unauthorized access

## 🤖 Automated Configuration (Recommended)

Branch protection can now be configured automatically using our configuration-as-code approach.

### Quick Setup

1. **Review the configuration file**:

   ```bash
   cat .github/branch-protection-config.yml
   ```

2. **Apply configuration automatically**:

   ```bash
   # Requires GITHUB_TOKEN with admin access
   export GITHUB_TOKEN=your_admin_token
   npm run configure-branch-protection
   ```

3. **Or trigger via GitHub Actions**:
   - Go to **Actions** tab → **Configure Branch Protection**
   - Click **Run workflow**
   - Choose your options and run

### Configuration File

All protection rules are defined in `.github/branch-protection-config.yml`. To modify rules:

1. Edit `.github/branch-protection-config.yml`
2. Commit and push to `main` branch (or create PR)
3. Workflow automatically applies changes

### Benefits of Automated Configuration

- ✅ **Version controlled** - Protection rules are tracked in git
- ✅ **Consistent** - Same rules applied every time
- ✅ **Auditable** - Changes are documented in commit history
- ✅ **Reproducible** - Easy to apply to multiple branches/repos

## 📋 Manual Configuration (Alternative)

If you prefer manual setup or don't have admin API access:

### Access Through GitHub UI

1. Navigate to: **Repository → Settings → Branches**
2. Under **Branch protection rules**, click **Add rule**
3. Set **Branch name pattern**: `main`

### Protection Settings to Enable

#### ✅ Pull Request Requirements

**Require a pull request before merging**

- ✅ Enable this option
- **Require approvals**: Set to `1` minimum
- ✅ **Dismiss stale approvals when new commits are pushed**
  - This ensures reviewers must re-approve after changes

**Benefits:**

- All changes go through code review
- Prevents unreviewed code from reaching production
- Maintains code quality standards

#### ✅ Status Check Requirements

**Require status checks to pass before merging**

- ✅ Enable this option
- ✅ **Require branches to be up to date before merging**
- **Required status checks**:
  - `build` - Build must succeed
  - `lint` - Code must pass linting
  - `type-check` - TypeScript types must be valid

**Benefits:**

- Ensures code builds successfully
- Validates code quality
- Prevents broken code from being merged

#### ✅ Push Restrictions

**Restrict who can push to matching branches**

- ✅ Enable this option
- **People, teams, or apps with push access**: Add ONLY repository owner
- **Bypass list**: Leave empty (no one should bypass)

**Benefits:**

- Prevents direct pushes to main
- Forces all changes through PR workflow
- Maintains audit trail

#### ⚠️ Additional Recommended Settings

**Do not allow bypassing the above settings** (if available)

- Ensures protection rules apply to all contributors

**Require linear history** (optional but recommended)

- ✅ Enable to prevent merge commits
- Keeps git history clean

**Include administrators** (recommended)

- ✅ Apply these rules even to repository admins
- Ensures consistent workflow

## 🔄 Workflow After Protection

With these rules enabled:

### Making Changes

```bash
# 1. Create a feature branch
git checkout -b feature/my-changes

# 2. Make your changes and commit
git add .
git commit -m "feat: description of changes"

# 3. Push to remote
git push origin feature/my-changes

# 4. Open Pull Request on GitHub
# - Navigate to repository
# - Click "Pull requests" → "New pull request"
# - Select your branch
# - Add description
# - Request review

# 5. Wait for:
# - CI checks to pass (build, lint, type-check)
# - At least 1 approval from reviewer
# - Branch to be up to date with main

# 6. Merge PR (only possible if all requirements met)
```

### Emergency Hotfixes

For critical production issues:

1. Create hotfix branch: `hotfix/critical-issue`
2. Make minimal, focused changes
3. Open PR with "HOTFIX" in title
4. Expedite review process
5. Merge after approval and checks pass

**Note:** Even hotfixes must go through the PR process. Direct pushes are blocked.

## 🛡️ Protection Against Revenue Breakage

These rules specifically protect against:

1. **Unreviewed Payment Logic Changes**
   - Stripe/PayPal integration modifications require approval
   - Changes to ads.txt require review
   - AdSense CMP logic changes must be verified

2. **Environment Variable Accidents**
   - Changes to .env.example require review
   - Secret management changes need approval
   - Configuration updates are documented

3. **Security Vulnerabilities**
   - CodeQL scans run on all PRs
   - Security vulnerabilities block merging
   - Dependencies are audited

## 🤖 Automated Enforcement

The repository includes automated workflows that enforce these rules:

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every PR:

- ✅ `pnpm install` - Install dependencies
- ✅ `pnpm lint` - ESLint validation
- ✅ `pnpm type-check` - TypeScript validation
- ✅ `pnpm build` - Build verification

### Required for Merge

All checks must pass before the PR can be merged.

## 📊 Monitoring and Compliance

### Verify Protection is Active

Run the verification script:

```bash
npm run verify-branch-protection
```

Or manually check:

```bash
# Try to push directly to main (should fail)
git checkout main
git commit --allow-empty -m "test"
git push origin main
# Expected: "remote: error: GH006: Protected branch update failed"
```

### Audit Trail

Every change to main is tracked:

- PR number and title
- Reviewer who approved
- Time of merge
- CI check results

Access audit log: **Repository → Insights → Network** or **Pulse**

## 🆘 Troubleshooting

### "Cannot push to protected branch"

**Solution:** This is expected. Create a PR instead of pushing directly.

### "Status checks haven't completed"

**Solution:** Wait for CI workflow to finish. Check Actions tab for progress.

### "Branch is out of date"

**Solution:** Update your branch:

```bash
git checkout your-branch
git fetch origin
git rebase origin/main
git push --force-with-lease
```

### "Approval required"

**Solution:** Request review from repository owner or designated reviewer.

## 📝 Summary Checklist

Once configured, verify these are enabled:

- [x] **Branch name pattern**: `main`
- [x] **Require pull request before merging**: YES
- [x] **Require approvals**: 1 minimum
- [x] **Dismiss stale approvals**: YES
- [x] **Require status checks to pass**: YES
- [x] **Require branches to be up to date**: YES
- [x] **Required checks**: build, lint, type-check
- [x] **Restrict pushes**: Owner only
- [x] **Include administrators**: YES (recommended)

## 🔗 Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Best Practices for Protected Branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches#best-practices)

---

**Status:** Configuration guide complete. Repository owner must apply these settings through GitHub UI.

**Last Updated:** 2025-12-17
