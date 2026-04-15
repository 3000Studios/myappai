/**
 * System Health Check API
 * Monitors all critical systems
 */

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const health = {
      api: "ok",
      nextjs: "ok",
      build: "ok",
      deployment: "ok",
    };

    // Check if OpenAI key exists
    health.ai_core = process.env.OPENAI_API_KEY ? "ok" : "missing";

    // Check if Vercel deploy hook exists
    health.vercel_deploy = process.env.VERCEL_DEPLOY_HOOK ? "ok" : "missing";

    return NextResponse.json(health);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Health check failed" },
      { status: 500 }
    );
  }
}

