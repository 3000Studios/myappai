'use client';

import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

function JWSModel() {
  // Abstract Holographic Representation for Admin
  return (
    <group position={[0, 0, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color="#FFD700"
          wireframe
          emissive="#FF0000"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh scale={0.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

export default function PersonalAvatar() {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent rounded-full blur-3xl" />
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#FF0000" intensity={1} />
        <spotLight position={[-10, -10, -10]} color="#FFD700" intensity={0.5} />
        <Suspense fallback={null}>
          <JWSModel />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-1 rounded-full border border-red-500/30">
        <span className="text-red-400 text-xs font-mono">ADMINISTRATOR AVATAR ACTIVE</span>
      </div>
    </div>
  );
}

