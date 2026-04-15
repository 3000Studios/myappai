'use client';

import Link from 'next/link';
import { useHoverSound } from './useHoverSound';

const links = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/apps', label: 'Apps' },
  { href: '/blog', label: 'Blog' },
  { href: '/live', label: 'Live' },
  { href: '/store', label: 'Store' },
];

export default function Navigation() {
  const hover = useHoverSound('/audio/hover.mp3');

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex gap-8 p-4 text-sm">
        <Link
          href="/"
          onMouseEnter={hover}
          className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-yellow-400 to-yellow-600 font-bold"
        >
          3000 STUDIOS
        </Link>

        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onMouseEnter={hover}
            className="hover:text-yellow-400 transition-all"
          >
            {l.label}
          </Link>
        ))}

        <Link href="/admin" className="ml-auto opacity-70 hover:opacity-100">
          Admin
        </Link>
      </div>
    </nav>
  );
}

