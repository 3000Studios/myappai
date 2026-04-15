import { pruneMemory } from '@/lib/memory-pruner';

export async function GET() {
  await pruneMemory();
  return Response.json({ status: 'memory pruned' });
}

