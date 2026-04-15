'use client';

import { Activity, Database, Mic, MicOff, Save, Settings, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { generateCommitMessage, parseVoiceCommand } from '../../lib/webeditor/geminiService';
import {
  executeGitHubCommand,
  initializeAndRepairRepo,
  loadMemory,
  syncMemory,
} from '../../lib/webeditor/githubService';
import {
  checkSlangConfirmation,
  getPersonaResponse,
  speakWithAttitude,
} from '../../lib/webeditor/personaService';
import { UserProvider, useUser } from '../../providers/webeditor/UserContext';
import { CommandIntent, CommandResult, GitHubConfig, LogEntry } from '../../types/webeditor';
import { Avatar } from './Avatar';
import { CommandLog } from './CommandLog';
import { ConnectModal } from './ConnectModal';
import { FileUpload } from './FileUpload';
import { PreviewModal } from './PreviewModal';
import { RepoStatus } from './RepoStatus';

// Helper to check for Web Speech API support
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const MainApp = () => {
  const { config, setConfig, memory, setMemory, theme, toggleTheme, history, addToHistory } =
    useUser();
  const [isListening, setIsListening] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [previewIntent, setPreviewIntent] = useState<CommandIntent | null>(null);

  // Avatar Mood State
  const [avatarMood, setAvatarMood] = useState<'idle' | 'talking' | 'dancing' | 'sarcastic'>(
    'idle'
  );

  const recognitionRef = useRef<any>(null);

  // Auto-login logic
  useEffect(() => {
    speakWithAttitude(getPersonaResponse('greeting'));
    if (config) {
      addLog('system', 'Initializing system...');
      handleConnect(config);
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      // If preview is open, we are listening for confirmation slang
      if (!previewIntent) setAvatarMood('idle');
    };

    recognition.onend = () => {
      setIsListening(false);
      setAvatarMood('idle');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      setTranscript((prev) => prev + finalTranscript);

      if (finalTranscript) {
        setTranscript(finalTranscript);
        handleVoiceCommand(finalTranscript);
      }
    };

    recognitionRef.current = recognition;
  }, [config, previewIntent]); // Re-bind when preview state changes to handle conversation context

  const addLog = (type: LogEntry['type'], message: string, details?: any) => {
    const newEntry = {
      id: Date.now().toString() + Math.random().toString(),
      timestamp: new Date(),
      type,
      message,
      details,
    };

    setLogs((prev) => [...prev, newEntry]);
    if (config) {
      setMemory((prev) => ({
        ...prev,
        chat_history: [
          ...prev.chat_history,
          { role: type, content: message, timestamp: new Date().toISOString() },
        ].slice(-50),
      }));
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const handleSyncMemory = async () => {
    if (config) {
      try {
        // Note: using 'memory' state here might be slightly stale if called immediately after setMemory
        // but allows keeping the memory file updated with recent interactions.
        await syncMemory(config, memory);
      } catch (e: unknown) {
        console.error('Memory sync failed', e);
      }
    }
  };

  const handleVoiceCommand = async (text: string) => {
    setAvatarMood('talking');

    // --- CONVERSATION MODE: PREVIEW ACTIVE ---
    if (previewIntent) {
      const decision = checkSlangConfirmation(text);
      addLog('user', `(Confirmation): ${text}`);

      if (decision === 'yes') {
        await handleConfirmPreview();
      } else if (decision === 'no') {
        handleCancelPreview();
        speakWithAttitude('Alright, fuck that plan. What do you want to do instead?');
      } else if (decision === 'modify') {
        handleCancelPreview();
        speakWithAttitude('Okay, tell me exactly what to change.');
      } else {
        speakWithAttitude("I didn't catch that. Say 'Run that shit' or 'Fuck no'.");
      }
      return;
    }

    // --- STANDARD MODE ---
    if (!config) {
      addLog('error', 'Please configure your GitHub credentials first.');
      speakWithAttitude('Config missing. Fix that shit first.');
      return;
    }

    addToHistory(text);
    setHistoryIndex(-1);
    setIsProcessing(true);
    addLog('user', text);

    try {
      addLog('system', 'Analyzing intent...');
      const intent = await parseVoiceCommand(text);

      addLog('ai', `Identified Intent: ${intent.action}`, intent);
      if (intent.reasoning) speakWithAttitude(intent.reasoning);

      if (intent.action === 'unknown') {
        setAvatarMood('sarcastic');
        speakWithAttitude("I don't know what the fuck you're thinking, boss man. Try again.");
        setIsProcessing(false);
        return;
      }

      // Generate Commit Message if missing
      if (
        !intent.commit_message &&
        ['create_file', 'update_file', 'delete_file'].includes(intent.action)
      ) {
        intent.commit_message = await generateCommitMessage(text, intent.action);
      }

      // Check for destructive/write actions to show preview
      if (['create_file', 'update_file', 'delete_file'].includes(intent.action)) {
        setPreviewIntent(intent);
        speakWithAttitude(getPersonaResponse('confirm'));
        // Processing stays true until confirmed
        return;
      }

      // Read-only executes immediately
      await executeAndLogCommand(config, intent, text);
    } catch (error: any) {
      addLog('error', `System Error: ${error.message}`);
      setAvatarMood('sarcastic');
      speakWithAttitude('System fucked up. Check the logs.');
    } finally {
      if (!previewIntent) {
        setIsProcessing(false);
        setTranscript('');
      }
    }
  };

  const executeAndLogCommand = async (
    cfg: GitHubConfig,
    intent: CommandIntent,
    originalCmd: string
  ) => {
    addLog('system', `Executing: ${intent.action}...`);
    const result: CommandResult = await executeGitHubCommand(cfg, intent, originalCmd);

    if (result.success) {
      // Dance logic for big changes (create/update)
      if (intent.action.includes('file')) {
        setAvatarMood('dancing');
        setTimeout(() => setAvatarMood('idle'), 5000);
      }

      addLog('success', result.message, result.data);
      speakWithAttitude(getPersonaResponse('success'));
      await handleSyncMemory();
    } else {
      setAvatarMood('sarcastic');
      addLog('error', `GitHub Error: ${result.message}`);
      speakWithAttitude(getPersonaResponse('error', result.message));
    }
    setIsProcessing(false);
    setTranscript('');
  };

  const handleConfirmPreview = async () => {
    if (config && previewIntent) {
      await executeAndLogCommand(config, previewIntent, transcript);
      setPreviewIntent(null);
    }
  };

  const handleCancelPreview = () => {
    setPreviewIntent(null);
    setIsProcessing(false);
    setTranscript('');
    addLog('system', 'Operation cancelled by user.');
  };

  const handleConnect = async (newConfig: GitHubConfig) => {
    if (newConfig !== config) setConfig(newConfig);

    setIsProcessing(true);
    try {
      const logWrapper = (msg: string) => addLog('system', msg);
      await initializeAndRepairRepo(newConfig, logWrapper);

      const loadedMem = await loadMemory(newConfig);
      if (loadedMem) {
        setMemory(loadedMem);
        addLog('system', `Memory loaded.`);
      } else {
        addLog('system', 'Initializing new memory bank.');
      }

      speakWithAttitude(getPersonaResponse('greeting'));
    } catch (error: any) {
      addLog('error', `Initialization Error: ${error.message}`);
      speakWithAttitude('Auth failed. Do you even know your password?');
      if (error.message.includes('Authentication')) setConfig(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-full flex-col relative z-10 animate-fade-in text-gray-200 selection:bg-gold selection:text-black">
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between panel-glass m-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-dark shadow-[0_0_15px_rgba(212,175,55,0.5)] animate-pulse">
            <Database className="h-7 w-7 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-3d-animated tracking-widest uppercase">
              Editor{' '}
              <span className="text-white text-sm block font-sans tracking-normal opacity-80">
                3000
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {config ? (
            <div className="panel-glass px-4 py-2 flex items-center gap-3 border border-green-500/50">
              <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
              <span className="text-xs font-bold text-gold font-mono tracking-tight">
                {config.owner}/{config.repo}
              </span>
            </div>
          ) : (
            <div className="panel-glass px-4 py-2 flex items-center gap-2 opacity-70 border border-red-500/50">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-xs font-bold text-gray-400">OFFLINE</span>
            </div>
          )}

          <button
            onClick={() => setConfig(null)}
            className="btn-glossy p-3 rounded-full"
            title="Disconnect"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 overflow-hidden px-4 pb-4 gap-6">
        {/* Left: Command Center */}
        <div className="panel-glass flex flex-1 flex-col overflow-hidden relative">
          {/* Avatar Section */}
          <div className="h-64 flex items-center justify-center border-b border-gray-700 bg-black/40 relative overflow-hidden">
            <Avatar mood={avatarMood} />
          </div>

          <div className="flex-1 overflow-hidden bg-black/80 p-1 relative border-t border-gold/20">
            <CommandLog logs={logs} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gold bg-gradient-to-r from-gray-900 to-black p-6 shadow-[0_-5px_25px_rgba(0,0,0,0.8)]">
            <div className="relative flex items-center gap-4">
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={isListening ? "Listening for 'Run that shit'..." : 'Enter command...'}
                className={`w-full rounded-xl border-2 bg-black px-6 py-4 text-gold font-serif text-lg placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all ${isListening ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'border-gray-700'}`}
              />

              <button
                onClick={toggleListening}
                disabled={(isProcessing && !previewIntent) || !config}
                className={`btn-glossy rounded-full p-4 transition-all hover:scale-105 active:scale-95 ${
                  isListening
                    ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.6)] animate-pulse'
                    : ''
                }`}
              >
                {isListening ? (
                  <MicOff className="h-8 w-8 text-red-500" />
                ) : (
                  <Mic className="h-8 w-8 text-gold" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Dashboard */}
        <div className="hidden w-96 flex-col gap-6 lg:flex">
          <div className="panel-glass overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 border-b border-gray-600">
              <h2 className="text-sm font-bold text-gold uppercase tracking-wide flex items-center gap-2">
                <Activity className="h-4 w-4" /> System Status
              </h2>
            </div>
            <div className="bg-black/40">
              <RepoStatus lastUpdate={logs.length} />
            </div>
          </div>

          <div className="panel-glass flex-1 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 border-b border-gray-600">
              <h2 className="text-sm font-bold text-gold uppercase tracking-wide flex items-center gap-2">
                <Save className="h-4 w-4" /> Tools
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4 flex-1 bg-black/40">
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="btn-glossy w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-gold/30 hover:border-gold"
                disabled={!config}
              >
                <Upload className="h-5 w-5" /> Upload Matrix File
              </button>

              {showUpload && config && (
                <div className="p-4 border border-dashed border-cyan-500/50 rounded-xl bg-cyan-900/10 animate-fade-in">
                  <FileUpload
                    onUpload={(f) => {
                      console.log(f);
                      setShowUpload(false);
                    }}
                  />
                </div>
              )}

              <div className="mt-auto rounded-xl bg-black/50 p-6 border border-gray-700 text-xs text-gray-400 shadow-inner">
                <p className="font-serif font-bold text-center mb-3 text-gold text-lg">
                  Memory Usage
                </p>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold to-orange-500 w-3/4 shadow-[0_0_10px_#D4AF37] animate-pulse"></div>
                </div>
                <p className="mt-3 text-center tracking-widest uppercase text-[10px]">
                  Optimized for Performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {!config && <ConnectModal onConnect={handleConnect} />}

      {previewIntent && (
        <PreviewModal
          intent={previewIntent}
          onConfirm={handleConfirmPreview}
          onModify={() => {
            handleCancelPreview();
            speakWithAttitude('What should I change?');
          }}
          onCancel={() => {
            handleCancelPreview();
            speakWithAttitude('Cancelled.');
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
