#!/usr/bin/env node
/**
 * Revenue Lock Validation Script
 *
 * This script ensures all revenue-critical paths are intact before deployment.
 * It prevents "approval-killing" redeploys by validating:
 * 1. AdSense script is present in layout
 * 2. ads.txt exists and contains correct publisher ID
 * 3. Stripe environment variables are configured
 * 4. Affiliate system is operational
 * 5. Analytics are enabled
 *
 * Exit codes:
 * 0 = All checks passed
 * 1 = One or more checks failed
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  checks.passed++;
  log(`✅ ${message}`, colors.green);
}

function error(message) {
  checks.failed++;
  log(`❌ ${message}`, colors.red);
}

function warning(message) {
  checks.warnings++;
  log(`⚠️  ${message}`, colors.yellow);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// Check 1: AdSense Script in Layout
function checkAdSenseScript() {
  info('Checking AdSense script integration...');

  const layoutPath = join(rootDir, 'src/app/layout.tsx');
  if (!existsSync(layoutPath)) {
    error('Layout file not found: src/app/layout.tsx');
    return;
  }

  const layoutContent = readFileSync(layoutPath, 'utf-8');

  // Check for AdSense script tag
  const hasAdSenseScript = layoutContent.includes(
    'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
  );
  const hasPublisherIdRef = layoutContent.includes('NEXT_PUBLIC_ADSENSE_PUBLISHER_ID');

  if (hasAdSenseScript && hasPublisherIdRef) {
    success('AdSense script is properly integrated in layout.tsx');
  } else {
    error('AdSense script is MISSING or incorrectly configured in layout.tsx');
    info('  Required: Script tag with pagead2.googlesyndication.com');
    info('  Required: Reference to NEXT_PUBLIC_ADSENSE_PUBLISHER_ID');
  }
}

// Check 2: ads.txt file
function checkAdsTxt() {
  info('Checking ads.txt file...');

  const adsTxtPath = join(rootDir, 'public/ads.txt');
  if (!existsSync(adsTxtPath)) {
    error('ads.txt file is MISSING from public/ directory');
    info('  Required for AdSense approval');
    return;
  }

  const adsTxtContent = readFileSync(adsTxtPath, 'utf-8');

  // Check for Google AdSense entry (must start with 'google.com' to be valid)
  const hasGoogleAdsense = /^google\.com,\s*pub-\d+/.test(adsTxtContent.trim());
  const hasPublisherId = /pub-\d+/.test(adsTxtContent);

  if (hasGoogleAdsense && hasPublisherId) {
    success('ads.txt exists with valid Google AdSense publisher ID');
    const match = adsTxtContent.match(/pub-(\d+)/);
    if (match) {
      info(`  Publisher ID: pub-${match[1]}`);
    }
  } else {
    error('ads.txt exists but is INVALID or missing publisher ID');
    info('  Format: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0');
  }
}

// Check 3: Stripe Environment Variables
function checkStripeConfig() {
  info('Checking Stripe configuration...');

  // In CI, these should be available as secrets
  // In local dev, they're in .env files
  const envExamplePath = join(rootDir, '.env.example');
  if (!existsSync(envExamplePath)) {
    warning('.env.example not found');
    return;
  }

  const envExample = readFileSync(envExamplePath, 'utf-8');

  const hasStripeSecret = envExample.includes('STRIPE_SECRET_KEY');
  const hasStripeWebhook = envExample.includes('STRIPE_WEBHOOK_SECRET');

  if (hasStripeSecret && hasStripeWebhook) {
    success('Stripe environment variables are documented in .env.example');
    info('  Note: Actual values should be set in CI/CD secrets');
  } else {
    error('Stripe environment variables are MISSING from .env.example');
    info('  Required: STRIPE_SECRET_KEY');
    info('  Required: STRIPE_WEBHOOK_SECRET');
  }

  // Check if Stripe is properly initialized in code
  const stripePath = join(rootDir, 'src/lib/services/stripe.ts');
  if (existsSync(stripePath)) {
    const stripeContent = readFileSync(stripePath, 'utf-8');
    if (stripeContent.includes('STRIPE_SECRET_KEY')) {
      success('Stripe service properly references STRIPE_SECRET_KEY');
    } else {
      error('Stripe service does NOT reference STRIPE_SECRET_KEY');
    }
  } else {
    warning('Stripe service file not found at src/lib/services/stripe.ts');
  }
}

// Check 4: Affiliate System
function checkAffiliateSystem() {
  info('Checking affiliate system...');

  const affiliatesPath = join(rootDir, 'src/lib/affiliates.ts');
  if (!existsSync(affiliatesPath)) {
    error('Affiliate system file MISSING: src/lib/affiliates.ts');
    return;
  }

  const affiliatesContent = readFileSync(affiliatesPath, 'utf-8');

  // Check for key functions
  const hasAffiliateProducts = affiliatesContent.includes('affiliateProducts');
  const hasTrackingFunction = affiliatesContent.includes('trackAffiliateClick');
  const hasInjectionFunction = affiliatesContent.includes('injectAffiliateLink');

  if (hasAffiliateProducts && hasTrackingFunction && hasInjectionFunction) {
    success('Affiliate system is intact with tracking and injection');
  } else {
    error('Affiliate system is INCOMPLETE or modified');
    info('  Required: affiliateProducts array');
    info('  Required: trackAffiliateClick function');
    info('  Required: injectAffiliateLink function');
  }
}

// Check 5: Analytics System
function checkAnalytics() {
  info('Checking analytics system...');

  const analyticsPath = join(rootDir, 'src/lib/analytics.ts');
  if (!existsSync(analyticsPath)) {
    error('Analytics system file MISSING: src/lib/analytics.ts');
    return;
  }

  const analyticsContent = readFileSync(analyticsPath, 'utf-8');

  // Check for key functionality
  const hasAnalyticsService = analyticsContent.includes('AnalyticsService');
  const hasTrackMethod = analyticsContent.includes('track(');
  const hasConversionTracking = analyticsContent.includes('trackConversion');

  if (hasAnalyticsService && hasTrackMethod && hasConversionTracking) {
    success('Analytics system is intact with conversion tracking');
  } else {
    error('Analytics system is INCOMPLETE or disabled');
    info('  Required: AnalyticsService class');
    info('  Required: track method');
    info('  Required: trackConversion method');
  }

  // Check Vercel Analytics in layout
  const layoutPath = join(rootDir, 'src/app/layout.tsx');
  if (existsSync(layoutPath)) {
    const layoutContent = readFileSync(layoutPath, 'utf-8');
    if (layoutContent.includes('@vercel/analytics')) {
      success('Vercel Analytics is enabled in layout');
    } else {
      warning('Vercel Analytics not found in layout');
    }
  }
}

// Check 6: Consent Banner (for GDPR compliance with AdSense)
function checkConsentMechanism() {
  info('Checking consent/cookie banner...');

  // Look for consent-related files
  const possiblePaths = [
    'src/components/ConsentBanner.tsx',
    'src/components/CookieBanner.tsx',
    'src/app/components/ConsentBanner.tsx',
    'src/app/components/CookieBanner.tsx',
  ];

  let consentFound = false;
  for (const path of possiblePaths) {
    if (existsSync(join(rootDir, path))) {
      consentFound = true;
      success(`Consent component found: ${path}`);
      break;
    }
  }

  if (!consentFound) {
    warning('No consent banner component found');
    info('  Recommended for GDPR compliance with AdSense');
    info('  Consider adding: src/components/ConsentBanner.tsx');
  }
}

// Main execution
function main() {
  log('\n' + '='.repeat(60), colors.bold);
  log('🔒 REVENUE LOCK VALIDATION', colors.bold + colors.blue);
  log('='.repeat(60) + '\n', colors.bold);

  checkAdSenseScript();
  checkAdsTxt();
  checkStripeConfig();
  checkAffiliateSystem();
  checkAnalytics();
  checkConsentMechanism();

  // Summary
  log('\n' + '='.repeat(60), colors.bold);
  log('📊 VALIDATION SUMMARY', colors.bold + colors.blue);
  log('='.repeat(60), colors.bold);
  log(`✅ Passed: ${checks.passed}`, colors.green);
  log(`❌ Failed: ${checks.failed}`, colors.red);
  log(`⚠️  Warnings: ${checks.warnings}`, colors.yellow);
  log('='.repeat(60) + '\n', colors.bold);

  if (checks.failed > 0) {
    log('❌ REVENUE LOCK VALIDATION FAILED', colors.red + colors.bold);
    log('   Deployment BLOCKED to prevent revenue loss', colors.red);
    log('   Fix the errors above before deploying\n', colors.red);
    process.exit(1);
  } else if (checks.warnings > 0) {
    log('⚠️  VALIDATION PASSED WITH WARNINGS', colors.yellow + colors.bold);
    log('   Consider addressing warnings for optimal revenue protection\n', colors.yellow);
    process.exit(0);
  } else {
    log('✅ ALL REVENUE PATHS VALIDATED', colors.green + colors.bold);
    log('   Safe to deploy\n', colors.green);
    process.exit(0);
  }
}

main();
