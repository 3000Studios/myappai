import { CheckCircle } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Order Successful | 3000 Studios',
  description: 'Your order has been successfully placed',
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full animate-pulse opacity-30 w-24 h-24"></div>
            <CheckCircle className="text-green-400 relative" size={80} />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Order Successful!
        </h1>
        <p className="text-xl text-purple-300/80 mb-12">
          Thank you for your purchase. Your order has been confirmed and you will receive an email
          shortly with your digital products.
        </p>

        {/* Order Details */}
        <div className="rounded-xl border border-green-500/20 bg-slate-900/50 p-8 mb-12 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-purple-300 mb-6">What Happens Next</h2>
          <ul className="space-y-4 text-left">
            <li className="flex items-start gap-4">
              <span className="text-3xl">📧</span>
              <div>
                <p className="font-semibold text-white">Check Your Email</p>
                <p className="text-purple-300/70 text-sm">
                  You'll receive a confirmation email with your download links and access
                  instructions
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-3xl">⏱️</span>
              <div>
                <p className="font-semibold text-white">Instant Access</p>
                <p className="text-purple-300/70 text-sm">
                  Your digital products are available for download immediately
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-3xl">🔄</span>
              <div>
                <p className="font-semibold text-white">Lifetime Updates</p>
                <p className="text-purple-300/70 text-sm">
                  You have access to all future updates and improvements at no extra cost
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-3xl">💬</span>
              <div>
                <p className="font-semibold text-white">Support</p>
                <p className="text-purple-300/70 text-sm">
                  Need help? Contact our support team at support@3000studios.com
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/store"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-8 py-4 border-2 border-purple-500/30 text-purple-300 font-semibold rounded-lg hover:border-purple-400 hover:text-purple-200 transition-all"
          >
            Return Home
          </Link>
        </div>

        {/* FAQs */}
        <div className="text-left max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-purple-300 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/30 border border-purple-500/20">
              <p className="font-semibold text-cyan-400 mb-2">How do I access my products?</p>
              <p className="text-purple-300/70 text-sm">
                Check your email for download links. You can also access all your purchases in your
                account dashboard.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-purple-500/20">
              <p className="font-semibold text-cyan-400 mb-2">Can I get a refund?</p>
              <p className="text-purple-300/70 text-sm">
                Yes! We offer a 30-day money-back guarantee if you're not satisfied with your
                purchase.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-purple-500/20">
              <p className="font-semibold text-cyan-400 mb-2">Will I get updates?</p>
              <p className="text-purple-300/70 text-sm">
                Absolutely! All purchases include lifetime access to updates and improvements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

