'use client';

export default function AvatarEmbed({ src }: { src: string }) {
  return (
    <iframe
      src={src}
      className="fixed bottom-6 right-6 w-64 h-64 rounded-xl border border-yellow-400 z-50"
      title="Live Avatar"
    />
  );
}

