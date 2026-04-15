/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

export async function GET() {
  return Response.json({ ok: true, time: Date.now() });
}

