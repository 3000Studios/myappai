'use client';

import Link from 'next/link';

export default function VendorsDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Vendor Platform</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/vendors"
            className="card hover:border-[var(--electric-blue)] p-6 cursor-pointer"
          >
            <h2 className="text-xl font-bold text-[var(--electric-blue)]">Vendor Sign Up</h2>
            <p className="text-gray-400 mt-2">Submit your feed and join our platform</p>
          </Link>

          <Link
            href="/api/vendors/products?vendor=custom"
            className="card hover:border-[var(--electric-blue)] p-6 cursor-pointer"
          >
            <h2 className="text-xl font-bold text-[var(--electric-blue)]">Browse Products</h2>
            <p className="text-gray-400 mt-2">View all ingested vendor products</p>
          </Link>
        </div>

        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="space-y-3 text-gray-300">
            <li>✅ Multi-vendor product ingestion (CJ, ShareASale, Amazon, Shopify)</li>
            <li>✅ Auto-pricing with margin guardrails</li>
            <li>✅ AI product ranking and relevance scoring</li>
            <li>✅ Commission tracking and analytics</li>
            <li>
              ✅ Vendor self-signup with multiple models (affiliate, listing fee, commission
              override, dropship)
            </li>
            <li>✅ Dropship fulfillment webhooks and routing</li>
            <li>✅ AI-generated product pages with SEO schema</li>
            <li>✅ Voice-only Matrix OS mode for operations</li>
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
          <code className="block bg-gray-900 p-4 rounded text-sm space-y-2 text-green-400">
            <div>GET /api/vendors/products?vendor=cj</div>
            <div>GET /api/vendors/products?vendor=shareasale</div>
            <div>POST /api/vendors/signup</div>
            <div>POST /api/track/click (commission tracking)</div>
            <div>POST /api/fulfillment/webhook</div>
            <div>POST /api/products/generate (SEO page gen)</div>
            <div>POST /api/auth/verify</div>
          </code>
        </div>
      </div>
    </div>
  );
}

