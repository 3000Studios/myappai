import { VendorProduct } from '../vendors/types';

export type PricingContext = {
  minMargin?: number; // e.g., 0.15
  maxMargin?: number; // e.g., 0.6
  floorPrice?: number;
  ceilingPrice?: number;
};

export function computeDynamicPrice(product: VendorProduct, ctx: PricingContext = {}) {
  const base = product.price;
  const targetMargin = ctx.minMargin ?? 0.18;
  const ceiling = ctx.ceilingPrice ?? base * 1.8;
  const floor = ctx.floorPrice ?? base * 0.9;

  const adjusted = Math.min(Math.max(base * (1 + targetMargin), floor), ceiling);
  return Number(adjusted.toFixed(2));
}

export function rankProducts(products: VendorProduct[]) {
  return [...products].sort((a, b) => {
    const scoreA = scoreProduct(a);
    const scoreB = scoreProduct(b);
    return scoreB - scoreA;
  });
}

function scoreProduct(p: VendorProduct) {
  const marginScore = p.commissionRate ? p.commissionRate * 100 : 10;
  const priceScore = p.price > 0 ? Math.max(0, 50 - p.price) : 0;
  const categoryScore = p.category ? 5 : 0;
  return marginScore + priceScore + categoryScore;
}

export function applyCommission(price: number, commissionRate?: number) {
  const rate = commissionRate ?? 0.1;
  return Number((price * (1 + rate)).toFixed(2));
}

