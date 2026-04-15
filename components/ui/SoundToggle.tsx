'use client';
import { Howler } from 'howler';
import { useEffect, useState } from 'react';

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    Howler.mute(!enabled);
  }, [enabled]);

  return (
    <button
      aria-label={enabled ? 'Disable sound' : 'Enable sound'}
      onClick={() => setEnabled((v) => !v)}
      className="fixed right-4 top-4 z-50 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 backdrop-blur"
    >
      {enabled ? 'Sound: On' : 'Sound: Off'}
    </button>
  );
}

