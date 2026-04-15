# Branch Protection Configuration - Test Scenarios

## Manual Testing Guide

This document provides test scenarios to verify the branch protection configuration system.

## Prerequisites

- GitHub Personal Access Token with `repo` scope and admin access
- Local clone of the repository
- Node.js 20.x installed

## Test Scenario 1: Validate Configuration File

**Objective**: Ensure the YAML configuration file is valid and contains correct structure.

```bash
# Load and parse the configuration
node -e "import('yaml').then(m => { const fs = require('fs'); const content = fs.readFileSync('.github/branch-protection-config.yml', 'utf-8'); const config = m.parse(content); console.log(JSON.stringify(config, null, 2)); })"
```

**Expected Result**:

- Configuration loads without errors
- Contains `branch`, `required_pull_request_reviews`, `required_status_checks` fields
- All boolean values are properly set

## Test Scenario 2: Script Syntax Validation

**Objective**: Verify all JavaScript/Node scripts have valid syntax.

```bash
# Check configuration script
node --check scripts/configure-branch-protection.mjs
echo "Configure script: $?"

# Check verification script
node --check scripts/verify-branch-protection.mjs
echo "Verify script: $?"
```

**Expected Result**:

- Both commands exit with code 0
- No syntax errors reported

## Test Scenario 3: Configuration Script (Dry Run)

**Objective**: Test the configuration script loads config and validates permissions.

```bash
# Set a test token (or use real token with admin access)
export GITHUB_TOKEN=ghp_your_test_token

# Run configuration script
npm run configure-branch-protection
```

**Expected Behaviors**:

**Without Token**:

```
❌ Error: GITHUB_TOKEN environment variable is required
```

**With Invalid Token**:

```
❌ Error: Authentication failed
```

**With Valid Token (No Admin)**:

```
❌ Error: Insufficient permissions
```

**With Valid Admin Token**:

```
✅ Admin access confirmed
🚀 Applying branch protection rules...
✅ SUCCESS: Branch protection rules configured!
```

## Test Scenario 4: Verification Script

**Objective**: Test the verification script checks branch protection status.

```bash
# Set GitHub token
export GITHUB_TOKEN=ghp_your_token

# Run verification
npm run verify-branch-protection
```

**Expected Behaviors**:

**If Protection Not Enabled**:

```
❌ CRITICAL: Branch protection is NOT enabled for main branch!
```

**If Protection Enabled but Incomplete**:

```
⚠️  WARNING: Some protection rules are missing!
❌ Minimum 1 approval: DISABLED
❌ Status checks requirement: DISABLED
```

**If Protection Fully Configured**:

```
✅ Pull request before merging: ENABLED
✅ Minimum 1 approval: ENABLED
✅ Dismiss stale approvals: ENABLED
✅ Status checks requirement: ENABLED
✅ Up-to-date branch requirement: ENABLED
✅ SUCCESS: All branch protection rules are properly configured!
```

## Test Scenario 5: GitHub Action Workflow Validation

**Objective**: Ensure the GitHub Action workflow has valid syntax.

```bash
# Validate workflow YAML
npx js-yaml .github/workflows/configure-branch-protection.yml > /dev/null
echo "Workflow validation: $?"
```

**Expected Result**:

- Exit code 0
- No YAML parsing errors

## Test Scenario 6: Workflow Manual Trigger (Dry Run)

**Objective**: Test the GitHub Action workflow in dry-run mode.

**Steps**:

1. Navigate to repository on GitHub.com
2. Go to **Actions** tab
3. Select **Configure Branch Protection** workflow
4. Click **Run workflow**
5. Check **dry_run** option
6. Click **Run workflow** button

**Expected Result**:

- Workflow runs successfully
- Shows "DRY RUN MODE" message
- Displays configuration that would be applied
- No actual changes made to branch protection

## Test Scenario 7: Full Configuration Application

**Objective**: Apply branch protection rules and verify they're active.

**Prerequisites**:

- Must have admin access to repository
- GITHUB_TOKEN with admin permissions

**Steps**:

1. **Apply Configuration**:

   ```bash
   export GITHUB_TOKEN=ghp_your_admin_token
   npm run configure-branch-protection
   ```

2. **Verify Application**:

   ```bash
   npm run verify-branch-protection
   ```

3. **Test Protection (Direct Push)**:
   ```bash
   git checkout main
   git commit --allow-empty -m "test: verify protection"
   git push origin main
   ```

**Expected Results**:

1. Configuration applies successfully
2. Verification shows all rules enabled
3. Direct push fails with:
   ```
   remote: error: GH006: Protected branch update failed
   ```

## Test Scenario 8: Modify Configuration and Reapply

**Objective**: Test that configuration changes can be applied.

**Steps**:

1. **Modify Configuration**:

   ```bash
   # Edit .github/branch-protection-config.yml
   # Change required_approving_review_count from 1 to 2
   ```

2. **Reapply**:

   ```bash
   npm run configure-branch-protection
   ```

3. **Verify Change**:
   - Check GitHub UI: Settings → Branches → main rule
   - Should show "Require 2 approvals"

## Test Scenario 9: Workflow Auto-Trigger on Config Change

**Objective**: Verify workflow runs when configuration changes.

**Steps**:

1. **Make Change**:

   ```bash
   # Edit .github/branch-protection-config.yml
   # Add a comment or modify a value
   git add .github/branch-protection-config.yml
   git commit -m "chore: update branch protection config"
   git push origin main
   ```

2. **Check Actions**:
   - Navigate to Actions tab
   - Verify "Configure Branch Protection" workflow triggered
   - Check workflow completes successfully

**Expected Result**:

- Workflow runs automatically
- Configuration applied successfully
- Verification step passes

## Test Scenario 10: Error Handling

**Objective**: Verify scripts handle errors gracefully.

**Test Cases**:

1. **Missing Configuration File**:

   ```bash
   mv .github/branch-protection-config.yml /tmp/
   npm run configure-branch-protection
   # Should show: ❌ Error: Could not load configuration file
   mv /tmp/branch-protection-config.yml .github/
   ```

2. **Invalid YAML Syntax**:

   ```bash
   echo "invalid: yaml: : :" >> .github/branch-protection-config.yml
   npm run configure-branch-protection
   # Should show YAML parsing error
   git checkout .github/branch-protection-config.yml
   ```

3. **Network Error**:
   ```bash
   # Temporarily disconnect network or use invalid GitHub URL
   # Should show connection error
   ```

## Success Criteria

All test scenarios should:

- ✅ Execute without crashes
- ✅ Provide clear, actionable error messages
- ✅ Successfully apply configuration when credentials are valid
- ✅ Properly validate inputs and configuration
- ✅ Handle edge cases gracefully

## Notes

- **Security**: Never commit actual GitHub tokens
- **Permissions**: Admin access required for configuration
- **Testing**: Use a test repository if possible
- **Cleanup**: Reset branch protection after testing if needed

## Automated Testing

For CI/CD integration, these tests could be automated:

- Syntax validation (already in CI)
- YAML parsing
- Script validation
- Workflow validation

Actual branch protection application requires admin credentials and should be tested in staging/test repos.

---

**Last Updated**: 2025-12-27
**Status**: Ready for manual testing
