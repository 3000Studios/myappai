/**
 * Avatar Mesh - 3D Model
 * The actual 3D geometry and materials
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

export default function AvatarMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !headRef.current) return;

    // Idle animation - subtle floating
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

    // Head slight rotation
    headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <Sphere ref={headRef} args={[0.5, 32, 32]} position={[0, 0.5, 0]}>
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
          emissive="#FFD700"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Eyes */}
      <Sphere args={[0.08, 16, 16]} position={[-0.15, 0.6, 0.4]}>
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1} />
      </Sphere>
      <Sphere args={[0.08, 16, 16]} position={[0.15, 0.6, 0.4]}>
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1} />
      </Sphere>

      {/* Body */}
      <Box args={[0.6, 1, 0.4]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </Box>

      {/* Glow effect */}
      <Sphere args={[0.7, 32, 32]} position={[0, 0.5, 0]}>
        <meshBasicMaterial color="#FFD700" transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
}

