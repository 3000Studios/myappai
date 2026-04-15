/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { model, messages, max_tokens } = await req.json();

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
      }),
    });

    const data = await resp.json();
    return NextResponse.json({
      response: data.choices?.[0]?.message?.content || "",
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: "LLM error" }, { status: 500 });
  }
}

