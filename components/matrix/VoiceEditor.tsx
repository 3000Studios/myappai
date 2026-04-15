'use client';

import useVoiceToCommand from '@/lib/matrix/useVoiceToCommand';
import { useState } from 'react';
import LivePreview from './LivePreview';

export default function VoiceEditor() {
  const [command, setCommand] = useState('');
  const [diff, setDiff] = useState('');
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useVoiceToCommand(async (spoken) => {
    setCommand(spoken);
    setIsLoading(true);
    try {
      const result = await fetch('/api/shadow/edit/run', {
        method: 'POST',
        body: JSON.stringify({ spoken }),
      }).then((r) => r.json());

      setDiff(result.diff);
      setPreview(result.preview);
    } catch (error: unknown) {
      console.error("", error);
    } finally {
      setIsLoading(false);
    }
  });

  const apply = async () => {
    setIsApplying(true);
    try {
      await fetch('/api/shadow/edit/apply', {
        method: 'POST',
        body: JSON.stringify({ diff }),
      });

      await fetch('/api/shadow/deploy', { method: 'POST' });
    } catch (error: unknown) {
      console.error("", error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="relative bg-linear-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-[#D4AF37]/30 p-6 rounded-2xl shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-[#D4AF37] to-amber-400 bg-clip-text text-transparent">
            Voice Editor
          </h2>
          <p className="text-gray-400 text-sm mt-1">Speak to edit the UI in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${command ? 'bg-green-500' : 'bg-gray-500'} animate-pulse`}
          />
          <span className="text-xs text-gray-400">{command ? 'Active' : 'Idle'}</span>
        </div>
      </div>

      {/* Command Display */}
      <div className="mb-6">
        <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
          Detected Command
        </label>
        <div
          className={`relative p-4 rounded-xl border transition-all ${
            isLoading
              ? 'bg-blue-500/10 border-blue-500/30'
              : command
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-white/5 border-white/10'
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <p className={`text-lg font-medium ${command ? 'text-white' : 'text-gray-500'}`}>
            {command || 'Say a command…'}
          </p>
        </div>
      </div>

      {/* Preview Section */}
      <div className="mb-6">
        <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
          Live Preview
        </label>
        <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
          <LivePreview preview={preview} diff={diff} />
        </div>
      </div>

      {/* Diff Display */}
      {diff && (
        <div className="mb-6">
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
            Changes
          </label>
          <div className="p-4 rounded-xl bg-black/50 border border-cyan-500/20 font-mono text-xs text-cyan-400 max-h-32 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{diff}</pre>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={apply}
          disabled={!diff || isApplying}
          className={`flex-1 px-6 py-3 rounded-xl font-bold text-black transition-all ${
            diff && !isApplying
              ? 'bg-linear-to-r from-[#D4AF37] to-amber-500 hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-[1.02]'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isApplying ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Applying...
            </span>
          ) : (
            '✓ APPLY & DEPLOY'
          )}
        </button>

        <button
          onClick={() => {
            setCommand('');
            setDiff('');
            setPreview('');
          }}
          className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
        >
          Clear
        </button>
      </div>

      {/* Voice Hint */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">
          💡 Try: "Change the header to blue" • "Make the buttons larger" • "Add a gradient
          background"
        </p>
      </div>
    </div>
  );
}

