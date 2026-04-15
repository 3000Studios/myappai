'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminAvatar from '@/components/AdminAvatar';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-root min-h-screen bg-black text-white">
      <header className="admin-header p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button
            aria-label="menu"
            className="hamburger p-2 lg:hidden"
            onClick={() => setOpen(!open)}
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
          className={`admin-sidebar fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex justify-between items-center mb-8 lg:hidden">
            <span className="font-bold">MENU</span>
            <button onClick={() => setOpen(false)} className="text-2xl">
              &times;
            </button>
          </div>
          <nav className="space-y-1">
            <Link
              href="/admin"
              className="block p-2 hover:bg-white/5 rounded transition-colors text-sm"
            >
              Overview
            </Link>
            <Link
              href="/admin/revenue"
              className="block p-2 hover:bg-white/5 rounded transition-colors text-sm"
            >
              Revenue
            </Link>
            <Link
              href="/admin/live"
              className="block p-2 hover:bg-white/5 rounded transition-colors text-sm"
            >
              Live Control
            </Link>
            <Link
              href="/admin/store"
              className="block p-2 hover:bg-white/5 rounded transition-colors text-sm"
            >
              Store Manager
            </Link>
            <Link
              href="/admin/content"
              className="block p-2 hover:bg-white/5 rounded transition-colors text-sm"
            >
              Content Automation
            </Link>
            <Link
              href="/admin/voice-logs"
              className="block p-2 hover:bg-white/5 rounded transition-colors text-sm"
            >
              Voice Logs
            </Link>
            <Link
              href="/admin/settings"
              className="block p-2 hover:bg-white/5 rounded transition-colors text-sm"
            >
              Settings
            </Link>
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

          <section className="admin-children">{children}</section>
        </main>
      </div>
    </div>
  );
}
