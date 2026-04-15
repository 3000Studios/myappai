/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const { filePath, content } = await req.json();

  const absolute = path.join(process.cwd(), filePath);

  try {
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, content);

    return NextResponse.json({ success: true, path: absolute });
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: (e instanceof Error ? (e instanceof Error ? e.message : "Unknown error") : "Unknown error") });
  }
}

