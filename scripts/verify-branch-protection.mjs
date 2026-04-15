#!/usr/bin/env node

/**
 * Branch Protection Verification Script
 *
 * This script verifies that the main branch has proper protection rules enabled.
 * Run this locally to check the current status of branch protection.
 *
 * Usage:
 *   npm run verify-branch-protection
 *   or
 *   node scripts/verify-branch-protection.mjs
 *
 * Requires: GITHUB_TOKEN environment variable with repo access
 */

import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

const REQUIRED_RULES = {
  prRequired: 'Pull request before merging',
  approvalsRequired: 'Minimum 1 approval',
  dismissStale: 'Dismiss stale approvals',
  statusChecksRequired: 'Status checks requirement',
  upToDateRequired: 'Up-to-date branch requirement',
  restrictPush: 'Push restrictions',
};

async function verifyBranchProtection() {
  console.log('🔍 Verifying Branch Protection Rules for main branch...\n');

  // Check for GitHub token
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ Error: GITHUB_TOKEN environment variable is required');
    console.error('   Set it with: export GITHUB_TOKEN=your_token');
    console.error('   Get a token from: https://github.com/settings/tokens\n');
    process.exit(1);
  }

  const octokit = new Octokit({ auth: token });

  // Get repository info from git remote
  const repoInfo = await getRepoInfo();
  if (!repoInfo) {
    console.error('❌ Error: Could not determine repository information');
    console.error('   Make sure you are in a git repository\n');
    process.exit(1);
  }

  const { owner, repo } = repoInfo;
  console.log(`📦 Repository: ${owner}/${repo}`);
  console.log(`🌿 Branch: main\n`);

  try {
    // Get branch protection rules
    const { data: protection } = await octokit.rest.repos.getBranchProtection({
      owner,
      repo,
      branch: 'main',
    });

    // Verify each rule
    const checks = {
      prRequired: protection.required_pull_request_reviews !== null,
      approvalsRequired:
        protection.required_pull_request_reviews?.required_approving_review_count >= 1,
      dismissStale: protection.required_pull_request_reviews?.dismiss_stale_reviews === true,
      statusChecksRequired: protection.required_status_checks !== null,
      upToDateRequired: protection.required_status_checks?.strict === true,
      restrictPush: protection.restrictions !== null,
    };

    console.log('📋 Branch Protection Rules Status:\n');

    let allPassed = true;
    for (const [key, description] of Object.entries(REQUIRED_RULES)) {
      const status = checks[key] ? '✅' : '❌';
      const statusText = checks[key] ? 'ENABLED' : 'DISABLED';
      console.log(`${status} ${description}: ${statusText}`);
      if (!checks[key]) allPassed = false;
    }

    console.log('\n' + '='.repeat(60) + '\n');

    if (allPassed) {
      console.log('✅ SUCCESS: All branch protection rules are properly configured!\n');
      console.log('The main branch is protected against:');
      console.log('  • Direct pushes without review');
      console.log('  • Unreviewed code changes');
      console.log('  • Breaking changes');
      console.log('  • Revenue-impacting modifications\n');
      process.exit(0);
    } else {
      console.log('⚠️  WARNING: Some protection rules are missing!\n');
      console.log('Action required:');
      console.log(`  1. Navigate to: https://github.com/${owner}/${repo}/settings/branches`);
      console.log('  2. Edit the protection rule for main branch');
      console.log('  3. Enable all missing rules shown above\n');
      console.log('See .github/BRANCH_PROTECTION_SETUP.md for detailed instructions.\n');
      process.exit(1);
    }
  } catch (error) {
    if (error.status === 404) {
      console.log('❌ CRITICAL: Branch protection is NOT enabled for main branch!\n');
      console.log('The main branch is currently UNPROTECTED. This means:');
      console.log('  • Anyone can push directly to main');
      console.log('  • No code review required');
      console.log('  • No CI checks enforcement');
      console.log('  • HIGH RISK of breaking production\n');
      console.log('Immediate action required:');
      console.log(`  1. Navigate to: https://github.com/${owner}/${repo}/settings/branches`);
      console.log('  2. Click "Add rule" under Branch protection rules');
      console.log('  3. Set branch name pattern: main');
      console.log('  4. Enable all required protections\n');
      console.log('See .github/BRANCH_PROTECTION_SETUP.md for complete setup guide.\n');
      process.exit(1);
    } else if (error.status === 401) {
      console.error('❌ Error: Authentication failed');
      console.error('   Your GITHUB_TOKEN may be invalid or expired');
      console.error('   Generate a new token: https://github.com/settings/tokens\n');
      process.exit(1);
    } else if (error.status === 403) {
      console.error('❌ Error: Permission denied');
      console.error('   Your token does not have permission to read branch protection');
      console.error('   Ensure your token has "repo" scope\n');
      process.exit(1);
    } else {
      console.error('❌ Unexpected error:', error.message);
      console.error('   Status:', error.status);
      process.exit(1);
    }
  }
}

async function getRepoInfo() {
  try {
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();

    // Parse GitHub URL
    const match = remoteUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2],
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Run verification
verifyBranchProtection().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
