export async function GET() {
  return Response.json({
    status: 'ANTIGRAVITY ONLINE',
    time: new Date().toISOString(),
    source: 'cloud',
  });
}

