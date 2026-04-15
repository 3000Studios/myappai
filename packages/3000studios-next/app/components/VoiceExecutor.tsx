'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VoiceExecutor() {
  const router = useRouter();

  useEffect(() => {
    const tick = setInterval(async () => {
      try {
        const res = await fetch('/api/voice');
        const cmd = await res.json();
        if (!cmd?.action) return;

        if (cmd.action === 'navigate') {
          router.push(cmd.path);
        }

        if (cmd.action === 'addImage') {
          const img = document.createElement('img');
          img.src = cmd.src;
          img.style.maxWidth = '400px';
          img.style.position = 'fixed';
          img.style.bottom = '20px';
          img.style.left = '20px';
          img.style.zIndex = '9999';
          document.body.appendChild(img);
        }

        if (cmd.action === 'injectHTML') {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = cmd.html;
          document.body.appendChild(wrapper);
        }

        if (cmd.action === 'setCSS') {
          const el = document.querySelector(cmd.selector) as HTMLElement;
          if (!el) return;
          Object.entries(cmd.css as Record<string, string>).forEach(([k, v]) => {
            el.style.setProperty(k, v);
          });
        }

        if (cmd.action === 'deploy') {
          await fetch('/api/git', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'voice deploy' }),
          });
          alert('Deploying to production...');
        }
      } catch (e: unknown) {
        // Silent fail
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [router]);

  return null;
}

