'use client';

import { Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AvatarModelProps {
  modelPath?: string;
  isListening?: boolean;
  isSpeaking?: boolean;
}

function AvatarModel({
  modelPath = '/models/avatar.glb',
  isListening,
  isSpeaking,
}: AvatarModelProps) {
  const modelRef = useRef<THREE.Group>(null);

  // Try to load the model, fallback to primitive sphere if not available
  let scene: THREE.Group | null = null;
  try {
    const gltf = useGLTF(modelPath);
    scene = gltf.scene;
  } catch {
    console.log('Model not found, using fallback');
  }

  useEffect(() => {
    if (!modelRef.current) return;

    // Animate based on state
    const animate = () => {
      if (!modelRef.current) return;

      if (isListening) {
        // Gentle nodding when listening
        modelRef.current.rotation.x = Math.sin(Date.now() * 0.002) * 0.1;
      } else if (isSpeaking) {
        // More animated when speaking
        modelRef.current.rotation.y = Math.sin(Date.now() * 0.003) * 0.15;
        modelRef.current.position.y = Math.sin(Date.now() * 0.004) * 0.05;
      } else {
        // Idle subtle movement
        modelRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.05;
      }
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [isListening, isSpeaking]);

  if (scene) {
    return <primitive ref={modelRef} object={scene} scale={2} position={[0, -1, 0]} />;
  }

  // Fallback: Stylized avatar sphere
  return (
    <group ref={modelRef}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={isSpeaking ? '#fbbf24' : isListening ? '#60a5fa' : '#a78bfa'}
          emissive={isSpeaking ? '#fbbf24' : isListening ? '#60a5fa' : '#a78bfa'}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Mouth - animates when speaking */}
      <mesh position={[0, -0.2, 0.8]} scale={[0.4, isSpeaking ? 0.3 : 0.1, 0.1]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

interface InteractiveAvatarProps {
  modelPath?: string;
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
}

export default function InteractiveAvatar({
  modelPath,
  isListening = false,
  isSpeaking = false,
  className = '',
}: InteractiveAvatarProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={0.4} />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#fbbf24" />

        <Suspense
          fallback={
            <Html center>
              <div className="text-white text-sm">Loading avatar...</div>
            </Html>
          }
        >
          <AvatarModel modelPath={modelPath} isListening={isListening} isSpeaking={isSpeaking} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={!isListening && !isSpeaking}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

// Preload model if path is provided
export function preloadAvatarModel(path: string) {
  try {
    useGLTF.preload(path);
  } catch (error: unknown) {
    console.log('Failed to preload avatar model', error);
  }
}
