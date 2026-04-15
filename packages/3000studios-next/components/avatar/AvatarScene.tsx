'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import AvatarModel from './AvatarModel';

export default function AvatarScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 2.5], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ powerPreference: 'high-performance', antialias: false }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
      <spotLight position={[-3, 5, -2]} intensity={1.5} angle={0.3} penumbra={1} />
      <Suspense fallback={null}>
        <AvatarModel />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

