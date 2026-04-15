#!/usr/bin/env node

/**
 * Branch Protection Configuration Script
 *
 * This script automatically configures branch protection rules using the GitHub API.
 * It reads configuration from .github/branch-protection-config.yml and applies it.
 *
 * Usage:
 *   npm run configure-branch-protection
 *   or
 *   node scripts/configure-branch-protection.mjs
 *
 * Requires: GITHUB_TOKEN environment variable with admin:repo_hook and repo scopes
 */

import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function configureBranchProtection() {
  console.log('🔧 Configuring Branch Protection Rules...\n');

  // Check for GitHub token
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ Error: GITHUB_TOKEN environment variable is required');
    console.error('   Set it with: export GITHUB_TOKEN=your_token');
    console.error('   Token needs "repo" scope for admin access');
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

  // Load configuration from YAML file
  const configPath = resolve(__dirname, '../.github/branch-protection-config.yml');
  let config;

  try {
    const configContent = readFileSync(configPath, 'utf-8');
    config = yaml.parse(configContent);
    console.log(`📄 Configuration loaded from: ${configPath}`);
    console.log(`🌿 Target branch: ${config.branch}\n`);
  } catch (error) {
    console.error('❌ Error: Could not load configuration file');
    console.error(`   Path: ${configPath}`);
    console.error(`   Error: ${error.message}\n`);
    process.exit(1);
  }

  try {
    // Check if we have admin access
    console.log('🔐 Checking permissions...');
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });

    if (!repoData.permissions?.admin) {
      console.error('❌ Error: Insufficient permissions');
      console.error('   You need admin access to configure branch protection');
      console.error('   Your token must have "repo" scope with admin privileges\n');
      process.exit(1);
    }
    console.log('✅ Admin access confirmed\n');

    // Prepare branch protection parameters
    const protectionParams = {
      owner,
      repo,
      branch: config.branch,
      required_status_checks: config.required_status_checks
        ? {
            strict: config.required_status_checks.strict,
            contexts: config.required_status_checks.contexts || [],
          }
        : null,
      enforce_admins: config.enforce_admins || false,
      required_pull_request_reviews: config.required_pull_request_reviews
        ? {
            dismiss_stale_reviews:
              config.required_pull_request_reviews.dismiss_stale_reviews || false,
            require_code_owner_reviews:
              config.required_pull_request_reviews.require_code_owner_reviews || false,
            required_approving_review_count:
              config.required_pull_request_reviews.required_approving_review_count || 1,
            require_last_push_approval:
              config.required_pull_request_reviews.require_last_push_approval || false,
          }
        : null,
      restrictions:
        config.restrictions &&
        (config.restrictions.users?.length > 0 ||
          config.restrictions.teams?.length > 0 ||
          config.restrictions.apps?.length > 0)
          ? {
              users: config.restrictions.users || [],
              teams: config.restrictions.teams || [],
              apps: config.restrictions.apps || [],
            }
          : null,
      required_linear_history: config.required_linear_history || false,
      allow_force_pushes: config.allow_force_pushes || false,
      allow_deletions: config.allow_deletions || false,
      required_conversation_resolution: config.required_conversation_resolution || false,
      lock_branch: config.lock_branch || false,
      allow_fork_syncing: config.allow_fork_syncing !== false,
    };

    console.log('🚀 Applying branch protection rules...\n');
    console.log('Configuration:');
    console.log(
      `  • Required approvals: ${protectionParams.required_pull_request_reviews?.required_approving_review_count || 0}`
    );
    console.log(
      `  • Dismiss stale reviews: ${protectionParams.required_pull_request_reviews?.dismiss_stale_reviews ? 'Yes' : 'No'}`
    );
    console.log(
      `  • Require status checks: ${protectionParams.required_status_checks ? 'Yes' : 'No'}`
    );
    if (protectionParams.required_status_checks) {
      console.log(`    - Contexts: ${protectionParams.required_status_checks.contexts.join(', ')}`);
      console.log(
        `    - Strict (up-to-date): ${protectionParams.required_status_checks.strict ? 'Yes' : 'No'}`
      );
    }
    console.log(`  • Enforce for admins: ${protectionParams.enforce_admins ? 'Yes' : 'No'}`);
    console.log(`  • Restrict pushes: ${protectionParams.restrictions ? 'Yes' : 'No'}`);
    console.log(`  • Linear history: ${protectionParams.required_linear_history ? 'Yes' : 'No'}`);
    console.log(`  • Force pushes: ${protectionParams.allow_force_pushes ? 'Allowed' : 'Blocked'}`);
    console.log(
      `  • Branch deletions: ${protectionParams.allow_deletions ? 'Allowed' : 'Blocked'}`
    );
    console.log(
      `  • Conversation resolution: ${protectionParams.required_conversation_resolution ? 'Required' : 'Optional'}`
    );
    console.log('');

    // Apply branch protection
    await octokit.rest.repos.updateBranchProtection(protectionParams);

    console.log('✅ SUCCESS: Branch protection rules configured!\n');
    console.log('The main branch is now protected against:');
    console.log('  ✓ Direct pushes without review');
    console.log('  ✓ Unreviewed code changes');
    console.log('  ✓ Breaking changes (CI must pass)');
    console.log('  ✓ Revenue-impacting modifications');
    console.log('  ✓ Force pushes and deletions\n');

    // Verify the configuration
    console.log('🔍 Verifying configuration...');
    const { data: protection } = await octokit.rest.repos.getBranchProtection({
      owner,
      repo,
      branch: config.branch,
    });

    const checks = {
      prRequired: protection.required_pull_request_reviews !== null,
      approvalsRequired:
        protection.required_pull_request_reviews?.required_approving_review_count >= 1,
      dismissStale: protection.required_pull_request_reviews?.dismiss_stale_reviews === true,
      statusChecksRequired: protection.required_status_checks !== null,
      upToDateRequired: protection.required_status_checks?.strict === true,
      enforceAdmins: protection.enforce_admins?.enabled === true,
    };

    console.log('\nVerification Results:');
    console.log(`  ${checks.prRequired ? '✅' : '❌'} Pull request required`);
    console.log(`  ${checks.approvalsRequired ? '✅' : '❌'} Minimum 1 approval required`);
    console.log(`  ${checks.dismissStale ? '✅' : '❌'} Dismiss stale approvals enabled`);
    console.log(`  ${checks.statusChecksRequired ? '✅' : '❌'} Status checks required`);
    console.log(`  ${checks.upToDateRequired ? '✅' : '❌'} Up-to-date branch required`);
    console.log(`  ${checks.enforceAdmins ? '✅' : '❌'} Enforce for admins enabled`);

    const allPassed = Object.values(checks).every((check) => check === true);
    if (allPassed) {
      console.log('\n🎉 All protection rules successfully verified!\n');
      process.exit(0);
    } else {
      console.log('\n⚠️  Warning: Some rules may not be fully configured\n');
      console.log('This might be expected based on your configuration.');
      console.log('Review the settings above to ensure they match your intent.\n');
      process.exit(0);
    }
  } catch (error) {
    if (error.status === 401) {
      console.error('❌ Error: Authentication failed');
      console.error('   Your GITHUB_TOKEN may be invalid or expired');
      console.error('   Generate a new token: https://github.com/settings/tokens\n');
      process.exit(1);
    } else if (error.status === 403) {
      console.error('❌ Error: Permission denied');
      console.error('   Your token does not have permission to modify branch protection');
      console.error('   Ensure your token has "repo" scope with admin access\n');
      process.exit(1);
    } else if (error.status === 404) {
      console.error('❌ Error: Branch not found');
      console.error(`   The branch "${config?.branch || 'main'}" does not exist in the repository`);
      console.error('   Create the branch first, then configure protection\n');
      process.exit(1);
    } else {
      console.error('❌ Unexpected error:', error.message);
      if (error.response?.data) {
        console.error('   Details:', JSON.stringify(error.response.data, null, 2));
      }
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

// Run configuration
configureBranchProtection().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
