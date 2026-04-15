'use client';

export default function Avatar() {
  return (
    <div className="fixed bottom-20 right-6 z-50 group">
      <div className="w-32 h-32 rounded-full border-4 border-yellow-400 overflow-hidden shadow-2xl hover:scale-110 transition-transform">
        <div className="w-full h-full bg-linear-to-br from-yellow-600 via-yellow-400 to-yellow-300 flex items-center justify-center">
          <span className="text-5xl">🤖</span>
        </div>
      </div>
      <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-yellow-400 px-3 py-1 rounded text-sm font-bold">
        AI Assistant
      </div>
    </div>
  );
}

