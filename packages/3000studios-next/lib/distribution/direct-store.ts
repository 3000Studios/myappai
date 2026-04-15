/**
 * Direct Store Distribution Pipeline (3000 Studios)
 * Zero-fee direct sales
 */

import { stripe } from '@/lib/stripe';

export async function createDirectProduct(input: any) {
  console.log('/// DIRECT STORE PIPELINE INIT');

  // 1. Create Product in Stripe
  const product = await stripe.products.create({
    name: input.name,
    description: input.description,
    images: input.images || [],
  });

  // 2. Create Price
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: input.priceInCents,
    currency: 'usd',
  });

  // 3. Register in local DB (feature bus / config store)
  // ...

  return {
    productId: product.id,
    priceId: price.id,
    checkoutUrl: `/checkout?p=${price.id}`,
  };
}

