import { routeAgent } from '@/lib/agent-router';
import { agents } from '@/lib/agents';
import { enforceCostLimit } from '@/lib/cost-guard';
import { recallMemory, storeMemory } from '@/lib/vector-store';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt, userId } = await req.json();

  if (!userId) {
    return Response.json({ error: 'UserId is required' }, { status: 400 });
  }

  try {
    await enforceCostLimit(userId, 800);

    const memory = await recallMemory(userId, prompt);
    const intent = await routeAgent(prompt);

    const model =
      intent === 'code'
        ? agents.coder
        : intent === 'research'
          ? agents.researcher
          : intent === 'writing'
            ? agents.writer
            : agents.system;

    const result = await generateText({
      model,
      prompt: `${memory}\n\nUser:\n${prompt}`,
      providerOptions: {
        openai: {
          store: false,
          reasoningEffort: 'low',
          promptCacheKey: '3000studios-core-v2',
        },
      },
    });

    await storeMemory(userId, prompt);

    return Response.json({ text: result.text });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'AI usage limit exceeded') {
      return Response.json({ error: 'Usage limit exceeded' }, { status: 429 });
    }
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


