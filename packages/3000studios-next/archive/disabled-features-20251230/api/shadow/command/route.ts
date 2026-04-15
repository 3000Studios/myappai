/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { NextResponse } from "next/server";
import { executeCommand } from "@/lib/commandExecutor";
import { interpretCommand } from "@/lib/aiCommandInterpreter";

export async function POST(req: Request) {
  try {
    const { command, user, origin } = await req.json();

    if (!command) {
      return NextResponse.json({ error: "Missing command" }, { status: 400 });
    }

    const taskId = `shadow-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Use AI to interpret natural language command
    const interpreted = await interpretCommand(command);

    // Execute the interpreted action
    const result = await executeCommand(interpreted.action);

    return NextResponse.json({
      taskId,
      command,
      interpretedAction: interpreted.action,
      interpretation: interpreted.description,
      user: user || "anonymous",
      origin: origin || "manual",
      timestamp: Date.now(),
      status: result.success ? "completed" : "failed",
      result: result.output || result.error,
      action: result.action,
      message: result.success
        ? "Command executed successfully"
        : "Command failed",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: (err instanceof Error ? (err instanceof Error ? err.message : "Unknown error") : "Unknown error") },
      { status: 500 },
    );
  }
}

