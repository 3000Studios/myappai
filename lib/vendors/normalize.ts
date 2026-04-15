import { VendorProduct } from './types';

export function normalizeVendorProduct(
  vendorId: string,
  raw: Record<string, unknown>
): VendorProduct {
  return {
    vendorId,
    vendorProductId: String(raw.id || raw.sku || ''),
    name: String(raw.name || raw.title || ''),
    description: String(raw.description || ''),
    price: Number(raw.price) || 0,
    currency: String(raw.currency || 'USD'),
    image: String(raw.image || raw.image_url || ''),
    url: String(raw.url || raw.affiliate_link || ''),
    category: raw.category ? String(raw.category) : undefined,
    commissionRate: raw.commission ? Number(raw.commission) : undefined,
  };
}

