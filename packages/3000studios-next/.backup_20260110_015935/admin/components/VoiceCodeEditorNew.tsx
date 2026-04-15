'use client';

import {
  resolveSpeechRecognition,
  type SpeechRecognitionErrorEventLike,
  type SpeechRecognitionEventLike,
  type SpeechRecognitionHandle,
} from '@/lib/speechRecognition';
import { AlertCircle, CheckCircle, Eye, Mic, StopCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CodePatch {
  file: string;
  description: string;
  oldCode: string;
  newCode: string;
}

interface VoiceResponse {
  success: boolean;
  intent: string;
  description: string;
  patches: CodePatch[];
  preview: string;
  timestamp: string;
}

export default function VoiceCodeEditor() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<VoiceResponse | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const recognitionRef = useRef<SpeechRecognitionHandle | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  // Browser Web Speech API for voice recognition
  const startListening = async () => {
    // Prevent double-listen: if already listening, do nothing
    if (isListening || recognitionRef.current) {
      return;
    }

    try {
      setError('');
      setStatus('🎤 Listening...');

      const SpeechRecognition = resolveSpeechRecognition();
      if (!SpeechRecognition) {
        setError('Speech Recognition not supported in your browser');
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false; // Changed to false to prevent repetition
      recognition.interimResults = false; // Only final results
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setStatus('🎤 Listening... Speak your command and it will process automatically.');
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        const transcript_part = event.results[0][0].transcript;
        if (event.results[0].isFinal) {
          setTranscript(transcript_part);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        console.error('[VOICE] Recognition error:', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
        recognitionRef.current = null;

        // Auto-disable on repeated errors (failsafe)
        if (event.error === 'no-speech' || event.error === 'aborted') {
          setStatus('⚠️ Voice disabled - click "Start Speaking" to retry');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setStatus('');
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (err: unknown) {
      setError(`Listening failed: ${err}`);
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err: unknown) {
        console.error('', err);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setStatus('');
  };

  const processCommand = async () => {
    if (!transcript.trim()) {
      setError('Please speak a command first');
      return;
    }

    setIsProcessing(true);
    setError('');
    setStatus('🤖 Processing your command...');

    try {
      const res = await fetch('/api/voice-to-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript.trim(),
          action: 'preview',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to process command');
        return;
      }

      const data = (await res.json()) as VoiceResponse;
      setResponse(data);
      setShowPreview(true);
      setStatus(`✅ Ready to preview: "${data.intent}"`);
    } catch (err: unknown) {
      setError(`Processing failed: ${err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const commitChanges = async () => {
    if (!response) return;

    setIsProcessing(true);
    setStatus('📤 Committing changes...');

    try {
      // Call API to commit the changes
      const res = await fetch('/api/voice-to-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript.trim(),
          action: 'commit',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to commit changes');
        return;
      }

      setStatus('✅ Changes committed! Ready to deploy.');
      setTimeout(() => {
        setTranscript('');
        setResponse(null);
        setShowPreview(false);
        setStatus('');
      }, 2000);
    } catch (err: unknown) {
      setError(`Commit failed: ${err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setTranscript('');
    setResponse(null);
    setShowPreview(false);
    setError('');
    setStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Voice Input Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gold">🎤 Voice Command</h3>
          {isListening && <span className="animate-pulse text-red-500">Recording...</span>}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-gray-900 border border-gold/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">Your command:</p>
            <p className="text-white text-lg">{transcript}</p>
          </div>
        )}

        {/* Mic Button */}
        <div className="flex gap-3 mb-4">
          {!isListening ? (
            <button
              onClick={startListening}
              disabled={isProcessing}
              className="flex items-center gap-2 btn-primary px-6 py-3 disabled:opacity-50"
            >
              <Mic size={20} />
              Start Speaking
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              <StopCircle size={20} />
              Stop
            </button>
          )}

          {transcript && !isListening && (
            <button
              onClick={processCommand}
              disabled={isProcessing}
              className="flex items-center gap-2 bg-sapphire hover:bg-sapphire/80 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              <Eye size={20} />
              {isProcessing ? 'Processing...' : 'Preview Changes'}
            </button>
          )}

          {(transcript || response) && (
            <button
              onClick={resetForm}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Message */}
        {status && (
          <div className="p-3 bg-sapphire/10 border border-sapphire/50 rounded-lg text-sapphire text-sm">
            {status}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
      </div>

      {/* Preview Section */}
      {showPreview && response && (
        <div className="card border-2 border-gold">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gold mb-2">{response.intent}</h3>
            <p className="text-gray-300">{response.description}</p>
          </div>

          {/* Code Diff Preview */}
          <div className="bg-black/50 border border-gold/20 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
            <div dangerouslySetInnerHTML={{ __html: response.preview }} />
          </div>

          {/* Commit/Deploy Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={commitChanges}
              disabled={isProcessing}
              className="flex items-center gap-2 btn-primary px-8 py-3 font-bold disabled:opacity-50"
            >
              <CheckCircle size={20} />
              {isProcessing ? 'Committing...' : 'Commit & Deploy'}
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


