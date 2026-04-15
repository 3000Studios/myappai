import { FolderGit2, Github, Key, Lock } from 'lucide-react';
import React, { useState } from 'react';
import { GitHubConfig } from '../../types/webeditor';

interface ConnectModalProps {
  onConnect: (config: GitHubConfig) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ onConnect }) => {
  const [pat, setPat] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pat && owner && repo) {
      onConnect({ pat, owner, repo });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="panel-3d w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="bg-gradient-to-b from-gray-200 to-gray-300 border-b border-gray-400 p-6 text-center">
          {/* Engraved Studio Name */}
          <h1
            className="text-2xl font-black text-gray-400/20 uppercase tracking-[0.3em] font-serif mb-4 transform scale-y-90"
            style={{
              textShadow: '1px 1px 2px rgba(255,255,255,0.5), -1px -1px 2px rgba(0,0,0,0.2)',
            }}
          >
            3000 Studios
          </h1>

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-gold shadow-lg relative z-10">
            <Github className="h-8 w-8 text-gold" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 uppercase tracking-widest">
            Authentication
          </h2>
          <p className="mt-2 text-xs text-gray-600 font-bold uppercase tracking-wide">
            Access Control System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white/40">
          {/* GitHub Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-800">
              GitHub Personal Access Token
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="password"
                required
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                placeholder="ghp_..."
                className="w-full rounded-lg border border-gray-400 bg-white/80 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-800">
                Owner
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="octocat"
                  className="w-full rounded-lg border border-gray-400 bg-white/80 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-800">
                Repository
              </label>
              <div className="relative">
                <FolderGit2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="hello-world"
                  className="w-full rounded-lg border border-gray-400 bg-white/80 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="btn-glossy w-full rounded-lg py-3 text-sm font-bold uppercase tracking-widest border border-gold"
            >
              Initialize Uplink
            </button>
            <p className="mt-3 text-center text-[10px] text-gray-500">
              Credentials encrypted locally.
            </p>
          </div>
        </form>

        <div className="bg-black py-2 text-center border-t border-gold">
          <p className="text-[9px] text-gray-400 font-mono tracking-widest uppercase">
            Property of <span className="text-gold font-bold">3000 Studios</span>
          </p>
          <p className="text-[8px] text-red-500 font-bold uppercase mt-0.5 animate-pulse">
            No Unauthorized Personnel
          </p>
        </div>
      </div>
    </div>
  );
};

