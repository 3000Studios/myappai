/**
 * Shadow PRIME Chat API
 * Conversational AI for visitors and admin
 */

import { pushAnalytics } from "@/lib/matrix/analytics";
import { computeAvatarState, shadowPersonality } from "@/lib/shadow/personality";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input, role = "visitor" } = await req.json();

    if (!input) {
      return NextResponse.json(
        { error: "Input required" },
        { status: 400 }
      );
    }

    // Get AI response
    const text = await shadowPersonality(input, { role });
    const avatar = computeAvatarState(text);

    pushAnalytics({
      type: "shadow-chat",
      input,
      response: text,
      role,
      emotion: avatar.emotion,
    });

    return NextResponse.json({
      ok: true,
      text,
      avatar,
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json(
      { error: (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error") || "Chat failed" },
      { status: 500 }
    );
  }
}

