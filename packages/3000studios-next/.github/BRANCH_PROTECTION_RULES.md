# Branch Protection Rules - Quick Reference

## 🎯 Purpose

Protect the `main` branch from accidental changes, ensure code quality, and prevent revenue-breaking modifications.

## 📍 Configuration Location

**GitHub Repository → Settings → Branches → Branch protection rules**

## 🔐 Required Protection Rules

### Branch Pattern

```
main
```

### 1️⃣ Pull Request Requirements

```yaml
Require a pull request before merging: ✅ YES
  Required approvals: 1
  Dismiss stale pull request approvals: ✅ YES
  Require review from Code Owners: Optional
```

### 2️⃣ Status Check Requirements

```yaml
Require status checks to pass: ✅ YES
  Require branches to be up to date: ✅ YES
  Status checks that are required:
    - build
    - lint
    - type-check
```

### 3️⃣ Push Restrictions

```yaml
Restrict who can push to matching branches: ✅ YES
  People, teams, or apps with push access:
    - Repository Owner ONLY
```

### 4️⃣ Additional Settings (Recommended)

```yaml
Require linear history: ✅ YES (keeps git history clean)
Do not allow bypassing settings: ✅ YES
Include administrators: ✅ YES (recommended)
Allow force pushes: ❌ NO
Allow deletions: ❌ NO
```

## 🚨 Result

When properly configured:

✅ **NO direct pushes to main**

- All changes must go through Pull Request
- Forces code review workflow

✅ **NO silent changes**

- Every change tracked through PR
- Full audit trail maintained

✅ **NO accidental revenue breakage**

- CI checks prevent broken builds
- Type checking catches errors
- Code review catches logic issues

## 🔄 Developer Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-changes

# 2. Make changes and commit
git add .
git commit -m "feat: description"

# 3. Push to remote
git push origin feature/my-changes

# 4. Open Pull Request on GitHub
# 5. Wait for CI checks + approval
# 6. Merge PR (only if all requirements met)
```

## ✅ Verification

Run this command to verify protection is active:

```bash
npm run verify-branch-protection
```

Or check manually:

```bash
# Try direct push (should fail)
git push origin main
# Expected: "Protected branch update failed"
```

## 🔗 Full Documentation

See [BRANCH_PROTECTION_SETUP.md](.github/BRANCH_PROTECTION_SETUP.md) for:

- Detailed setup instructions
- Troubleshooting guide
- Emergency hotfix procedures
- Monitoring and compliance

## 📊 Automated Monitoring

A GitHub Action runs daily to verify protection rules are still active:

- `.github/workflows/branch-protection-check.yml`
- Creates issue if protection is disabled
- Sends notifications

## 🆘 If Protection is Disabled

1. **Immediate Action Required**
2. Navigate to: Repository → Settings → Branches
3. Click "Add rule" or edit existing rule
4. Follow checklist above
5. Run verification: `npm run verify-branch-protection`

---

**Priority**: 🔴 CRITICAL
**Impact**: Prevents production incidents and revenue loss
**Maintenance**: Verify monthly
