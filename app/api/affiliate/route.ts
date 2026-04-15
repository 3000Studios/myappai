/**
 * Affiliate Tracking API Route
 *
 * Handles affiliate link tracking, click recording, and commission attribution.
 *
 * Endpoints:
 * - GET /api/affiliate?code=XXX&product=YYY - Track affiliate click and redirect
 * - POST /api/affiliate/track - Record affiliate conversion
 * - GET /api/affiliate/stats?code=XXX - Get affiliate stats (admin)
 */

import { affiliate as affiliateConfig, mongodb } from '@/lib/apiClients';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// Cookie duration in days
const COOKIE_DURATION = affiliateConfig.cookieDuration || 30;

/**
 * Track affiliate click and set tracking cookie
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const affiliateCode = searchParams.get('code');
    const productId = searchParams.get('product');
    const redirectUrl = searchParams.get('redirect') || '/store';

    if (!affiliateCode) {
      return NextResponse.json({ error: 'Affiliate code is required' }, { status: 400 });
    }

    // Validate affiliate code exists
    if (mongodb.isConfigured()) {
      try {
        const db = await mongodb.db;
        const affiliate = await db.collection('affiliates').findOne({
          code: affiliateCode,
          active: true,
        });

        if (!affiliate) {
          return NextResponse.json({ error: 'Invalid affiliate code' }, { status: 404 });
        }

        // Record the click
        await db.collection('affiliate_clicks').insertOne({
          affiliateId: affiliate._id,
          code: affiliateCode,
          productId: productId || null,
          timestamp: new Date(),
          userAgent: request.headers.get('user-agent'),
          referrer: request.headers.get('referer'),
          ip:
            request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        });

        // Update affiliate stats
        await db.collection('affiliates').updateOne(
          { _id: affiliate._id },
          {
            $inc: {
              totalClicks: 1,
              [`clicksByProduct.${productId || 'general'}`]: 1,
            },
            $set: {
              lastClickAt: new Date(),
            },
          }
        );
      } catch (dbError: unknown) {
        console.error('Database error tracking affiliate click:', dbError);
        // Continue even if DB fails - we can still set cookie
      }
    }

    // Set affiliate tracking cookie
    const cookieValue = JSON.stringify({
      code: affiliateCode,
      product: productId,
      timestamp: Date.now(),
    });

    const signature = crypto
      .createHmac('sha256', affiliateConfig.secret || 'default-secret')
      .update(cookieValue)
      .digest('hex');

    const response = NextResponse.redirect(new URL(redirectUrl, request.url));

    response.cookies.set('affiliate_tracking', cookieValue, {
      maxAge: COOKIE_DURATION * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    response.cookies.set('affiliate_sig', signature, {
      maxAge: COOKIE_DURATION * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    console.error('Affiliate Tracking Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Record affiliate conversion (sale)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, orderTotal, products } = body;

    if (!orderId || !orderTotal) {
      return NextResponse.json({ error: 'Order ID and total are required' }, { status: 400 });
    }

    // Get affiliate tracking cookie
    const trackingCookie = request.cookies.get('affiliate_tracking')?.value;
    const signatureCookie = request.cookies.get('affiliate_sig')?.value;

    if (!trackingCookie || !signatureCookie) {
      return NextResponse.json({ message: 'No affiliate tracking found' }, { status: 200 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', affiliateConfig.secret || 'default-secret')
      .update(trackingCookie)
      .digest('hex');

    if (signatureCookie !== expectedSignature) {
      console.error('Invalid affiliate tracking signature');
      return NextResponse.json({ error: 'Invalid tracking signature' }, { status: 400 });
    }

    // Parse tracking data
    const trackingData = JSON.parse(trackingCookie);
    const affiliateCode = trackingData.code;

    // Calculate commission
    const commissionRate = affiliateConfig.commissionRate / 100;
    const commission = orderTotal * commissionRate;

    if (mongodb.isConfigured()) {
      const db = await mongodb.db;

      // Find affiliate
      const affiliate = await db.collection('affiliates').findOne({
        code: affiliateCode,
        active: true,
      });

      if (!affiliate) {
        return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
      }

      // Record conversion
      await db.collection('affiliate_conversions').insertOne({
        affiliateId: affiliate._id,
        code: affiliateCode,
        orderId,
        orderTotal,
        commission,
        commissionRate: affiliateConfig.commissionRate,
        products: products || [],
        timestamp: new Date(),
        clickTimestamp: new Date(trackingData.timestamp),
        status: 'pending', // pending, approved, paid
      });

      // Update affiliate stats
      await db.collection('affiliates').updateOne(
        { _id: affiliate._id },
        {
          $inc: {
            totalConversions: 1,
            totalRevenue: orderTotal,
            totalCommission: commission,
          },
          $set: {
            lastConversionAt: new Date(),
          },
        }
      );

      return NextResponse.json({
        success: true,
        affiliate: affiliateCode,
        commission,
        commissionRate: affiliateConfig.commissionRate,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Conversion tracked (DB not configured)',
    });
  } catch (err: unknown) {
    console.error('Affiliate Conversion Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


