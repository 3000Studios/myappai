/**
 * 3KAI END-TO-END VERIFICATION SCRIPT
 * Run this to verify your API endpoints are correctly wired before testing in ChatGPT.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const TOKEN = process.env.GPT_BRIDGE_TOKEN || '3kai_live_v2_91827364505968d7f6e5a4c3b2a1';

async function testEndpoint(name, path, method = 'GET', body = null) {
  console.log(`\n🔍 Testing ${name} [${method} ${path}]...`);
  try {
    const response = await fetch(`${SITE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`✅ ${name} Success!`);
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.error(`❌ ${name} Failed (${response.status}):`, data.error || data.message || data);
    }
  } catch (err) {
    console.error(`❌ ${name} Connection Error:`, err.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting 3KAI Operational Visibility Audit...');

  // 1. Status
  await testEndpoint('Status Check', '/api/status');

  // 2. Previews
  await testEndpoint('Preview Check', '/api/previews');

  // 3. Assets
  await testEndpoint('Asset Discovery', '/api/assets', 'POST', { query: 'intro' });

  // 4. Monetization
  await testEndpoint('Monetization Analysis', '/api/monetization', 'POST');

  // 5. GPT Bridge (Dry Run)
  await testEndpoint('GPT Bridge (Dry Run)', '/api/gpt-bridge', 'POST', {
    instruction: 'ping validation test',
  });

  console.log('\n🏁 Verification Complete. If all tests passed locally, 3KAI is ready to ship.');
}

runAllTests();
