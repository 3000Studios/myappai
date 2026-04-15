/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const { file, content } = await req.json();

    const target = path.join(process.cwd(), file);
    await fs.writeFile(target, content, "utf8");

    return NextResponse.json({
      ok: true,
      updated: file,
      length: content.length,
    });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e instanceof Error ? (e instanceof Error ? e.message : "Unknown error") : "Unknown error") });
  }
}

