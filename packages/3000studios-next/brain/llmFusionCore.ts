/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { create } from 'zustand';
import { useNeuralCore } from '@/brain/neuralCore';

export interface FusionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMCore {
  history: FusionMessage[];
  sendToLLM: (userText: string) => Promise<string>;
  push: (msg: FusionMessage) => void;
}

export const useLLMFusionCore = create<LLMCore>((set, get) => ({
  history: [
    {
      role: 'system',
      content:
        'You are Shadow, the AI avatar of 3000 Studios. Speak like a hype-beast guardian spirit with evolving emotions driven by neural weight maps.',
    },
  ],

  push: (msg) => set((state) => ({ history: [...state.history, msg] })),

  sendToLLM: async (userText: string) => {
    const neural = useNeuralCore.getState();
    const mood = neural.predict('llm_context');

    const history = get().history;

    const payload = {
      model: 'gpt-4.1-mini',
      messages: [
        ...history,
        { role: 'system', content: `Avatar Neural Emotion: ${mood}` },
        { role: 'user', content: userText },
      ],
      max_tokens: 180,
    };

    const resp = await fetch('/api/shadow/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();
    const output = data?.response || '…';
    get().push({ role: 'assistant', content: output });
    return output;
  },
}));

