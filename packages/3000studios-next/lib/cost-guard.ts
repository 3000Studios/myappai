import { prisma } from './prisma';

export async function enforceCostLimit(userId: string, tokensRequested: number) {
  // Fail open if user ID is missing for some reason
  if (!userId) return;

  try {
    const costLimit = await prisma.aICostLimit.findUnique({
      where: { userId },
    });

    if (!costLimit) return; // No limit set

    const usage = await prisma.aIUsage.aggregate({
      where: {
        userId,
      },
      _sum: {
        tokens: true,
      },
    });

    const usedTokens = usage._sum.tokens || 0;

    if (usedTokens + tokensRequested > costLimit.monthlyTokenLimit) {
      throw new Error('AI usage limit exceeded');
    }
  } catch (error: unknown) {
    console.warn('Cost guard error, failing open:', error);
  }
}

