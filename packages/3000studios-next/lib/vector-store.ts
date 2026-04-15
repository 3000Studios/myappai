import { prisma } from '@/lib/prisma';
import { v4 as uuid } from 'uuid';
import { createEmbedding } from './embeddings';

export async function storeMemory(userId: string, text: string) {
  try {
    const embedding = await createEmbedding(text);
    const id = uuid();

    // Use raw query for pgvector insertion to ensure correct casting if needed,
    // although Prisma might handle it, explicit casting is safer for pgvector
    await prisma.$executeRaw`
      INSERT INTO ai_memory (id, user_id, content, embedding)
      VALUES (${id}, ${userId}, ${text}, ${embedding}::vector)
    `;
  } catch (error: unknown) {
    console.error("", error);
  }
}

export async function recallMemory(userId: string, query: string): Promise<string> {
  try {
    const embedding = await createEmbedding(query);

    // Use raw query for vector similarity search
    const results = await prisma.$queryRaw<{ content: string }[]>`
      SELECT content
      FROM ai_memory
      WHERE user_id = ${userId}
      ORDER BY embedding <-> ${embedding}::vector
      LIMIT 5
    `;

    return results.map((r: { content: string }) => r.content).join('\n');
  } catch (error: unknown) {
    console.error("", error);
    return '';
  }
}

