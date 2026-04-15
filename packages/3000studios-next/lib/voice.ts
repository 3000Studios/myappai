/**
 * Voice Integration Library
 *
 * Provides Web Speech API abstraction, server-side TTS/STT fallback,
 * voice activation hooks, and transcription utilities.
 *
 * Features:
 * - Browser Web Speech API for speech recognition
 * - Server-side OpenAI Whisper fallback
 * - Text-to-speech with browser and server options
 * - Voice activation detection
 * - Real-time transcription
 * - Multi-language support
 */

import { openai } from './apiClients';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface VoiceConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: string[];
}

export interface VoiceRecognitionCallbacks {
  onResult?: (result: TranscriptionResult) => void;
  onError?: (error: Error) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface TTSOptions {
  voice?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  lang?: string;
}

// ==========================================
// TYPE DEFINITIONS FOR WEB SPEECH API
// ==========================================

// Web Speech API type definitions (since they're not in standard TypeScript DOM types)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

// ==========================================
// WEB SPEECH API (BROWSER)
// ==========================================

export class VoiceRecognition {
  private recognition: ISpeechRecognition | null = null;
  private isListening = false;
  private config: VoiceConfig;
  private callbacks: VoiceRecognitionCallbacks;

  constructor(config: Partial<VoiceConfig> = {}, callbacks: VoiceRecognitionCallbacks = {}) {
    this.config = {
      language: config.language || process.env.VOICE_LANGUAGE || 'en-US',
      continuous: config.continuous ?? process.env.VOICE_CONTINUOUS === 'true',
      interimResults: config.interimResults ?? true,
      maxAlternatives: config.maxAlternatives || 3,
    };
    this.callbacks = callbacks;

    this.initializeRecognition();
  }

  private initializeRecognition() {
    if (typeof window === 'undefined') {
      console.warn('Voice recognition is only available in browser environments');
      return;
    }

    const win = window as unknown as WindowWithSpeech;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.config.language;
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;

    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd?.();
    };

    this.recognition.onresult = (event: unknown) => {
      const result = (event as any).results[(event as any).results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;
      const isFinal = result.isFinal;

      const alternatives = Array.from(result)
        .slice(1)
        .map((alt: unknown) => (alt as any).transcript);

      this.callbacks.onResult?.({
        transcript,
        confidence,
        isFinal,
        alternatives,
      });
    };

    this.recognition.onerror = (event: unknown) => {
      this.callbacks.onError?.(new Error(`Speech recognition error: ${(event as any).error}`));
    };
  }

  start() {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }

    if (!this.isListening) {
      this.recognition.start();
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  abort() {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  isActive(): boolean {
    return this.isListening;
  }
}

// ==========================================
// TEXT-TO-SPEECH (BROWSER)
// ==========================================

export class TextToSpeech {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.loadVoices();
    }
  }

  private loadVoices() {
    if (!this.synth) return;

    this.voices = this.synth.getVoices();

    // Chrome loads voices asynchronously
    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth!.getVoices();
      };
    }
  }

  speak(text: string, options: TTSOptions = {}) {
    if (!this.synth) {
      throw new Error('Text-to-speech not available');
    }

    const utterance = new SpeechSynthesisUtterance(text);

    if (options.voice) {
      const voice = this.voices.find((v) => v.name === options.voice);
      if (voice) utterance.voice = voice;
    }

    if (options.pitch !== undefined) utterance.pitch = options.pitch;
    if (options.rate !== undefined) utterance.rate = options.rate;
    if (options.volume !== undefined) utterance.volume = options.volume;
    if (options.lang) utterance.lang = options.lang;

    this.synth.speak(utterance);

    return new Promise<void>((resolve, reject) => {
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
    });
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  isSpeaking(): boolean {
    return this.synth?.speaking ?? false;
  }
}

// ==========================================
// SERVER-SIDE TRANSCRIPTION (WHISPER API)
// ==========================================

