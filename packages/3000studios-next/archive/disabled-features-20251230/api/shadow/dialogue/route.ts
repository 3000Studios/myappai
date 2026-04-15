import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      max_tokens: 60,
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: "You are the AI broadcaster for 3000Studios.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const json = await result.json();
  return NextResponse.json({ text: json.choices[0].message.content });
}

