'use client';

import { useEffect, useState } from 'react';

interface StreamStatus {
  isLive: boolean;
  title: string;
  description: string;
  viewers: number;
  streamUrl: string;
}

export default function LivePage() {
  const [status, setStatus] = useState<StreamStatus>({
    isLive: false,
    title: '',
    description: '',
    viewers: 0,
    streamUrl: '',
  });

  useEffect(() => {
    // Poll for stream status
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/live/status');
        const data = await response.json();
        setStatus({
          isLive: data.config?.status === 'live',
          title: data.config?.title || '3000 Studios Live',
          description: data.config?.description || '',
          viewers: data.config?.viewers || 0,
          streamUrl: data.config?.streamUrl || '',
        });
      } catch (error: unknown) {
        console.error("", error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background video */}
      <video autoPlay muted loop playsInline className="fixed inset-0 w-full h-full object-cover">
        <source
          src="https://videos.pexels.com/video-files/2369960/2369960-hd_1920_1080_30fps.mp4"
          type="video/mp4"
        />
      </video>
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />

      {/* Header */}
      <div className="relative z-10 border-b border-amber-400/20 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
            {status.title}
          </h1>
          {status.isLive && (
            <div className="mt-4 flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/50 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-bold text-sm">LIVE NOW</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-400/20 border border-amber-400/50 rounded-full">
                <span className="text-amber-300 font-semibold">
                  👥 {status.viewers} {status.viewers === 1 ? 'viewer' : 'viewers'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {status.isLive ? (
          <div className="space-y-8">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-xl border-2 border-amber-400/30 overflow-hidden shadow-2xl shadow-amber-400/20 group">
              <div className="w-full h-full flex items-center justify-center relative">
                {status.streamUrl ? (
                  <>
                    <iframe
                      src={status.streamUrl}
                      className="w-full h-full"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                    {/* Video overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none group-hover:to-black/10 transition-all duration-500" />
                  </>
                ) : (
                  <div className="text-center space-y-4 py-20">
                    <div className="w-16 h-16 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400 text-lg">Initializing stream...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stream Info Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Stream Details */}
              {status.description && (
                <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl p-8 rounded-xl border-2 border-amber-400/20 hover:border-amber-400/40 transition-colors duration-300">
                  <h2 className="text-2xl font-bold mb-4 text-amber-400">About This Stream</h2>
                  <p className="text-slate-300 leading-relaxed text-lg">{status.description}</p>
                </div>
              )}

              {/* Stream Stats */}
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl p-8 rounded-xl border-2 border-amber-400/20 hover:border-amber-400/40 transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-6 text-amber-400">Stream Stats</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Current Viewers</p>
                    <p className="text-4xl font-bold text-amber-300">
                      {status.viewers.toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm mb-2">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-lg font-semibold text-green-400">Broadcasting</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl p-8 rounded-xl border-2 border-amber-400/20">
              <h2 className="text-2xl font-bold mb-6 text-amber-400">Live Chat</h2>
              <div className="h-96 bg-gradient-to-b from-slate-950 to-black rounded-lg border border-slate-700 flex items-center justify-center relative overflow-hidden">
                {/* Chat background effect */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-10"
                >
                  <source
                    src="https://videos.pexels.com/video-files/3769556/3769556-hd_1920_1080_30fps.mp4"
                    type="video/mp4"
                  />
                </video>
                <p className="text-slate-400 text-lg relative z-10 text-center">
                  Connect to chat and interact with 3000 Studios
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🎬', title: 'Recording', desc: 'Save this stream to watch later' },
                { icon: '🔔', title: 'Notify Me', desc: 'Get alerts for upcoming streams' },
                { icon: '🎁', title: 'Join Pro', desc: 'Unlock exclusive benefits' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className="bg-gradient-to-br from-amber-400/10 to-yellow-500/10 border-2 border-amber-400/30 hover:border-amber-400/60 p-6 rounded-lg transition-all duration-300 group hover:shadow-lg hover:shadow-amber-400/20"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-32 space-y-8">
            {/* Offline state visual */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border-2 border-slate-700 group animate-pulse">
                <span className="text-5xl">🔴</span>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">Stream Offline</h2>
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                We're not currently broadcasting, but you can subscribe to be notified when we go
                live.
              </p>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button className="px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-400/50 transition-all duration-300 transform hover:scale-105">
                Subscribe for Notifications
              </button>
              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all duration-300">
                View Past Streams
              </button>
            </div>

            {/* Upcoming schedule */}
            <div className="mt-12 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl p-8 rounded-xl border-2 border-amber-400/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-amber-400">Upcoming Streams</h3>
              <div className="space-y-4">
                {['Tomorrow 8:00 PM', 'Friday 6:00 PM', 'Sunday 10:00 AM'].map((time, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-2xl">📅</span>
                    <span className="text-white font-semibold">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

