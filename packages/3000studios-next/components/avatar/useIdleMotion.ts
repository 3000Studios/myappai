'use client';

import { useFrame } from '@react-three/fiber';
import { RefObject } from 'react';
import { Group } from 'three';

export default function useIdleMotion(ref: RefObject<Group>) {
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = -1.3 + Math.sin(clock.elapsedTime * 1.5) * 0.03;
  });
}

