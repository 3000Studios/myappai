import { normalizeVendorProduct } from './normalize';
import { VendorProduct } from './types';

export type VendorAdapter = {
  id: string;
  fetchProducts: (feedUrl: string) => Promise<VendorProduct[]>;
};

async function fetchJson(feedUrl: string) {
  const res = await fetch(feedUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch feed ${feedUrl}: ${res.status}`);
  return res.json();
}

export const cjAdapter: VendorAdapter = {
  id: 'cj',
  fetchProducts: async (feedUrl: string) => {
    const data = await fetchJson(feedUrl);
    const items = Array.isArray(data?.items) ? data.items : data?.data || [];
    return items.map((item: Record<string, unknown>) =>
      normalizeVendorProduct('cj', {
        id: item.advertiserId || item.id,
        sku: item.sku,
        name: item.name || item.title,
        description: item.description,
        price: item.price,
        currency: item.currency || item.priceCurrency,
        image: item.imageUrl || item.image,
        url: item.link || item.url,
        category: item.category,
        commission: item.commission || item.commissionRate,
      })
    );
  },
};

export const shareasaleAdapter: VendorAdapter = {
  id: 'shareasale',
  fetchProducts: async (feedUrl: string) => {
    const data = await fetchJson(feedUrl);
    const items = Array.isArray(data?.products) ? data.products : data?.items || [];
    return items.map((item: Record<string, unknown>) =>
      normalizeVendorProduct('shareasale', {
        id: item.merchantId || item.id,
        sku: item.sku,
        name: item.title || item.name,
        description: item.description,
        price: item.price,
        currency: item.currency || item.currencyCode,
        image: item.image || item.imageUrl,
        url: item.trackingUrl || item.url,
        category: item.category,
        commission: item.commission,
      })
    );
  },
};

export const amazonAdapter: VendorAdapter = {
  id: 'amazon',
  fetchProducts: async (feedUrl: string) => {
    const data = await fetchJson(feedUrl);
    const items = Array.isArray(data?.products) ? data.products : data?.items || [];
    return items.map((item: Record<string, unknown>) =>
      normalizeVendorProduct('amazon', {
        id: item.asin || item.id,
        sku: item.sku,
        name: item.title || item.name,
        description: item.description,
        price: item.price,
        currency: item.currency || item.currencyCode,
        image: item.image || item.image_url,
        url: item.detailPageURL || item.url,
        category: item.category,
        commission: item.commission,
      })
    );
  },
};

export const shopifyAdapter: VendorAdapter = {
  id: 'shopify',
  fetchProducts: async (feedUrl: string) => {
    const data = await fetchJson(feedUrl);
    const items = Array.isArray(data?.products) ? data.products : [];
    return items.map((item: Record<string, unknown>) => {
      const variants = item.variants as Array<Record<string, unknown>> | undefined;
      const images = item.images as Array<Record<string, unknown>> | undefined;
      const handle = item.handle as string | undefined;

      return normalizeVendorProduct('shopify', {
        id: item.id,
        sku: handle,
        name: item.title,
        description: item.body_html,
        price: variants?.[0]?.price,
        currency: (variants?.[0]?.currency as string) || 'USD',
        image: images?.[0]?.src,
        url: handle ? `/products/${handle}` : item.onlineStoreUrl,
        category: item.product_type,
        commission: item.commission,
      });
    });
  },
};

export const vendorAdapters: Record<string, VendorAdapter> = {
  cj: cjAdapter,
  shareasale: shareasaleAdapter,
  amazon: amazonAdapter,
  shopify: shopifyAdapter,
};

