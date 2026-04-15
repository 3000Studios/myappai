export default function ControlPanel() {
  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-white">System Control Panel</h1>

      <div className="grid gap-6 max-w-2xl">
        <div className="bg-black/50 p-6 rounded-lg border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Voice Control</h2>
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
            Toggle Voice System
          </button>
        </div>

        <div className="bg-black/50 p-6 rounded-lg border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Avatars</h2>
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
            Toggle AI Avatars
          </button>
        </div>

        <div className="bg-black/50 p-6 rounded-lg border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Monetization</h2>
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
            Toggle Revenue Systems
          </button>
        </div>

        <div className="bg-black/50 p-6 rounded-lg border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Live Features</h2>
          <div className="flex gap-4">
            <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
              Toggle Stream
            </button>
            <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
              Toggle Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


