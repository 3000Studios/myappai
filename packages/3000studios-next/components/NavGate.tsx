'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Admin Navigation component for admin routes
function AdminNavigation() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-red-900/10 backdrop-blur border-b border-red-500/30 p-4">
      <div className="flex justify-between items-center text-red-500 font-mono">
        <span>ADMIN SECURE</span>
        <Link href="/" className="hover:text-red-400">
          EXIT
        </Link>
      </div>
    </nav>
  );
}

// Public Navigation component for public routes
function PublicNavigation() {
  return (
    <nav className="fixed top-0 w-full z-50 p-4">
      {/* Public Nav Content - uses main Nav from layout */}
    </nav>
  );
}

export default function NavGate() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(pathname?.startsWith('/admin') ?? false);
  }, [pathname]);

  if (isAdmin) {
    return <AdminNavigation />;
  }

  return <PublicNavigation />;
}

