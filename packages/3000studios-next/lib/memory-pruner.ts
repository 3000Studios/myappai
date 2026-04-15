import { prisma } from './prisma';

/**
 * Prunes old AI memory records that haven't been accessed often.  This helper
 * calculates a threshold date (30 days ago) and removes records created
 * before that date whose `accessCount` is less than 2.  We catch errors
 * explicitly with a typed `unknown` parameter so TypeScript doesn't infer
 * `any`, and we log a useful message on failure.  Without the catch block
 * braces, the compiler would complain about a missing closing brace and
 * produce a syntax error like "Expected a semicolon".
 */
export async function pruneMemory(): Promise<void> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    const result = await prisma.aIMemory.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
        accessCount: {
          lt: 2,
        },
      },
    });
    console.log(`Pruned ${result.count} memories`);
  } catch (error: unknown) {
    console.error('Failed to prune memory:', error);
  }
}
