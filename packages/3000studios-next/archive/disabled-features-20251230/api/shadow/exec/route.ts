/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { NextResponse } from "next/server";
import shadow from "@/lib/shadowActions";

export async function POST(req: Request) {
  const { command } = await req.json();

  const gpt = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are SHADOW. Convert natural language into exact actions for the website, git, or file system. Respond ONLY in JSON.",
        },
        { role: "user", content: command },
      ],
    }),
  }).then((r) => r.json());

  const action = JSON.parse(gpt.choices[0].message.content);

  const result = await shadow.run(action);

  return NextResponse.json(result);
}

