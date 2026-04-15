import { logAIEvent } from '@/lib/ai-logger';
import { openai } from '@/lib/openai';
import { streamText } from 'ai';
import { z } from 'zod';

const InputSchema = z.object({
  prompt: z.string().min(1).max(4000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = InputSchema.parse(body);
    const model = 'gpt-5-mini';

    const start = Date.now();

    const result = streamText({
      model: openai(model),
      prompt,
      providerOptions: {
        openai: {
          store: false,
          reasoningEffort: 'low',
          textVerbosity: 'medium',
        },
      },
      onFinish({ usage }) {
        logAIEvent({
          model,
          tokens: usage.totalTokens,
          latencyMs: Date.now() - start,
        });
      },
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error('', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}



