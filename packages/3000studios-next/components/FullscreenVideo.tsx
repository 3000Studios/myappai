'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ButtonConfig {
  label: string;
  nextVideo: string;
  redirect: string;
}

export default function FullscreenVideo({ src, button }: { src: string; button?: ButtonConfig }) {
  const router = useRouter();
  const [transition, setTransition] = useState(false);

  return (
    <div className="fullscreen">
      <video
        autoPlay
        loop
        muted
        playsInline
        src={transition && button ? button.nextVideo : src}
        className="fullscreen-video"
      />
      {button && !transition && (
        <button
          className="fullscreen-button"
          onClick={() => {
            setTransition(true);
            setTimeout(() => router.push(button.redirect), 4000);
          }}
        >
          {button.label}
        </button>
      )}
    </div>
  );
}

