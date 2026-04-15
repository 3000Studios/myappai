#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Environment Variables Validation Script
 * Validates required environment variables for different deployment modes
 *
 * Usage:
 *   node scripts/validate-env.js [mode]
 *
 * Modes:
 *   dev        - Development mode (minimal requirements)
 *   ci         - CI/CD mode (build-only requirements)
 *   staging    - Staging environment
 *   production - Production environment (all critical variables)
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Get mode from command line or environment
const mode = process.argv[2] || process.env.VALIDATE_ENV_MODE || 'dev';

console.log(
  `${colors.cyan}${colors.bright}🔍 Validating environment variables for: ${mode}${colors.reset}\n`
);

// Load environment variables from .env.local if it exists
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log(`${colors.blue}📁 Loading environment from .env.local${colors.reset}`);
  require('dotenv').config({ path: envLocalPath });
} else if (mode === 'dev') {
  console.log(
    `${colors.yellow}⚠️  .env.local not found. Using system environment variables.${colors.reset}`
  );
}

// Define required variables by mode
const requiredVars = {
  // Always required (all modes)
  always: ['NEXT_PUBLIC_BASE_URL'],

  // Development mode
  dev: ['ADMIN_EMAIL', 'ADMIN_PASSWORD'],

  // CI/CD mode (build and test)
  ci: ['NEXT_PUBLIC_BASE_URL'],

  // Staging mode
  staging: ['ADMIN_EMAIL', 'ADMIN_PASSWORD', 'JWT_SECRET', 'MONGODB_URI', 'OPENAI_API_KEY'],

  // Production mode (all critical variables)
  production: [
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'JWT_SECRET',
    'MONGODB_URI',
    'MONGODB_DB_NAME',
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_BASE_URL',
  ],
};

// Optional but recommended variables
const recommendedVars = {
  production: [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'PAYPAL_CLIENT_ID',
    'PAYPAL_SECRET',
    'CLAUDE_API_KEY',
    'GEMINI_API_KEY',
    'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    'GITHUB_PAT',
  ],
  staging: ['STRIPE_SECRET_KEY', 'PAYPAL_CLIENT_ID'],
  dev: ['MONGODB_URI'],
  ci: [],
};

// Feature-specific variable groups
const featureVars = {
  'Payment Processing (Stripe)': [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ],
  'Payment Processing (PayPal)': ['PAYPAL_CLIENT_ID', 'PAYPAL_SECRET', 'PAYPAL_MODE'],
  'AI Services (OpenAI)': ['OPENAI_API_KEY'],
  'AI Services (Claude)': ['CLAUDE_API_KEY'],
  'AI Services (Gemini)': ['GEMINI_API_KEY'],
  'Database (MongoDB)': ['MONGODB_URI', 'MONGODB_DB_NAME'],
  'Authentication (Google)': ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  'Authentication (Apple)': ['APPLE_CLIENT_ID', 'APPLE_CLIENT_SECRET'],
  'Communication (Twilio)': ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE'],
  'Content Management (WordPress)': ['WP_URL', 'WP_USER', 'WP_PASS'],
  'Live Streaming (WebRTC)': ['WEBRTC_KEY', 'WEBRTC_TURN_URL', 'NEXT_PUBLIC_SIGNAL_SERVER'],
  'Affiliate Tracking': ['AFFILIATE_SECRET'],
  Analytics: ['NEXT_PUBLIC_GA_MEASUREMENT_ID'],
};

