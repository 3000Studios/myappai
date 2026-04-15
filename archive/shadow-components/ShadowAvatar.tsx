"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Sphere,
  MeshDistortMaterial,
  Float,
  Environment,
  Sparkles,
} from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// The 3D Scene Component
function AvatarScene({ isSpeaking }: { isSpeaking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate slowly
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;

      // Pulse scale when speaking
      const targetScale = isSpeaking ? 1.2 : 1.0;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );
    }
  });

  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.2, 64, 64]} ref={meshRef}>
          <MeshDistortMaterial
            color={isSpeaking ? "#FFD700" : "#4F46E5"} // Gold when speaking, Indigo otherwise
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0}
            metalness={0.5}
            distort={isSpeaking ? 0.6 : 0.3} // More distortion when speaking
            speed={isSpeaking ? 4 : 2}
          />
        </Sphere>
      </Float>
      <Sparkles
        count={50}
        scale={4}
        size={4}
        speed={0.4}
        opacity={0.5}
        color="#00F5D4"
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00F5D4" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF0080" />
    </>
  );
}

interface ShadowAvatarProps {
  isSpeaking?: boolean;
}

export default function ShadowAvatar({
  isSpeaking = false,
}: ShadowAvatarProps) {
  return (
    <div className="w-full h-full min-h-[150px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <AvatarScene isSpeaking={isSpeaking} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

