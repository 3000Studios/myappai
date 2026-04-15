/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { NextResponse } from "next/server";
import shadowDB from "@/lib/shadowDB";

export async function GET() {
  const tasks = await shadowDB.getPendingTasks();
  return NextResponse.json({ pending: tasks });
}

export async function POST(req: Request) {
  const body = await req.json();
  await shadowDB.addTask(body);
  return NextResponse.json({ status: "queued" });
}

