'use client';

export default function PastPostsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-8">
          Past Posts
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for posts archive */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-xl p-6 rounded-xl border-2 border-amber-400/20">
            <p className="text-slate-400">Archive coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

