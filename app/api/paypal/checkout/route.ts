/**
 * PayPal Checkout API Route
 * Creates PayPal orders and captures payments
 */

import { RATE_LIMITS, withRateLimit } from '@/lib/rate-limit';
import { withSecurity } from '@/lib/security';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// PayPal SDK will be used server-side
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

const handler = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { action, orderID, amount, currency = 'USD', items } = body;

    if (action === 'create') {
      // Create PayPal order
      const accessToken = await getPayPalAccessToken();

      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: amount.toFixed(2),
                },
              },
            },
            items: items?.map((item: any) => ({
              name: item.name,
              quantity: item.quantity.toString(),
              unit_amount: {
                currency_code: currency,
                value: item.price.toFixed(2),
              },
            })),
          },
        ],
        application_context: {
          brand_name: '3000 Studios',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/checkout`,
        },
      };

      const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderData),
      });

      const order = await response.json();

      if (!response.ok) {
        console.error('PayPal create order error:', order);
        return NextResponse.json(
          { error: 'Failed to create PayPal order', details: order },
          { status: 400 }
        );
      }

      return NextResponse.json({ orderID: order.id });
    }

    if (action === 'capture') {
      // Capture PayPal payment
      const accessToken = await getPayPalAccessToken();

      const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const captureData = await response.json();

      if (!response.ok) {
        console.error('PayPal capture error:', captureData);
        return NextResponse.json(
          { error: 'Failed to capture payment', details: captureData },
          { status: 400 }
        );
      }

      // Log successful payment
      // Payment captured successfully

      return NextResponse.json({
        success: true,
        orderID,
        status: captureData.status,
        details: captureData,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json(
      {
        error: 'Payment processing failed',
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
  withSecurity(handler, { csrf: false, cors: true }),
  RATE_LIMITS.payment
);

