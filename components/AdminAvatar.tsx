import React from 'react';

export default function AdminAvatar() {
  // Minimal avatar: placeholder female avatar
  return (
    <div className="admin-avatar flex items-center gap-4 bg-zinc-900/50 p-3 rounded-2xl border border-white/5">
      <div className="avatar-figure relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
        <img
          src="/images/admin-female-placeholder.jpg"
          alt="Admin avatar"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-950"></div>
      </div>
      <div className="hidden sm:block">
        <div className="text-sm font-black uppercase tracking-tighter">Administrator</div>
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          System Level 4
        </div>
      </div>
    </div>
  );
}
