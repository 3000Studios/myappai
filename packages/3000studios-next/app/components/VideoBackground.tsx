'use client';

export default function VideoBackground({
  src,
  overlay = true,
}: {
  src: string;
  overlay?: boolean;
}) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <video autoPlay muted loop playsInline className="w-full h-full object-cover" src={src} />
      {overlay && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />}
    </div>
  );
}

