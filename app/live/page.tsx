import VideoBackground from '@/components/VideoBackground';

export default function Live() {
  return (
    <section className="relative min-h-screen p-10">
      <VideoBackground
        src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766986172/gravity_rings_qkipbj.mp4"
        opacity={0.3}
      />
      <h1 className="text-4xl font-bold text-white mb-6">LIVE STREAM</h1>
      <p className="text-gray-400 mb-6">Watch exclusive live content and broadcasts</p>

      <div className="aspect-video w-full bg-black/80 rounded-lg border border-red-500/50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 animate-pulse"></div>
        <div className="text-center z-10">
          <div className="text-6xl mb-4 text-red-500 animate-pulse">🔴</div>
          <p className="text-white text-xl font-bold tracking-widest uppercase">
            Signal Established
          </p>
          <p className="text-red-400 mt-2 font-mono text-sm">WAITING FOR BROADCAST SOURCE...</p>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
          <span className="text-red-500 font-mono text-xs">LIVE LINK ACTIVE</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-white font-bold mb-2">Upcoming Streams</h3>
          <p className="text-gray-400 text-sm">Schedule TBA</p>
        </div>
        <div className="card">
          <h3 className="text-white font-bold mb-2">Past Broadcasts</h3>
          <p className="text-gray-400 text-sm">View archive</p>
        </div>
        <div className="card">
          <h3 className="text-white font-bold mb-2">Live Chat</h3>
          <p className="text-gray-400 text-sm">Join the conversation</p>
        </div>
      </div>
    </section>
  );
}

