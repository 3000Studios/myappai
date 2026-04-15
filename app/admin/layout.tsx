'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import AdminAvatar from '@/components/AdminAvatar';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const navItems = useMemo(
    () => [
      { href: '/admin', label: 'Overview' },
      { href: '/admin/revenue', label: 'Revenue' },
      { href: '/admin/live', label: 'Live Control' },
      { href: '/admin/stream', label: 'Live Setup' },
      { href: '/admin/store', label: 'Store' },
      { href: '/admin/store-manager', label: 'Store Manager' },
      { href: '/admin/content', label: 'Content Automation' },
      { href: '/admin/automation', label: 'Automation' },
      { href: '/admin/ideas', label: 'Ideas' },
      { href: '/admin/blog', label: 'Blog' },
      { href: '/admin/referrals', label: 'Referrals' },
      { href: '/admin/voice-logs', label: 'Voice Logs' },
      { href: '/admin/voice-remote', label: 'Voice Remote' },
      { href: '/admin/logs', label: 'System Logs' },
      { href: '/admin/settings', label: 'Settings' },
    ],
    []
  );

  return (
    <div className="admin-root min-h-screen bg-black text-white">
      <header className="admin-header p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button
            aria-label="menu"
            className="hamburger p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="admin-sidebar"
          >
            <span className="hamburger-line block w-6 h-[2px] bg-white"></span>
            <span className="hamburger-line block w-6 h-[2px] bg-white mt-1"></span>
            <span className="hamburger-line block w-6 h-[2px] bg-white mt-1"></span>
          </button>
          <h1 className="text-xl font-bold tracking-tighter">3000 STUDIOS ADMIN</h1>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              View Site
            </Link>
            <Link href="/admin/logs" className="hover:text-white transition-colors">
              System Logs
            </Link>
          </nav>
          <button className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">
            LOGOUT
          </button>
        </div>
      </header>

      <div className="admin-container flex">
        <aside
          id="admin-sidebar"
          className={`admin-sidebar fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex justify-between items-center mb-8 lg:hidden">
            <span className="font-bold">MENU</span>
            <button onClick={() => setOpen(false)} className="text-2xl">
              &times;
            </button>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block p-2 hover:bg-white/5 rounded transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          ></div>
        )}

        <main className="admin-main flex-1 p-6 lg:p-10">
          <div className="admin-top flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Command Center</p>
              <h2 className="text-4xl font-black italic uppercase">Dashboard</h2>
            </div>
            <div>
              <AdminAvatar />
            </div>
          </div>

          <div className="admin-subnav">
            <div className="admin-subnav-title">Admin Navigation</div>
            <div className="admin-subnav-links">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="admin-subnav-link">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <section className="admin-children">{children}</section>
        </main>
      </div>
    </div>
  );
}
