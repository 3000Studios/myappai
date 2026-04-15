import { NextRequest, NextResponse } from "next/server";
import { validateShadowLogin, createShadowSession } from "@/lib/shadow/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const isValid = await validateShadowLogin(email, password);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const sessionId = await createShadowSession(email);

    const response = NextResponse.json({ success: true, sessionId });

    // Set secure HTTP-only cookie
    response.cookies.set("shadow-session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