export async function transcribeAudio(
  audioFile: File | Blob,
  options: {
    language?: string;
    prompt?: string;
    model?: 'whisper-1';
  } = {}
): Promise<{ text: string; language?: string }> {
  try {
    if (!openai.isConfigured()) {
      throw new Error('OpenAI API key not configured for server-side transcription');
    }

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', options.model || 'whisper-1');

    if (options.language) {
      formData.append('language', options.language);
    }

    if (options.prompt) {
      formData.append('prompt', options.prompt);
    }

    const client = openai.client;
    const response = await client.audio.transcriptions.create({
      file: audioFile,
      model: options.model || 'whisper-1',
      language: options.language,
      prompt: options.prompt,
    });

    return {
      text: response.text,
      language: options.language,
    };
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to transcribe audio');
  }
}

// ==========================================
// SERVER-SIDE TEXT-TO-SPEECH (OPENAI TTS)
// ==========================================

export async function generateSpeech(
  text: string,
  options: {
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
    model?: 'tts-1' | 'tts-1-hd';
    speed?: number;
  } = {}
): Promise<ArrayBuffer> {
  try {
    if (!openai.isConfigured()) {
      throw new Error('OpenAI API key not configured for server-side TTS');
    }

    const client = openai.client;
    const response = await client.audio.speech.create({
      model: options.model || 'tts-1',
      voice: options.voice || 'alloy',
      input: text,
      speed: options.speed,
    });

    return await response.arrayBuffer();
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to generate speech');
  }
}

// ==========================================
// VOICE ACTIVATION DETECTION
// ==========================================

export class VoiceActivationDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private isMonitoring = false;
  private threshold: number;
  private onActivation?: () => void;
  private onDeactivation?: () => void;

  constructor(
    threshold: number = 0.01,
    callbacks: {
      onActivation?: () => void;
      onDeactivation?: () => void;
    } = {}
  ) {
    this.threshold = threshold;
    this.onActivation = callbacks.onActivation;
    this.onDeactivation = callbacks.onDeactivation;
  }

  async start() {
    if (typeof window === 'undefined') {
      throw new Error('Voice activation detection is only available in browser');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.8;

      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);

      this.isMonitoring = true;
      this.monitor();
    } catch (error: unknown) {
      console.error("", error);
      throw error;
    }
  }

  private monitor() {
    if (!this.analyser || !this.isMonitoring) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const check = () => {
      if (!this.isMonitoring) return;

      this.analyser!.getByteFrequencyData(dataArray);

      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const normalized = average / 255;

      if (normalized > this.threshold) {
        this.onActivation?.();
      } else {
        this.onDeactivation?.();
      }

      requestAnimationFrame(check);
    };

    check();
  }

  stop() {
    this.isMonitoring = false;

    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  setThreshold(threshold: number) {
    this.threshold = threshold;
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if browser supports speech recognition
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
  );
}

/**
 * Check if browser supports speech synthesis
 */
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

/**
 * Get available speech recognition languages
 */
export function getSupportedLanguages(): string[] {
  return [
    'en-US',
    'en-GB',
    'en-AU',
    'en-CA',
    'en-IN',
    'es-ES',
    'es-MX',
    'es-US',
    'fr-FR',
    'fr-CA',
    'de-DE',
    'it-IT',
    'pt-BR',
    'pt-PT',
    'ru-RU',
    'ja-JP',
    'zh-CN',
    'zh-TW',
    'ko-KR',
    'ar-SA',
    'hi-IN',
  ];
}

/**
 * Record audio from microphone
 */
export async function recordAudio(duration: number = 5000): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('Audio recording is only available in browser');
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];

  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      stream.getTracks().forEach((track) => track.stop());
      resolve(blob);
    };

    mediaRecorder.onerror = (error) => {
      stream.getTracks().forEach((track) => track.stop());
      reject(error);
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), duration);
  });
}

// Export everything
const voiceModule = {
  VoiceRecognition,
  TextToSpeech,
  VoiceActivationDetector,
  transcribeAudio,
  generateSpeech,
  recordAudio,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  getSupportedLanguages,
};

export default voiceModule;

