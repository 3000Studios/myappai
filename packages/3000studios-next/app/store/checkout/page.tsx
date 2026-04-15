'use client';

import { useCartStore } from '@/lib/cart-store';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutPage() {
  const _router = useRouter();
  const { items, getTotalPrice, getTotalItems } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe'>('paypal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>
        <div className="relative max-w-2xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-purple-300/80 mb-8 text-lg">Add some products to get started!</p>
            <Link
              href="/store"
              className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePayPalCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/paypal/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          items: items.map((item) => ({
            name: item.name,
            description: `Product ID: ${item.productId}`,
            quantity: item.quantity,
            price: item.price,
          })),
          amount: totalPrice.toString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create PayPal order');
      }

      // Redirect to PayPal approval
      if (data.orderID) {
        window.location.href = `https://www.paypal.com/checkoutnow?token=${data.orderID}`;
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'Checkout failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            description: `Product ID: ${item.productId}`,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/store/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/store/checkout`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Stripe session');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'Checkout failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (paymentMethod === 'paypal') {
      handlePayPalCheckout();
    } else {
      handleStripeCheckout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
          Checkout
        </h1>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-950/50 border border-red-500/30 rounded-lg flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-300">Error</h3>
              <p className="text-red-300/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-purple-500/20 bg-slate-900/50 p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-purple-300 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 border-b border-purple-500/20 pb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-purple-300/60">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-purple-500/20">
                <div className="flex items-center justify-between text-purple-300/80">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-purple-300/80">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex items-center justify-between text-purple-300/80">
                  <span>Shipping</span>
                  <span className="text-cyan-400 font-semibold">Free</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-purple-300">Total</span>
                <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <div className="rounded-xl border border-purple-500/20 bg-slate-900/50 p-8 backdrop-blur-sm sticky top-4">
              <h2 className="text-xl font-bold text-purple-300 mb-6">Payment Method</h2>

              <div className="space-y-4 mb-6">
                {/* PayPal Option */}
                <label
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                  style={{
                    borderColor:
                      paymentMethod === 'paypal' ? 'rgb(34, 197, 94)' : 'rgb(147, 51, 234, 0.3)',
                    backgroundColor:
                      paymentMethod === 'paypal' ? 'rgb(6, 78, 59, 0.3)' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                    className="w-4 h-4 cursor-pointer accent-cyan-400"
                  />
                  <span className="ml-3 font-semibold text-white">PayPal</span>
                </label>

                {/* Stripe Option */}
                <label
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                  style={{
                    borderColor:
                      paymentMethod === 'stripe' ? 'rgb(34, 197, 94)' : 'rgb(147, 51, 234, 0.3)',
                    backgroundColor:
                      paymentMethod === 'stripe' ? 'rgb(6, 78, 59, 0.3)' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                    className="w-4 h-4 cursor-pointer accent-cyan-400"
                  />
                  <span className="ml-3 font-semibold text-white">Stripe (Card)</span>
                </label>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  `Pay with ${paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'}`
                )}
              </button>

              <Link
                href="/store"
                className="w-full block text-center px-6 py-3 border-2 border-purple-500/30 text-purple-300 font-semibold rounded-lg hover:border-purple-400 hover:text-purple-200 transition-all mt-3 backdrop-blur-sm"
              >
                Continue Shopping
              </Link>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-purple-500/20 text-center text-sm text-purple-300/80">
                <p className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-cyan-400">🔒</span> Secure payment processing
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-cyan-400">✅</span> PCI DSS Compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

