'use client';

/**
 * Voice-to-Code Editor Component
 * AI-powered voice command interface for code generation
 */

'use client';

import { useState, useRef } from 'react';
import { Mic, Code, Play, Save, Upload, Loader2 } from 'lucide-react';
import { useVoiceToCode } from '@/hooks/useAPI';

export default function VoiceCodeEditor() {
  const [isRecording, setIsRecording] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [preview, setPreview] = useState('');
  const [explanation, setExplanation] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { generateCode, transcribeAndGenerate, loading, error } = useVoiceToCode();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: unknown) {
      console.error('', err);
      alert('Please allow microphone access to use voice commands');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          try {
            const result = await transcribeAndGenerate(base64Audio, 'preview');
            setPrompt(result.transcription || '');
            setPreview(result.code || '');
            setExplanation(result.explanation || '');
          } catch (err: unknown) {
            console.error('', err);
          }
        };

        reader.readAsDataURL(audioBlob);
      };
    }
  };

  const handleTextGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      const result = await generateCode(prompt, 'preview');
      setPreview(result.code || '');
      setExplanation(result.explanation || '');
    } catch (err: unknown) {
      console.error('', err);
    }
  };

  const handleApply = async () => {
    if (!prompt.trim()) return;

    try {
      const result = await generateCode(prompt, 'apply');
      alert(`Code committed! SHA: ${result.commitSha}`);
    } catch (err: unknown) {
      console.error('', err);
    }
  };

  const handleDeploy = async () => {
    if (!prompt.trim()) return;

    if (!confirm('This will commit and deploy to production. Continue?')) {
      return;
    }

    try {
      const result = await generateCode(prompt, 'deploy');
      alert(`Deployed! URL: ${result.deploymentUrl}`);
    } catch (err: unknown) {
      console.error('', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Input Section */}
      <div className="card bg-gradient-to-r from-gold/10 to-sapphire/10 border-gold">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Mic className="text-gold" size={24} />
          Voice Command Interface
        </h3>

        <div className="flex gap-4 mb-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-gold hover:bg-platinum text-black'
            }`}
          >
            <Mic size={20} />
            {isRecording ? 'Stop Recording' : 'Start Voice Command'}
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Or type your command:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Create a new React component called UserProfile with name and email fields..."
            className="w-full h-24 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleTextGenerate}
            disabled={loading || !prompt.trim()}
            className="flex-1 py-3 bg-sapphire hover:bg-sapphire/80 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
            Preview Code
          </button>
          <button
            onClick={handleApply}
            disabled={loading || !prompt.trim()}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            Apply & Commit
          </button>
          <button
            onClick={handleDeploy}
            disabled={loading || !prompt.trim()}
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Upload size={20} />
            Deploy to Vercel
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Code Preview Section */}
      {preview && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Code className="text-gold" size={24} />
            Generated Code Preview
          </h3>

          {explanation && (
            <div className="mb-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <p className="text-sm font-semibold text-gold mb-2">AI Explanation:</p>
              <p className="text-gray-300 text-sm">{explanation}</p>
            </div>
          )}

          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700">
            <code className="text-sm text-green-400">{preview}</code>
          </pre>
        </div>
      )}
    </div>
  );
}


