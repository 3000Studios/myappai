/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";

export async function POST(req: Request): Promise<Response> {
  const { action, target, content } = await req.json();

  try {
    // Action: Update any file in this repo
    if (action === "update_file") {
      const absolute = path.join(process.cwd(), target);

      fs.mkdirSync(path.dirname(absolute), { recursive: true });
      fs.writeFileSync(absolute, content);

      return NextResponse.json({
        success: true,
        action,
        target,
      });
    }

    // Action: Trigger Git Push
    if (action === "push") {
      const repo = process.cwd();

      return new Promise<Response>((resolve) => {
        let combinedStdout = "";
        let combinedStderr = "";

        const runGitCommand = (
          args: string[],
          onDone: (err: Error | null) => void,
        ) => {
          execFile("git", args, { cwd: repo }, (err, stdout, stderr) => {
            if (stdout) combinedStdout += stdout;
            if (stderr) combinedStderr += stderr;
            onDone(err);
          });
        };

        runGitCommand(["add", "."], (errAdd) => {
          if (errAdd) {
            resolve(
              NextResponse.json({
                success: false,
                action: "push",
                stdout: combinedStdout,
                stderr: combinedStderr,
              }),
            );
            return;
          }

          const commitMessage = `Shadow Commit ${Date.now()}`;
          runGitCommand(["commit", "-m", commitMessage], (errCommit) => {
            if (errCommit) {
              resolve(
                NextResponse.json({
                  success: false,
                  action: "push",
                  stdout: combinedStdout,
                  stderr: combinedStderr,
                }),
              );
              return;
            }

            runGitCommand(["push", "origin", "main"], (errPush) => {
              resolve(
                NextResponse.json({
                  success: !errPush,
                  action: "push",
                  stdout: combinedStdout,
                  stderr: combinedStderr,
                }),
              );
            });
          });
        });
      });
    }

    // Unknown action
    return NextResponse.json({
      success: false,
      error: "Invalid action type",
    });
  } catch (e: unknown) {
    return NextResponse.json({
      success: false,
      error: (e instanceof Error ? (e instanceof Error ? e.message : "Unknown error") : "Unknown error"),
    });
  }
}

