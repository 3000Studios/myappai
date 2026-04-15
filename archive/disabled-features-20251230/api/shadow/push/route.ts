/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST(): Promise<Response> {
  const repo = process.cwd();

  const commands = [
    `cd ${repo}`,
    "git add .",
    `git commit -m \"Shadow Auto-Push $(date +%s)\"`,
    "git push origin main",
  ].join(" && ");

  return new Promise<Response>((resolve) => {
    exec(commands, (error, stdout, stderr) => {
      resolve(
        NextResponse.json({
          success: !error,
          stdout,
          stderr,
          error: error ? (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error") : null,
        }),
      );
    });
  });
}

