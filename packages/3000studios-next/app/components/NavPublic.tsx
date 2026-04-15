import Link from 'next/link';

export default function NavPublic() {
  const links = [
    ['/', 'Home'],
    ['/about', 'About'],
    ['/blog', 'Blog'],
    ['/portfolio', 'Portfolio'],
    ['/projects', 'Projects'],
    ['/apps', 'Apps'],
    ['/store', 'Store'],
    ['/live', 'Live'],
  ];

  return (
    <nav className="fixed top-0 w-full z-40 backdrop-blur bg-black/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex gap-6 p-4 text-sm items-center">
        <Link
          href="/"
          className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-yellow-600 font-bold text-lg"
        >
          3000 STUDIOS
        </Link>

        {links.map(([href, label]) => (
          <Link key={href} href={href} className="hover:text-yellow-400 transition-colors">
            {label}
          </Link>
        ))}

        <Link href="/login" className="ml-auto hover:text-yellow-400 transition-colors">
          Login
        </Link>
      </div>
    </nav>
  );
}

