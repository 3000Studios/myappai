/**
 * Stripe Checkout Session API
 * Creates Stripe checkout sessions for product purchases
 */

import { RATE_LIMITS, withRateLimit } from '@/lib/rate-limit';
import { withSecurity } from '@/lib/security';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

function getStripe(): Stripe | null {
  const key =
    process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET || process.env.STRIPE_3000_SECRET;
  if (!key) return null;
  return new Stripe(key);
}

const postHandler = async (request: NextRequest) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured. Set STRIPE_SECRET_KEY.' },
        { status: 500 }
      );
    }

    const { items, successUrl, cancelUrl } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_SITE_URL}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/store/checkout`,
      metadata: {
        source: '3000studios',
        itemCount: items.length.toString(),
      },
      customer_email: undefined, // Can be set if user is logged in
      billing_address_collection: 'auto',
      shipping_address_collection: items.some((i: any) => i.requiresShipping)
        ? {
            allowed_countries: ['US', 'CA', 'GB', 'AU'],
          }
        : undefined,
    });

    // Stripe session created

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: unknown) {
    console.error('Checkout Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message:
          error instanceof Error
            ? error instanceof Error
              ? error instanceof Error
                ? error.message
                : 'Unknown error'
              : 'Unknown error'
            : 'Unknown error',
      },
      { status: 500 }
    );
  }
};

export const POST = withRateLimit(
  withSecurity(postHandler, { csrf: false, cors: true }),
  RATE_LIMITS.payment
);

// Verify payment status
const getHandler = async (request: NextRequest) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured. Set STRIPE_SECRET_KEY.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (error: unknown) {
    console.error('Checkout Retrieve Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
};

export const GET = withRateLimit(
  withSecurity(getHandler, { csrf: false, cors: true }),
  RATE_LIMITS.api
);

