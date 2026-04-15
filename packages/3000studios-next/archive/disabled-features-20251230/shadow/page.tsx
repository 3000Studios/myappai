"use client";
// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

import { useState, useEffect } from "react";
import ShadowTerminal from "@/components/ShadowTerminal";
import ShadowFileEditor from "@/components/ShadowFileEditor";
import ShadowActions from "@/components/ShadowActions";
import CommandConsole from "@/components/CommandConsole";
import CommandHistory from "@/components/CommandHistory";
import VoiceListener from "@/components/VoiceListener";
import AIChatBox from "@/components/AIChatBox";
import ShadowAnalytics from "@/components/ShadowAnalytics";
import axios from "axios";

interface Task {
  id: string;
  command: string;
  status: "queued" | "running" | "completed" | "failed";
  result?: string;
  timestamp: number;
}

export default function ShadowPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [systemStatus, setSystemStatus] = useState("Online");

  useEffect(() => {
    if (!authenticated) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get("/api/shadow/system");
        setSystemStatus(res.data.status);
      } catch {
        setSystemStatus("Offline");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Bossman3000!!!") {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Access Denied");
      setPassword("");
    }
  };

  const executeCommand = async (
    command: string,
    origin: "voice" | "manual",
  ) => {
    try {
      const res = await axios.post("/api/shadow/command", {
        command,
        user: "MrJWSwain",
        origin,
      });

      const newTask: Task = {
        id: res.data.taskId,
        command,
        status: "queued",
        timestamp: Date.now(),
      };

      setTasks((prev) => [newTask, ...prev]);
    } catch (err: unknown) {
      console.error("Command failed:", (err instanceof Error ? (err instanceof Error ? err.message : "Unknown error") : "Unknown error"));
    }
  };

  const handleVoiceCommand = (transcript: string) => {
    executeCommand(transcript, "voice");
  };

  const handleManualCommand = (command: string) => {
    executeCommand(command, "manual");
  };

  const handleQuickAction = (action: string) => {
    executeCommand(action, "manual");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-corporate-gradient flex items-center justify-center px-4">
        <div className="bg-corporate-navy border-2 border-corporate-gold rounded-2xl p-8 md:p-12 max-w-md w-full shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-corporate-gold text-center mb-6">
            SHADOW COMMAND CENTER
          </h1>
          <p className="text-corporate-silver text-center mb-8 font-corporate">
            🔐 Authorization Required
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold font-corporate text-corporate-gold mb-2">
                ACCESS CODE
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-corporate-charcoal border border-corporate-steel rounded-lg text-white font-corporate focus:outline-none focus:border-corporate-gold transition"
                placeholder="Enter password..."
                autoFocus
              />
            </div>
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-center font-bold font-corporate">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gold-gradient rounded-lg font-bold font-corporate text-corporate-navy hover:scale-105 transition-transform shadow-lg"
            >
              AUTHENTICATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-corporate-charcoal min-h-screen text-white w-full max-w-full overflow-x-hidden pt-20 font-corporate">
      {/* Command Center Header */}
      <div className="px-4 py-8 bg-corporate-gradient border-b border-corporate-steel">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-3 text-corporate-gold">
            Shadow Command Center
          </h1>
          <p className="text-lg text-corporate-silver">
            Full Site Control • Voice Activated • AI Powered
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-corporate-navy border border-corporate-steel rounded-full">
            <div
              className={`w-3 h-3 rounded-full ${
                systemStatus === "Online"
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            <span className="text-sm font-mono text-corporate-silver">
              {systemStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Main Command Grid */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Analytics Dashboard */}
        <div className="mb-6">
          <ShadowAnalytics />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Voice Command */}
          <div className="lg:col-span-2 bg-corporate-navy border border-corporate-steel p-6 rounded-2xl">
            <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2 text-corporate-gold">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              Voice Command
            </h2>
            <VoiceListener
              isListening={isListening}
              onToggle={() => setIsListening(!isListening)}
              onCommand={handleVoiceCommand}
            />
          </div>

          {/* Task Log */}
          <div className="bg-corporate-navy border border-corporate-steel p-6 rounded-2xl">
            <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2 text-corporate-gold">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Task Log
            </h2>
            <CommandHistory tasks={tasks} />
          </div>
        </div>

        {/* Manual Command */}
        <div className="bg-corporate-navy border border-corporate-steel p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2 text-corporate-gold">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Manual Command
          </h2>
          <CommandConsole onExecute={handleManualCommand} />
        </div>

        {/* Quick Actions */}
        <div className="bg-corporate-navy border border-corporate-steel p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2 text-corporate-gold">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <button
              onClick={() => handleQuickAction("deploy site")}
              className="px-4 py-3 bg-steel-gradient rounded-lg font-bold hover:scale-105 transition-transform border border-corporate-steel"
            >
              🚀 Deploy
            </button>
            <button
              onClick={() => handleQuickAction("fix my site")}
              className="px-4 py-3 bg-steel-gradient rounded-lg font-bold hover:scale-105 transition-transform border border-corporate-steel"
            >
              🔧 Fix Site
            </button>
            <button
              onClick={() => handleQuickAction("update hero section")}
              className="px-4 py-3 bg-steel-gradient rounded-lg font-bold hover:scale-105 transition-transform border border-corporate-steel"
            >
              ✨ Update Hero
            </button>
            <button
              onClick={() => handleQuickAction("check status")}
              className="px-4 py-3 bg-steel-gradient rounded-lg font-bold hover:scale-105 transition-transform border border-corporate-steel"
            >
              📊 Status
            </button>
            <button
              onClick={() => handleQuickAction("boost SEO")}
              className="px-4 py-3 bg-steel-gradient rounded-lg font-bold hover:scale-105 transition-transform border border-corporate-steel"
            >
              📈 SEO
            </button>
            <button
              onClick={() => handleQuickAction("generate content")}
              className="px-4 py-3 bg-steel-gradient rounded-lg font-bold hover:scale-105 transition-transform border border-corporate-steel"
            >
              📝 Content
            </button>
          </div>

          {/* AI Chat Box under Quick Actions */}
          <AIChatBox />
        </div>

        {/* File Editor & Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ShadowTerminal />
          <ShadowActions />
          <div className="col-span-2">
            <ShadowFileEditor />
          </div>
        </div>
      </div>
    </div>
  );
}

