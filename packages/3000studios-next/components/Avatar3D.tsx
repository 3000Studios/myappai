'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FemaleAvatar({ isListening, isSpeaking }: { isListening: boolean; isSpeaking: boolean }) {
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime((t) => t + delta);

    if (headRef.current) {
      // Idle animation - gentle head movement
      if (!isListening && !isSpeaking) {
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
        headRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
      }

      // Listening animation - attentive head tilt
      if (isListening) {
        headRef.current.rotation.y = Math.sin(time * 2) * 0.2;
        headRef.current.rotation.z = Math.sin(time * 1.5) * 0.1;
      }

      // Speaking animation - more pronounced movement
      if (isSpeaking) {
        headRef.current.rotation.y = Math.sin(time * 3) * 0.15;
        headRef.current.position.y = 1.5 + Math.sin(time * 4) * 0.05;
      }
    }

    if (bodyRef.current) {
      // Body breathing animation
      bodyRef.current.scale.y = 1 + Math.sin(time * 2) * 0.02;
    }
  });

  return (
    <group>
      {/* Body */}
      <group ref={bodyRef}>
        {/* Torso */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.4, 1, 16, 16]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
      </group>

      {/* Head */}
      <group ref={headRef} position={[0, 1.5, 0]}>
        {/* Head sphere */}
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color="#e6b88a" />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.12, 0.05, 0.3]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh position={[0.12, 0.05, 0.3]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

        {/* Pupils */}
        <mesh position={[-0.12, 0.05, 0.35]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.12, 0.05, 0.35]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.05, 0.33]}>
          <coneGeometry args={[0.04, 0.12, 8]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>

        {/* Mouth */}
        <mesh position={[0, -0.15, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#b85555" />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.2, -0.1]}>
          <sphereGeometry args={[0.38, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#3d2817" />
        </mesh>
      </group>

      {/* Arms */}
      <group>
        {/* Left arm */}
        <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.1, 0.8, 8, 8]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>

        {/* Right arm */}
        <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.1, 0.8, 8, 8]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
      </group>

      {/* Status indicator glow */}
      {isListening && (
        <pointLight position={[0, 1.5, 0]} color="#ff0000" intensity={2} distance={3} />
      )}
      {isSpeaking && (
        <pointLight position={[0, 1.5, 0]} color="#ffaa00" intensity={2} distance={3} />
      )}
    </group>
  );
}

export default function Avatar3D({
  isListening,
  isSpeaking,
}: {
  isListening: boolean;
  isSpeaking: boolean;
}) {
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1.5, 4]} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        <spotLight position={[0, 5, 0]} intensity={0.8} angle={0.6} penumbra={1} castShadow />

        {/* Avatar */}
        <FemaleAvatar isListening={isListening} isSpeaking={isSpeaking} />

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Background */}
        <mesh position={[0, 0, -5]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
      </Canvas>
    </div>
  );
}

