/**
 * PayPal Service
 * Handles payment processing and order management
 */

import axios from 'axios';

const PAYPAL_ENV = process.env.PAYPAL_ENV || process.env.NODE_ENV;

const PAYPAL_API_BASE =
  PAYPAL_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET ?? process.env.PAYPAL_CLIENT_SECRET;

interface PayPalAccessToken {
  access_token: string;
  expires_in: number;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');

    const response = await axios.post<PayPalAccessToken>(
      `${PAYPAL_API_BASE}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    cachedToken = {
      token: response.data.access_token,
      expiresAt: Date.now() + response.data.expires_in * 1000 - 60000, // 1 min buffer
    };

    return cachedToken.token;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to authenticate with PayPal');
  }
}

export interface CreateOrderParams {
  items: Array<{
    name: string;
    description: string;
    quantity: number;
    unit_amount: {
      currency_code: string;
      value: string;
    };
    affiliate_link?: string;
  }>;
  total: string;
  currency?: string;
}

export async function createOrder(params: CreateOrderParams) {
  try {
    const token = await getAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: params.currency || 'USD',
            value: params.total,
            breakdown: {
              item_total: {
                currency_code: params.currency || 'USD',
                value: params.total,
              },
            },
          },
          items: params.items.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity.toString(),
            unit_amount: item.unit_amount,
          })),
        },
      ],
      application_context: {
        brand_name: '3000 Studios',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/store/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/store/cancel`,
      },
    };

    const response = await axios.post(`${PAYPAL_API_BASE}/v2/checkout/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to create PayPal order');
  }
}

export async function captureOrder(orderId: string) {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to capture PayPal order');
  }
}

export async function getOrderDetails(orderId: string) {
  try {
    const token = await getAccessToken();

    const response = await axios.get(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to get PayPal order details');
  }
}

export interface AffiliateProduct {
  productId: string;
  affiliateLink: string;
  commission: number;
}

export async function trackAffiliateSale(orderId: string, affiliateProducts: AffiliateProduct[]) {
  try {
    // Store affiliate tracking data
    // This would typically go to a database
    console.log('Tracking affiliate sale:', {
      orderId,
      affiliateProducts,
      timestamp: new Date().toISOString(),
    });

    // You can implement webhook calls to affiliate networks here
    // For example: ShareASale, CJ Affiliate, Impact, etc.

    return {
      success: true,
      trackedProducts: affiliateProducts.length,
    };
  } catch (error: unknown) {
    console.error("", error);
    return {
      success: false,
      error: 'Failed to track affiliate sale',
    };
  }
}

