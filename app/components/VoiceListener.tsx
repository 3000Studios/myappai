'use client';

import { useEffect } from 'react';

import { handleVoicePayload } from '@/lib/voice/payloadHandler';

export default function VoiceListener() {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/voice');
        const cmd = await res.json();
        if (!cmd || !cmd.action) return;

        // Phase 63 & 32: Route to Payload Handler
        // Phase 34: Monetization Engine
        if (cmd.target === 'ui' || cmd.target === 'style' || cmd.target === 'monetization') {
          handleVoicePayload(cmd);
          return;
        }

        // Phase 63: Avatar Voice Control
        if (cmd.target === 'avatar') {
          window.dispatchEvent(new CustomEvent('voice-command', { detail: cmd }));
          return;
        }

        if (cmd.action === 'addText') {
          const el = document.createElement('div');
          el.innerText = cmd.text;
          el.style.position = 'fixed';
          el.style.bottom = '20px';
          el.style.right = '20px';
          el.style.color = 'gold';
          el.style.zIndex = '9999';
          document.body.appendChild(el);
        }

        if (cmd.action === 'addVideo') {
          const video = document.createElement('video');
          video.src = cmd.src;
          video.autoplay = true;
          video.loop = true;
          video.muted = true;
          video.style.position = 'fixed';
          video.style.inset = '0';
          video.style.zIndex = '-1';
          document.body.appendChild(video);
        }

        if (cmd.action === 'changeTheme') {
          // Legacy support, but payloadHandler handles this better now
          handleVoicePayload({ target: 'style', path: 'accent', value: cmd.color });
        }
      } catch (e: unknown) {
        // Silent fail on API errors
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return null;
}

