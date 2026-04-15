import Link from 'next/link';

export default function NavAdmin() {
  const links = [
    ['/admin', 'Dashboard'],
    ['/admin/revenue', 'Revenue'],
    ['/admin/editor', 'Editor'],
    ['/admin/builder', 'Builder'],
    ['/admin/settings', 'Settings'],
  ];

  return (
    <nav className="bg-linear-to-r from-red-900 to-red-700 p-4 flex gap-6 items-center border-b border-red-500/30">
      <Link href="/admin" className="font-bold text-lg text-yellow-400">
        ADMIN
      </Link>

      {links.map(([href, label]) => (
        <Link key={href} href={href} className="text-white hover:text-yellow-400 transition-colors">
          {label}
        </Link>
      ))}

      <Link href="/" className="ml-auto text-white/70 hover:text-white transition-colors">
        ← Back to Site
      </Link>
    </nav>
  );
}

