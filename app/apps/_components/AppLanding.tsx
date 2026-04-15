import Link from 'next/link';
import { ReactNode } from 'react';

interface AppLandingProps {
  title: string;
  subtitle: string;
  price: string;
  compareAt?: string;
  productId: string;
  bulletPoints: string[];
  highlights: string[];
  audience: string[];
  faq?: { q: string; a: string }[];
  heroBadge?: string;
  ctaLabel?: string;
  downloadNote?: string;
  children?: ReactNode;
}

export function AppLanding(props: AppLandingProps) {
  const {
    title,
    subtitle,
    price,
    compareAt,
    productId,
    bulletPoints,
    highlights,
    audience,
    faq,
    heroBadge,
    ctaLabel = 'Buy now',
    downloadNote = 'Access unlocks after purchase. No free downloads.',
    children,
  } = props;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 blur-3xl opacity-30 bg-[radial-gradient(circle_at_20%_20%,#facc15,transparent_35%),radial-gradient(circle_at_80%_30%,#f59e0b,transparent_30%),radial-gradient(circle_at_50%_70%,#9ca3af,transparent_25%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 space-y-12">
          <div className="space-y-6">
            {heroBadge && (
              <span className="inline-flex items-center px-4 py-1 rounded-full border border-amber-400/60 text-amber-200 text-sm bg-amber-400/10">
                {heroBadge}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-amber-200 drop-shadow-[0_0_18px_rgba(251,191,36,0.35)]">
              {title}
            </h1>
            <p className="text-lg text-gray-200/90 max-w-3xl">{subtitle}</p>
            <div className="flex items-end gap-3">
              <div className="text-4xl font-black text-amber-300">{price}</div>
              {compareAt && <div className="text-xl text-gray-400 line-through">{compareAt}</div>}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/store/${productId}`}
                className="px-6 py-3 rounded-lg bg-amber-400 text-black font-bold shadow-lg hover:-translate-y-0.5 transition transform"
              >
                {ctaLabel}
              </Link>
              <Link
                href={`mailto:contact@3000studios.com?subject=${encodeURIComponent(title + ' demo')}`}
                className="px-6 py-3 rounded-lg border border-amber-300/40 text-amber-100 hover:bg-amber-300/10 transition"
              >
                Request demo
              </Link>
            </div>
            <p className="text-sm text-amber-100/80">{downloadNote}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-2xl border border-amber-300/30 bg-white/5 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold text-amber-200 mb-4">What you get</h2>
              <ul className="space-y-3 text-gray-100/90">
                {bulletPoints.map((item) => (
                  <li key={item} className="flex gap-3 items-start">
                    <span className="text-amber-300">★</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl border border-amber-300/30 bg-white/5 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold text-amber-200 mb-4">Designed for</h2>
              <ul className="space-y-3 text-gray-100/90">
                {audience.map((item) => (
                  <li key={item} className="flex gap-3 items-start">
                    <span className="text-amber-300">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-amber-300/30 bg-white/5 backdrop-blur-xl shadow-2xl">
            <h2 className="text-xl font-bold text-amber-200 mb-4">Why it wins</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {highlights.map((item) => (
                <div key={item} className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
                  <p className="font-semibold text-amber-100 mb-1">{item.split(':')[0]}</p>
                  <p className="text-sm text-gray-200/80">
                    {item.includes(':') ? item.split(':').slice(1).join(':').trim() : item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {children}

          {faq && faq.length > 0 && (
            <div className="p-6 rounded-2xl border border-amber-300/30 bg-white/5 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold text-amber-200 mb-4">FAQ</h2>
              <div className="space-y-4">
                {faq.map((item) => (
                  <div key={item.q} className="border-b border-white/10 pb-4 last:border-0">
                    <p className="font-semibold text-amber-100">{item.q}</p>
                    <p className="text-sm text-gray-200/80 mt-1">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

