'use client';

export default function StreamController() {
  return (
    <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">Live Stream Control</h2>

      <div className="mb-4 aspect-video bg-black/70 rounded-xl border border-cyan-500/20 flex items-center justify-center">
        <p className="text-gray-500">Stream preview (offline)</p>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 px-4 py-3 bg-green-500 text-black font-bold rounded-lg hover:brightness-110 transition">
          START STREAM
        </button>
        <button className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-lg hover:brightness-90 transition">
          STOP STREAM
        </button>
      </div>

      <div className="mt-4 p-4 bg-black/50 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-400">Status: Offline</p>
      </div>
    </div>
  );
}

