'use client';

export function useHoverSound(src: string) {
  if (typeof Audio === 'undefined') return () => {};
  const audio = new Audio(src);
  return () => audio.play().catch(() => {});
}

