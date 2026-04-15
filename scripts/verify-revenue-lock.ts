import fs from 'fs';
import path from 'path';

console.log('🔒 REVENUE LOCK: Verifying monetization integrity...');

const CHECKS = [
  {
    name: 'AdSense ads.txt',
    path: 'public/ads.txt',
    requiredContent: 'pub-5800977493749262',
    error: '❌ CRITICAL: ads.txt missing or correct Publisher ID not found!',
  },
  {
    name: 'AdSense Component',
    path: 'src/components/AdSense.tsx',
    requiredContent: 'adsbygoogle',
    error: '❌ CRITICAL: AdSense component broken or missing!',
  },
  {
    name: 'Stripe Client',
    path: 'src/lib/stripe.ts',
    requiredContent: 'stripe',
    error: '❌ CRITICAL: Stripe client configuration missing!',
  },
  {
    name: 'Affiliates Map',
    path: 'src/lib/affiliates.ts',
    requiredContent: 'AFFILIATES',
    error: '❌ CRITICAL: Affiliate link system missing!',
  },
  {
    name: 'Analytics Integration',
    path: 'src/app/layout.tsx',
    requiredContent: '@vercel/analytics',
    error: '❌ CRITICAL: Vercel Analytics not imported in root layout!',
  },
];

let failed = false;

CHECKS.forEach((check) => {
  const filePath = path.join(process.cwd(), check.path);

  if (!fs.existsSync(filePath)) {
    console.error(check.error);
    console.error(`   File not found: ${check.path}`);
    failed = true;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes(check.requiredContent)) {
    console.error(check.error);
    console.error(`   Required string "${check.requiredContent}" not found in ${check.path}`);
    failed = true;
  } else {
    console.log(`✅ Verified: ${check.name}`);
  }
});

// Check for Environment Variables (Runtime simulation)
// Note: In a real CI, secrets shouldn't be printed, just verified existence if possible.
// Here we check if the code *relies* on them, which we did via checking file content.

if (failed) {
  console.error('\n🛑 DEPLOY BLOCKED: Revenue integrity check failed.');
  process.exit(1);
} else {
  console.log('\n✨ Revenue Lock: All Systems Operational. Proceeding to Deploy.');
  process.exit(0);
}

