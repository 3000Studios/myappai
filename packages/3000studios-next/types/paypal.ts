/**
 * PayPal Type Definitions
 * Shared types for PayPal integration across the application
 */

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  affiliateLink?: string;
  commission?: number;
}

export interface PayPalOrder {
  orderId: string;
  status: string;
  amount: number;
  items: OrderItem[];
  createdAt: Date;
  capturedAt?: Date;
}

export interface PayPalCaptureResponse {
  success: boolean;
  orderId: string;
  captureId?: string;
  status?: string;
  error?: string;
}

