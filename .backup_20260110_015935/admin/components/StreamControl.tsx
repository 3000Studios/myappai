/**
 * Stream Control Component
 * WebRTC broadcast controls for THE MATRIX
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Radio, Users } from 'lucide-react';
import { useStreaming } from '@/hooks/useAPI';
import { WebRTCBroadcaster } from '@/lib/services/webrtc';

export default function StreamControl() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamTitle, setStreamTitle] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const broadcasterRef = useRef<WebRTCBroadcaster | null>(null);

  const { startStream, stopStream, getStreamStatus, loading, error } = useStreaming();

  useEffect(() => {
    // Poll for viewer count when streaming
    if (isStreaming && streamId) {
      const interval = setInterval(async () => {
        try {
          const status = await getStreamStatus(streamId);
          setViewerCount(status.viewerCount || 0);
        } catch (err: unknown) {
          console.error('', err);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isStreaming, streamId, getStreamStatus]);

  const handleStartStream = async () => {
    if (!streamTitle.trim()) {
      alert('Please enter a stream title');
      return;
    }

    try {
      // Initialize stream on server
      const streamData = await startStream(streamTitle);
      setStreamId(streamData.streamId);

      // Initialize WebRTC broadcaster
      const broadcaster = new WebRTCBroadcaster();
      broadcasterRef.current = broadcaster;

      // Start local media
      const localStream = await broadcaster.startBroadcast();

      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
      }

      // Create offer and send to signaling server
      const offer = await broadcaster.createOffer();
      console.log('WebRTC Offer created:', offer);

      // In production, send offer to signaling server
      // await fetch(streamData.signalServerUrl, { ... })

      setIsStreaming(true);
    } catch (err: unknown) {
      console.error('', err);
      alert('Failed to start stream. Please check camera/microphone permissions.');
    }
  };

  const handleStopStream = async () => {
    if (streamId) {
      try {
        await stopStream(streamId);
      } catch (err: unknown) {
        console.error('', err);
      }
    }

    if (broadcasterRef.current) {
      broadcasterRef.current.stopBroadcast();
      broadcasterRef.current = null;
    }

    setIsStreaming(false);
    setStreamId(null);
    setViewerCount(0);
  };

  return (
    <div className="card bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Video className="text-purple-400" size={24} />
        Live Stream Control
      </h3>

      {/* Stream Preview */}
      <div className="mb-4 bg-black rounded-lg overflow-hidden aspect-video relative">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />

        {isStreaming && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="px-3 py-2 bg-red-600 rounded-lg flex items-center gap-2">
              <Radio className="text-white animate-pulse" size={16} />
              <span className="text-white text-sm font-semibold">LIVE</span>
            </div>
            <div className="px-3 py-2 bg-black/70 rounded-lg flex items-center gap-2">
              <Users className="text-white" size={16} />
              <span className="text-white text-sm font-semibold">{viewerCount}</span>
            </div>
          </div>
        )}

        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <VideoOff className="text-gray-600 mx-auto mb-2" size={48} />
              <p className="text-gray-400">Stream Offline</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {!isStreaming ? (
        <div className="space-y-3">
          <input
            type="text"
            value={streamTitle}
            onChange={(e) => setStreamTitle(e.target.value)}
            placeholder="Enter stream title..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleStartStream}
            disabled={loading || !streamTitle.trim()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Video size={20} />
            Start Broadcast
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-sm font-semibold text-purple-400 mb-1">Now Streaming:</p>
            <p className="text-white">{streamTitle}</p>
            <p className="text-xs text-gray-500 mt-2">Stream ID: {streamId}</p>
          </div>
          <button
            onClick={handleStopStream}
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <VideoOff size={20} />
            Stop Broadcast
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stream Info */}
      <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <p className="text-xs text-gray-400">
          💡 Viewers can watch at: <span className="text-purple-400">/live</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">WebRTC streaming with TURN server support</p>
      </div>
    </div>
  );
}


