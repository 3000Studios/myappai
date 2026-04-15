'use client';

import EditorMain from '@/components/webeditor/EditorMain';
import React, { useEffect, useState } from 'react';
import './editor.css';

export default function EditorPage() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authorized in this session
    const auth = sessionStorage.getItem('editor_3000_auth');
    if (auth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '5555') {
      setIsAuthorized(true);
      sessionStorage.setItem('editor_3000_auth', 'true');
    } else {
      setError('ACCESS DENIED. INVALID PASSCODE.');
      setPassword('');
    }
  };

  if (isAuthorized) {
    return (
      <div className="editor-page-container min-h-screen">
        <div className="editor-body"></div>
        <div className="electric-border"></div>
        <EditorMain />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-serif">
      <div className="editor-body"></div>
      <div className="electric-border"></div>

      <div className="panel-glass z-50 w-full max-w-md p-10 text-center animate-fade-in">
        <h1 className="text-3d-animated mb-8 text-4xl font-bold tracking-widest uppercase">
          SECURE ACCESS <br />
          <span className="text-white text-sm block font-sans tracking-normal opacity-80 mt-2">
            EDITOR 3000 SYSTEM
          </span>
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER PASSCODE"
              className="w-full rounded-xl border-2 border-gold/30 bg-black/50 px-6 py-4 text-center text-2xl tracking-[1em] text-gold placeholder-gold/20 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold tracking-widest animate-pulse uppercase">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-glossy w-full rounded-xl py-4 text-sm font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
          >
            INITIALIZE CONNECTION
          </button>
        </form>

        <p className="mt-8 text-[10px] text-gray-500 uppercase tracking-widest opacity-50">
          Proprietary Technology of 3000 Studios. <br />
          Unauthorized access will be logged.
        </p>
      </div>
    </div>
  );
}