// Security validations
const securityChecks = [
  {
    name: 'JWT_SECRET length',
    check: () => {
      const secret = process.env.JWT_SECRET;
      return !secret || secret.length >= 32;
    },
    message: 'JWT_SECRET should be at least 32 characters long',
  },
  {
    name: 'Admin password strength',
    check: () => {
      const pass = process.env.ADMIN_PASSWORD;
      if (!pass) return true; // Will be caught by required check
      return pass.length >= 12;
    },
    message: 'ADMIN_PASSWORD should be at least 12 characters long',
  },
  {
    name: 'Production mode check',
    check: () => {
      if (mode !== 'production') return true;
      const url = process.env.NEXT_PUBLIC_BASE_URL;
      return !url || !url.includes('localhost');
    },
    message: 'NEXT_PUBLIC_BASE_URL should not contain localhost in production',
  },
  {
    name: 'Stripe mode check',
    check: () => {
      if (mode !== 'production') return true;
      const key = process.env.STRIPE_SECRET_KEY;
      return !key || key.startsWith('sk_live_');
    },
    message: 'STRIPE_SECRET_KEY should use live keys in production (sk_live_)',
  },
];

// Validation logic
let hasErrors = false;
let hasWarnings = false;

console.log(`${colors.bright}Required Variables:${colors.reset}`);

// Check always required
const allRequired = [...requiredVars.always, ...(requiredVars[mode] || [])];
const missing = [];
const present = [];

allRequired.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value === `your-${varName.toLowerCase().replace(/_/g, '-')}`) {
    missing.push(varName);
    console.log(`  ${colors.red}✗${colors.reset} ${varName} - MISSING or placeholder`);
    hasErrors = true;
  } else {
    present.push(varName);
    console.log(`  ${colors.green}✓${colors.reset} ${varName}`);
  }
});

// Check recommended variables
console.log(`\n${colors.bright}Recommended Variables:${colors.reset}`);
const recommended = recommendedVars[mode] || [];
const missingRecommended = [];

recommended.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value === `your-${varName.toLowerCase().replace(/_/g, '-')}`) {
    missingRecommended.push(varName);
    console.log(`  ${colors.yellow}⚠${colors.reset} ${varName} - Not set`);
    hasWarnings = true;
  } else {
    console.log(`  ${colors.green}✓${colors.reset} ${varName}`);
  }
});

// Feature detection
console.log(`\n${colors.bright}Feature Detection:${colors.reset}`);
Object.entries(featureVars).forEach(([feature, vars]) => {
  const available = vars.every((v) => {
    const val = process.env[v];
    return val && val !== `your-${v.toLowerCase().replace(/_/g, '-')}`;
  });

  if (available) {
    console.log(`  ${colors.green}✓${colors.reset} ${feature} - Enabled`);
  } else {
    console.log(`  ${colors.blue}○${colors.reset} ${feature} - Disabled`);
  }
});

// Security checks
console.log(`\n${colors.bright}Security Checks:${colors.reset}`);
securityChecks.forEach(({ name, check, message }) => {
  if (check()) {
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
  } else {
    console.log(`  ${colors.red}✗${colors.reset} ${name} - ${message}`);
    hasErrors = true;
  }
});

// Summary
console.log(`\n${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}Summary:${colors.reset}`);
console.log(`  Mode: ${colors.cyan}${mode}${colors.reset}`);
console.log(`  Required: ${colors.green}${present.length}${colors.reset} / ${allRequired.length}`);
if (missing.length > 0) {
  console.log(`  Missing: ${colors.red}${missing.length}${colors.reset}`);
}
if (missingRecommended.length > 0) {
  console.log(`  Recommended missing: ${colors.yellow}${missingRecommended.length}${colors.reset}`);
}

// Exit with appropriate code
if (hasErrors) {
  console.log(`\n${colors.red}${colors.bright}❌ Validation FAILED${colors.reset}`);
  console.log(
    `${colors.yellow}💡 Check ENVIRONMENT.md for detailed setup instructions${colors.reset}`
  );
  process.exit(1);
} else if (hasWarnings && mode === 'production') {
  console.log(
    `\n${colors.yellow}${colors.bright}⚠️  Validation passed with warnings${colors.reset}`
  );
  console.log(
    `${colors.yellow}💡 Consider adding recommended variables for full functionality${colors.reset}`
  );
  process.exit(0);
} else {
  console.log(`\n${colors.green}${colors.bright}✅ Validation PASSED${colors.reset}`);
  process.exit(0);
}
