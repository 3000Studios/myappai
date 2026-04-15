"use client";
import dynamic from "next/dynamic";

const AvatarClient = dynamic(() => import("./AvatarClient"), { ssr: false });

export default function AvatarClientWrapper() {
  return <AvatarClient />;
}

