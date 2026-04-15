'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  Code,
  Github,
  Mic,
  MicOff,
  Rocket,
  Send,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Patch {
  file: string;
  description: string;
  oldCode: string;
  newCode: string;
  isNewFile?: boolean;
}

interface VoiceResponse {
  success: boolean;
  intent?: string;
  description?: string;
  patches?: Patch[];
  message?: string;
  error?: string;
}

export default function VoiceAIPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<VoiceResponse | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setTranscript((prev) => prev + final);
        setInterimTranscript(interim);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setInterimTranscript('');
      setResponse(null);
      recognitionRef.current?.start();
      setIsListening(true);
      addLog('Listening for natural language command...');
    }
  };

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleSubmit = async () => {
    if (!transcript && !interimTranscript) return;

    setIsProcessing(true);
    const finalInput = transcript + interimTranscript;
    addLog(`Processing: "${finalInput}"`);

    try {
      const res = await fetch('/api/voice-to-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: finalInput, action: 'preview' }),
      });
      const data = await res.json();
      setResponse(data);
      if (data.success) {
        addLog(`AI Intent Identified: ${data.intent}`);
      } else {
        addLog(`Error: ${data.error}`);
      }
    } catch (_err) {
      addLog('Failed to contact AI Engine');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeploy = async () => {
    if (!response?.patches) return;

    setIsProcessing(true);
    addLog('Initiating Git Push & Deployment...');

    try {
      const res = await fetch('/api/voice-to-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patches: response.patches,
          action: 'deploy',
        }),
      });
      const data = await res.json();
      if (data.success) {
        addLog('SUCCESS: Changes pushed to main.');
        addLog('GitHub Workflow Triggered 🚀');
        setResponse((prev) => (prev ? { ...prev, message: 'Deployed successfully!' } : null));
      } else {
        addLog(`DEPLOY ERROR: ${data.error || data.warning}`);
      }
    } catch (_err) {
      addLog('Deployment failed during network request.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans selection:bg-cyan-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12 relative z-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            VOICE COMMAND CENTER
          </h1>
          <p className="text-zinc-500 font-medium">Autonomous Development Interface v2.0</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            LIVE LINK: MAIN BRANCH
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8 shadow-2xl overflow-hidden relative group"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-50" />

            <div className="flex justify-between items-start mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Mic className="w-5 h-5 text-cyan-400" />
                Voice Capture
              </h2>
              <div
                className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold ${isListening ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-500'}`}
              >
                {isListening ? 'Recording' : 'Idle'}
              </div>
            </div>

            <div className="min-h-[160px] bg-black/40 rounded-2xl p-6 border border-zinc-800/50 text-xl leading-relaxed text-zinc-300 font-medium mb-6 relative">
              {transcript || interimTranscript ? (
                <>
                  <span>{transcript}</span>
                  <span className="text-zinc-600 italic"> {interimTranscript}</span>
                </>
              ) : (
                <span className="text-zinc-700 italic text-lg text-center block mt-8">
                  "Create a new component for user stats..."
                </span>
              )}
              {isListening && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute bottom-4 right-4 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                />
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={toggleListening}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${
                  isListening
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                    : 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isListening ? 'Stop Listening' : 'Talk to AI'}
              </button>

              <button
                onClick={handleSubmit}
                disabled={isProcessing || (!transcript && !interimTranscript)}
                className="px-6 bg-white text-black rounded-2xl font-bold disabled:opacity-30 flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Terminal / Logs */}
          <div className="bg-black border border-zinc-800 rounded-3xl p-6 font-mono text-[13px] text-zinc-400 space-y-2 h-[240px] overflow-y-auto">
            <div className="flex items-center gap-2 text-zinc-500 mb-2 border-b border-zinc-900 pb-2">
              <TerminalIcon className="w-4 h-4" />
              SYSTEM_LOGS
            </div>
            {logs.map((log, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-zinc-600">❯</span> {log}
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-2 text-cyan-500">
                <span className="animate-spin text-lg">◌</span> Thinking...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Response & Proposed Changes */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!response ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full border-2 border-dashed border-zinc-800/50 rounded-3xl flex flex-col items-center justify-center text-zinc-600 p-12 text-center"
              >
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                  <Code className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-zinc-400 mb-2">No active action items</h3>
                <p className="max-w-xs">
                  Speak a command to generate code patches and trigger autonomous deployments.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="response"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-full"
              >
                <div className="p-8 border-b border-zinc-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-cyan-500 uppercase">
                        Analysis Complete
                      </span>
                      <h2 className="text-2xl font-black">{response.intent}</h2>
                    </div>
                    <Rocket className="w-10 h-10 text-zinc-100 p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl" />
                  </div>
                  <p className="text-zinc-400 leading-relaxed">{response.description}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                    Proposed Code Patches
                  </h3>
                  {response.patches?.map((patch, i) => (
                    <div
                      key={i}
                      className="bg-black/40 border border-zinc-800/50 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <code className="text-cyan-400 text-sm font-mono">{patch.file}</code>
                        {patch.isNewFile && (
                          <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold">
                            New File
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">{patch.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono opacity-60">
                        {patch.oldCode && (
                          <div className="bg-red-500/10 p-2 rounded border border-red-500/20 line-through truncate">
                            {patch.oldCode}
                          </div>
                        )}
                        <div
                          className={`bg-green-500/10 p-2 rounded border border-green-500/20 truncate ${!patch.oldCode ? 'col-span-2' : ''}`}
                        >
                          {patch.newCode}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-zinc-900/50 border-t border-zinc-800">
                  <button
                    onClick={handleDeploy}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-white text-black font-black text-lg rounded-2xl hover:bg-zinc-200 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                  >
                    <Github className="w-6 h-6" />
                    COMMIT & DEPLOY TO PRODUCTION
                  </button>
                  {response.message && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-green-400 font-bold">
                      <CheckCircle className="w-5 h-5" />
                      {response.message}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-zinc-900 flex justify-between items-center text-zinc-600 text-[11px] font-mono">
        <div>© 3000 STUDIOS — AUTONOMOUS REVENUE ENGINE</div>
        <div className="flex gap-4">
          <span>GITHUB_WEBHOOK: ACTIVE</span>
          <span>WHISPER_TRANSCRIPTION: ENABLED</span>
        </div>
      </footer>
    </div>
  );
}

