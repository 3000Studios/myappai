import { openai } from '@/lib/openai';
import { embed } from 'ai';

export async function createEmbedding(text: string) {
  const { embedding } = await embed({
    model: openai.textEmbedding('text-embedding-3-small'),
    value: text,
    providerOptions: {
      openai: { user: '3000studios' },
    },
  });

  return embedding;
}

