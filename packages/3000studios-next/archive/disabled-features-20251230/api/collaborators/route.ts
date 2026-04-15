// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

import { NextResponse } from "next/server";
import collaboratorDB from "@/lib/collaboratorDB";
import { CollaboratorRole } from "@/types";

export async function GET() {
  try {
    const collaborators = collaboratorDB.getAll();
    return NextResponse.json({ collaborators });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error")
            : "Failed to fetch collaborators",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, avatar } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    // Validate role
    const validRoles: CollaboratorRole[] = ["admin", "editor", "viewer"];
    const collaboratorRole: CollaboratorRole = validRoles.includes(role)
      ? role
      : "viewer";

    const newCollaborator = collaboratorDB.add({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: collaboratorRole,
      avatar: avatar || undefined,
    });

    return NextResponse.json(
      { collaborator: newCollaborator },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error") : "Failed to add collaborator",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Collaborator ID is required" },
        { status: 400 },
      );
    }

    const removed = collaboratorDB.remove(parseInt(id, 10));

    if (!removed) {
      return NextResponse.json(
        { error: "Collaborator not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error")
            : "Failed to remove collaborator",
      },
      { status: 500 },
    );
  }
}

