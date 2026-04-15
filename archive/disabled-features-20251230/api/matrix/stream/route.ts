import { NextRequest, NextResponse } from "next/server";

const sockets: Set<any> = new Set();

export async function GET(req: NextRequest) {
  // WebSocket upgrade handling for Next.js
  // Note: This requires proper WebSocket configuration in production
  return new NextResponse(
    JSON.stringify({ status: "WebSocket endpoint - upgrade required" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function broadcast(data: any) {
  const msg = JSON.stringify(data);
  sockets.forEach((socket) => {
    try {
      if (socket.readyState === 1) {
        socket.send(msg);
      }
    } catch (error: unknown) {
      console.error("", error);
      sockets.delete(socket);
    }
  });
}

export function addSocket(socket: any) {
  sockets.add(socket);
}

export function removeSocket(socket: any) {
  sockets.delete(socket);
}

