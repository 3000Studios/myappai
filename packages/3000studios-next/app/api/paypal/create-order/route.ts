/**
 * PayPal Create Order API Route
 * Handles PayPal payment processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { createOrder, trackAffiliateSale } from '@/lib/services/paypal';
// @ts-nocheck

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, userId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Calculate total
    const total = items.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Create PayPal order
    const paypalOrder = await createOrder({
      items: items.map((item: any) => ({
        name: item.name,
        description: item.description || item.name,
        quantity: item.quantity,
        unit_amount: {
          currency_code: 'USD',
          value: item.price.toFixed(2),
        },
        affiliate_link: item.affiliateLink,
      })),
      total: total.toFixed(2),
      currency: 'USD',
    });

    return NextResponse.json({
      success: true,
      orderId: paypalOrder.id,
      approvalUrl: paypalOrder.links.find((link: any) => link.rel === 'approve')?.href,
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
  }
}

