'use client';

const PARTNERS = [
  {
    name: 'Vercel',
    url: 'https://vercel.com',
    logo: '/images/partners/vercel.svg',
    desc: 'World-class Hosting',
  },
  {
    name: 'Stripe',
    url: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || 'https://stripe.com',
    logo: '/images/partners/stripe.svg',
    desc: 'Secure Payments',
  },
  {
    name: 'PayPal',
    url: process.env.NEXT_PUBLIC_PAYPAL_ME || 'https://paypal.com',
    logo: '/images/partners/paypal.svg',
    desc: 'Support Us',
  },
  {
    name: 'Amazon',
    url: 'https://amazon.com',
    logo: '/images/partners/amazon.svg',
    desc: 'Recommended Gear',
  },
];

export default function AffiliateLinks() {
  return (
    <div className="py-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-6">
          Trusted Partners & Tools
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2"
            >
              {/* Fallback text if logo missing */}
              <span className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors">
                {p.name}
              </span>
              <span className="text-[10px] text-gray-400 group-hover:text-gray-200 transition-colors">
                {p.desc}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

