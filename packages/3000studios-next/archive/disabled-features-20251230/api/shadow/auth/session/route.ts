import { validateShadowSession } from "@/lib/shadow/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("shadow-session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const email = await validateShadowSession(sessionCookie);

    if (!email) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, email });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
