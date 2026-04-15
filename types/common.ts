// Common API Response Types
export interface ApiResponse<T = unknown> {
  ok?: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string;
}

// Error Handler Type
export interface ErrorWithMessage {
  message: string;
  stack?: string;
}

// Generic Event Handler Types
export type EventHandler = (event: Event) => void;
export type ChangeEventHandler = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;
export type FormEventHandler = (event: React.FormEvent<HTMLFormElement>) => void;

// Media Types
export interface MediaItem {
  url: string;
  type: 'image' | 'video' | 'audio';
  alt?: string;
  title?: string;
}

// Analytics Types
export interface AnalyticsData {
  visitors?: number;
  pageViews?: number;
  revenue?: number;
  [key: string]: unknown;
}

// Stripe Types
export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
}

// PayPal Types
export interface PayPalOrder {
  id: string;
  status: string;
  amount: {
    value: string;
    currency_code: string;
  };
}

// Voice Recognition Types
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Window extension for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

