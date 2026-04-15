"use client";

﻿"use client";

import { useState } from "react";
import { Navigation } from "@/components/ui/Navigation";

export default function ShadowLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: any) => {
    e.preventDefault();

    if (
      user === process.env.NEXT_PUBLIC_SHADOW_USER &&
      pass === process.env.SHADOW_PASSWORD
    ) {
      window.location.href = "/shadow";
    } else {
      setError("ACCESS DENIED");
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-void to-black z-0"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="mb-12 text-center">
          <div className="inline-block mb-4 animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          </div>
          <h1 className="font-mono text-3xl md:text-4xl text-white tracking-tighter mb-2 glitch-text">
            SHADOW PROTOCOL
          </h1>
          <p className="font-mono text-xs text-red-500/70 tracking-[0.3em]">
            RESTRICTED ACCESS
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-600 rounded-sm opacity-20 group-hover:opacity-50 transition duration-500 blur"></div>
            <input
              placeholder="IDENTITY"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="relative w-full bg-black border border-white/10 p-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-colors rounded-sm"
            />
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-600 rounded-sm opacity-20 group-hover:opacity-50 transition duration-500 blur"></div>
            <input
              placeholder="KEY"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="relative w-full bg-black border border-white/10 p-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-colors rounded-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-red-900/20 border border-red-500/30 text-red-500 font-mono text-xs tracking-[0.2em] hover:bg-red-500 hover:text-black transition-all duration-300 uppercase"
          >
            Authenticate
          </button>
        </form>

        {error && (
          <div className="mt-8 p-4 border border-red-500/20 bg-red-900/10 text-center">
            <p className="font-mono text-xs text-red-500 tracking-widest animate-pulse">
              {error}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

