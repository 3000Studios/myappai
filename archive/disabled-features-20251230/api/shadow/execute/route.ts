/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { NextResponse } from "next/server";
import { runShadowCommand } from "@/lib/shadow/engine";

export async function POST(req: Request) {
  try {
    const { command } = await req.json();

    if (!command) {
      return NextResponse.json({ error: "Missing command" }, { status: 400 });
    }

    const result = await runShadowCommand(command);
    return NextResponse.json({ ok: true, result });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: (err instanceof Error ? (err instanceof Error ? err.message : "Unknown error") : "Unknown error") },
      { status: 500 },
    );
  }
}

