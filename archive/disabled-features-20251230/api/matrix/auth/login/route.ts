import { NextResponse } from "next/server";
import { validateLogin, createSession } from "@/lib/matrix/auth";
import { pushAnalytics } from "@/lib/matrix/analytics";

export async function POST(req: Request) {
  try {
    const { email, pass } = await req.json();

    if (!email || !pass) {
      return NextResponse.json({ ok: false, error: "Missing credentials" }, { status: 400 });
    }

    const valid = await validateLogin(email, pass);

    if (!valid) {
      pushAnalytics({
        type: "login-failed",
        email,
        ip: req.headers.get("x-forwarded-for") || "unknown",
      });
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const sessionId = await createSession(email);

    pushAnalytics({
      type: "matrix-login",
      email,
      ip: req.headers.get("x-forwarded-for") || "unknown",
      ua: req.headers.get("user-agent") || "unknown",
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("matrix-session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
    });

    return res;
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

