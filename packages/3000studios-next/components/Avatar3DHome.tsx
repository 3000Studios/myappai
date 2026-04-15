'use client';

import { MeshDistortMaterial, OrbitControls, Sphere } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

function AvatarModel() {
  return (
    <Sphere args={[1, 64, 64]} scale={2.5}>
      <MeshDistortMaterial
        color="#D4AF37"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

export default function Avatar3DHome() {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D4AF37" />

        <Suspense fallback={null}>
          <AvatarModel />
        </Suspense>

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} enablePan={false} />
      </Canvas>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
        <h3 className="text-2xl font-bold text-gold animate-pulse">Shadow AI Assistant</h3>
        <p className="text-platinum/70 text-sm mt-2">Voice-activated website control</p>
      </div>
    </div>
  );
}

