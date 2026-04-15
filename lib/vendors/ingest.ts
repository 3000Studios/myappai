import { vendorAdapters } from './adapters';
import { normalizeVendorProduct } from './normalize';
import { VENDORS } from './registry';

function isSafeFeedUrl(override?: string): boolean {
  if (!override) return false;

  let url: URL;
  try {
    url = new URL(override);
  } catch {
    return false;
  }

  const protocol = url.protocol.toLowerCase();
  if (protocol !== 'http:' && protocol !== 'https:') {
    return false;
  }

  const hostname = url.hostname.toLowerCase();

  // Disallow obvious local hosts
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return false;
  }

  // Disallow common private network ranges by IP pattern
  const privateIpPattern =
    /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})$/;
  if (privateIpPattern.test(hostname)) {
    return false;
  }

  return true;
}

function getFeedUrl(vendorId: string, override?: string) {
  const safeOverride = isSafeFeedUrl(override) ? override : undefined;
  if (safeOverride) return safeOverride;
  const vendorEntry = Object.values(VENDORS).find((v) => v.id === vendorId);
  const envKey = vendorEntry?.feedUrlEnv || 'VENDOR_FEED_URL';
  const envValue = process.env[envKey];
  if (!envValue) {
    throw new Error(`Feed URL missing for vendor ${vendorId}; set ${envKey}`);
  }
  return envValue;
}

export async function ingestVendorFeed(vendorId: string, feedUrl?: string) {
  const resolvedFeedUrl = getFeedUrl(vendorId, feedUrl);
  const adapter = vendorAdapters[vendorId];

  if (adapter) {
    return adapter.fetchProducts(resolvedFeedUrl);
  }

  // Fallback: assume generic JSON with items
  const res = await fetch(resolvedFeedUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch feed ${resolvedFeedUrl}`);
  const data = await res.json();
  const items = Array.isArray(data?.items) ? data.items : data?.products || [];
  return items.map((item: Record<string, unknown>) => normalizeVendorProduct(vendorId, item));
}

