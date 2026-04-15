#!/usr/bin/env node

/**
 * Test script for Custom GPT Bridge
 *
 * Usage:
 *   node scripts/test-gpt-bridge.js
 *
 * This script tests the GPT bridge endpoint with various commands
 */

const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const TOKEN = process.env.GPT_BRIDGE_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://3000studios.com';

if (!TOKEN) {
  console.error('❌ GPT_BRIDGE_TOKEN not found in environment variables');
  console.error('   Add it to .env.local or set it in your shell');
  process.exit(1);
}

console.log('🧪 Testing Custom GPT Bridge\n');
console.log(`📍 Endpoint: ${BASE_URL}/api/gpt-bridge`);
console.log(`🔑 Token: ${TOKEN.substring(0, 8)}...${TOKEN.substring(TOKEN.length - 8)}\n`);

// Test cases
const tests = [
  {
    name: 'Natural Language - Dark Theme',
    payload: { transcript: 'switch to dark theme' },
    expected: 'dark',
  },
  {
    name: 'Natural Language - Gold Accent',
    payload: { transcript: 'change accent to gold' },
    expected: 'gold',
  },
  {
    name: 'Structured Command - Add Media',
    payload: {
      type: 'ADD_MEDIA',
      url: 'sunset',
      mediaType: 'video',
    },
    expected: 'success',
  },
  {
    name: 'Structured Command - Update Text',
    payload: {
      type: 'UPDATE_TEXT',
      text: 'Test Headline from GPT Bridge',
    },
    expected: 'success',
  },
];

async function makeRequest(payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}/api/gpt-bridge`);
    const data = JSON.stringify(payload);

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
          });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    process.stdout.write(`Testing: ${test.name}... `);

    try {
      const result = await makeRequest(test.payload);

      if (result.status === 200) {
        console.log('✅ PASS');
        console.log(`   Response:`, JSON.stringify(result.data, null, 2));
        passed++;
      } else {
        console.log('❌ FAIL');
        console.log(`   Status: ${result.status}`);
        console.log(`   Response:`, result.data);
        failed++;
      }
    } catch (error) {
      console.log('❌ ERROR');
      console.log(`   ${error.message}`);
      failed++;
    }

    console.log('');
  }

  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total: ${tests.length}`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your Custom GPT bridge is ready to use.');
    console.log('\n📱 Next steps:');
    console.log('   1. Add GPT_BRIDGE_TOKEN to Vercel environment variables');
    console.log('   2. Create your Custom GPT in ChatGPT');
    console.log('   3. Configure Actions with the OpenAPI schema');
    console.log('   4. Start managing your site by voice!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
