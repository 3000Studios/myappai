import { AlertCircle } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Order Cancelled | 3000 Studios',
  description: 'Your order has been cancelled',
};

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 text-center">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-8">
          <AlertCircle className="text-amber-500 drop-shadow-lg" size={80} />
        </div>

        {/* Message */}
        <h1 className="text-5xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent mb-4">
          Order Cancelled
        </h1>
        <p className="text-xl text-purple-300/80 mb-12">
          Your payment was not processed. Your cart items are still saved, and you can try again
          whenever you're ready.
        </p>

        {/* Info */}
        <div className="rounded-xl bg-amber-950/30 border border-amber-500/20 p-8 mb-12 backdrop-blur-sm">
          <h2 className="font-semibold text-amber-300 mb-4">What Happened?</h2>
          <ul className="text-left space-y-3 text-amber-200/80">
            <li className="flex items-center gap-3">
              <span className="text-cyan-400">✓</span> Your payment was not processed
            </li>
            <li className="flex items-center gap-3">
              <span className="text-cyan-400">✓</span> Your cart items are still saved
            </li>
            <li className="flex items-center gap-3">
              <span className="text-cyan-400">✓</span> No charges have been made to your account
            </li>
            <li className="flex items-center gap-3">
              <span className="text-cyan-400">✓</span> You can try checkout again or contact support
              for help
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/store/checkout"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            Try Again
          </Link>
          <Link
            href="/store"
            className="px-8 py-4 border-2 border-purple-500/30 text-purple-300 font-semibold rounded-lg hover:border-purple-400 hover:text-purple-200 transition-all"
          >
            Back to Store
          </Link>
        </div>

        {/* Support Info */}
        <div className="rounded-xl border border-purple-500/20 bg-slate-900/50 p-8 mb-12 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-purple-300 mb-4">Need Help?</h3>
          <p className="text-purple-300/70 mb-6">
            If you're experiencing issues with checkout, our support team is here to help.
          </p>
          <a
            href="mailto:support@3000studios.com"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 font-semibold rounded-lg border border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-300 transition-all backdrop-blur-sm"
          >
            Contact Support
          </a>
        </div>

        {/* FAQ */}
        <div className="text-left max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-purple-300 mb-6">Common Issues</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/30 border border-purple-500/20">
              <p className="font-semibold text-cyan-400 mb-2">Why was my payment declined?</p>
              <p className="text-purple-300/70 text-sm">
                Common reasons include incorrect card details, insufficient funds, or security
                restrictions. Check your card details and try again, or contact your bank.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-purple-500/20">
              <p className="font-semibold text-cyan-400 mb-2">Are my items still in my cart?</p>
              <p className="text-purple-300/70 text-sm">
                Yes! Your cart items are saved. You can proceed to checkout whenever you're ready.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-purple-500/20">
              <p className="font-semibold text-cyan-400 mb-2">
                Which payment methods do you accept?
              </p>
              <p className="text-purple-300/70 text-sm">
                We accept both PayPal and Stripe (all major credit cards). If one doesn't work, try
                the other.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

