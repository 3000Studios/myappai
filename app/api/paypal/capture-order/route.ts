/**
 * PayPal Capture Order API Route
 * Captures approved PayPal orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { captureOrder, trackAffiliateSale } from '@/lib/services/paypal';
import { getOrders } from '@/lib/services/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // Capture the PayPal order
    const captureResult = await captureOrder(orderId);

    // Get order details from database to find affiliate products
    const orders = await getOrders(1);
    const order = orders.find((o) => o.orderId === orderId);

    // Track affiliate sales if applicable
    if (order) {
      const affiliateProducts = order.items
        .filter((item: any) => item.affiliateLink)
        .map((item: any) => ({
          productId: item.productId,
          affiliateLink: item.affiliateLink,
          commission: item.commission || 0,
        }));

      if (affiliateProducts.length > 0) {
        await trackAffiliateSale(orderId, affiliateProducts);
      }
    }

    return NextResponse.json({
      success: true,
      captureId: captureResult.id,
      status: captureResult.status,
      payer: captureResult.payer,
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Failed to capture PayPal order' }, { status: 500 });
  }
}

