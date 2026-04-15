import { prisma } from './prisma';

export async function logUsage(data: {
  model: string;
  tokens: number;
  latencyMs: number;
  userId?: string;
}) {
  try {
    await prisma.aIUsage.create({
      data: {
        model: data.model,
        tokens: data.tokens,
        latencyMs: data.latencyMs,
        userId: data.userId,
      },
    });
  } catch (error: unknown) {
    console.error("", error);
  }
}

