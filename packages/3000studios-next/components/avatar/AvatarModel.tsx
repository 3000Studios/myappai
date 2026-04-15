'use client';

import { useGLTF } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { Group } from 'three';
import useFaceTracking from './useFaceTracking';
import useIdleMotion from './useIdleMotion';
import useLipSync from './useLipSync';
import useSpeech from './useSpeech';

function AvatarContent() {
  const group = useRef<Group>(null!);

  // Load avatar model
  const gltf = useGLTF('/models/avatar.glb');

  useIdleMotion(group);
  useLipSync(group);
  useFaceTracking(group);
  useSpeech();

  return (
    <group ref={group} position={[0, -1.3, 0]} scale={1.05}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function FallbackAvatar() {
  const group = useRef<Group>(null!);

  useIdleMotion(group);
  useSpeech();

  return (
    <group ref={group} position={[0, -1.3, 0]} scale={1.05}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function AvatarModel() {
  return (
    <Suspense fallback={<FallbackAvatar />}>
      <AvatarContent />
    </Suspense>
  );
}

