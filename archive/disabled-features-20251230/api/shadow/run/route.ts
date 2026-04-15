/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { NextResponse } from "next/server";
import { shadowEngine } from "../../../../lib/shadow-core/engine";

export async function POST(req: Request) {
  try {
    const { command, payload } = await req.json();
    const result = await shadowEngine.execute(command, payload);
    return NextResponse.json(result);
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e instanceof Error ? (e instanceof Error ? e.message : "Unknown error") : "Unknown error") });
  }
}

