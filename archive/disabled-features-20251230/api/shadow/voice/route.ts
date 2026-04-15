/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { NextResponse } from "next/server";
import { shadowEngine } from "../../../../lib/shadow-core/engine";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

export async function POST(req: Request) {
  const body = await req.json();
  const { text } = body;

  const ai = await shadowEngine.process(text);

  return NextResponse.json({
    ok: true,
    result: ai,
  });
}

