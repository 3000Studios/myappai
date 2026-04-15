export function logAIEvent(event: {
  model: string;
  tokens?: number;
  latencyMs: number;
  error?: string;
}) {
  console.log('[AI EVENT]', {
    ...event,
    timestamp: new Date().toISOString(),
  });
}

