'use client';

import AdminWallpaper from '@/components/ui/AdminWallpaper';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen text-white p-8">
      <AdminWallpaper />
      <div className="relative z-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-slate-300">Site statistics and controls will appear here.</p>
      </div>
    </div>
  );
}

