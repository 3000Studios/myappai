import { openai } from '@/lib/openai';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt, previousResponseId } = await req.json();

  const result = await generateText({
    model: openai('gpt-5-mini'),
    prompt,
    providerOptions: {
      openai: {
        previousResponseId,
        store: false,
        reasoningEffort: 'low',
        promptCacheKey: '3000studios-core-v1',
        promptCacheRetention: 'in_memory',
      },
    },
  });

  return Response.json({
    text: result.text,
    responseId: result.providerMetadata?.openai?.responseId,
  });
}


