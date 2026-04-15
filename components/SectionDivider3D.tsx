'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function RotatingDivider() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.1, 0.1, 3, 32]} />
      <meshStandardMaterial
        color="#D4AF37"
        metalness={0.9}
        roughness={0.1}
        emissive="#FFD700"
        emissiveIntensity={0.3}
      />

      {/* Tech chip elements */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 4) * 0.15,
            i * 0.3 - 1.2,
            Math.sin((i * Math.PI) / 4) * 0.15,
          ]}
        >
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0} />
        </mesh>
      ))}
    </mesh>
  );
}

export default function SectionDivider3D() {
  return (
    <div className="w-full h-32 my-16 flex items-center justify-center">
      <div className="w-full max-w-4xl h-full">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#FFD700" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#D4AF37" />

          <RotatingDivider />
        </Canvas>
      </div>
    </div>
  );
}

