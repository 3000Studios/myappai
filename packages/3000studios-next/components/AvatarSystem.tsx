'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Html } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function AvatarPlaceholder({
  position,
  color,
  label,
}: {
  position: [number, number, number];
  color: string;
  label: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Simple idle animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <capsuleGeometry args={[0.4, 1.4, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
      </mesh>
      <Html position={[0, 1.2, 0]} center>
        <div className="px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm whitespace-nowrap">
          {label} (Pending GLB)
        </div>
      </Html>
    </group>
  );
}

export default function AvatarSystem() {
  return (
    <div className="w-full h-full min-h-[500px] relative rounded-2xl overflow-hidden glass-premium">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1} />
        <pointLight position={[-5, 0, -5]} intensity={0.5} color="#00e5ff" />

        <Suspense fallback={<Html center>Loading 3D Scene...</Html>}>
          {/* Avatar 1 - Left-ish */}
          <AvatarPlaceholder position={[-0.8, -0.5, 0]} color="#00ff9d" label="Avatar 1" />

          {/* Avatar 2 - Right-ish (relative to group) */}
          <AvatarPlaceholder position={[0.8, -0.5, 0]} color="#ff00cc" label="Avatar 2" />

          <Environment preset="night" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2 - 0.2}
          maxPolarAngle={Math.PI / 2 + 0.2}
        />
      </Canvas>
    </div>
  );
}

