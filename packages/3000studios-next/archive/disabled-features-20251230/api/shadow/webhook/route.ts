/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import shadowClient from "@/lib/shadowClient";

export async function POST() {
  await shadowClient.deploy();
  return Response.json({ ok: true });
}

