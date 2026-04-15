'use client';

import {
  Box,
  Float,
  MeshDistortMaterial,
  OrbitControls,
  RoundedBox,
  Sparkles,
  Sphere,
  Torus,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Sleek Female AI Avatar - Cyberpunk Style
function CyberFemaleAvatar({
  expression,
  isSpeaking,
}: {
  expression: string;
  isSpeaking: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const hairRef = useRef<THREE.Group>(null);

  // Color scheme based on expression
  const colors = useMemo(() => {
    switch (expression) {
      case 'happy':
        return { primary: '#00ffcc', secondary: '#00ff88', glow: '#00ffcc' };
      case 'angry':
        return { primary: '#ff3366', secondary: '#ff0044', glow: '#ff3366' };
      case 'talking':
        return { primary: '#ffd700', secondary: '#ffaa00', glow: '#ffd700' };
      default:
        return { primary: '#00aaff', secondary: '#0088cc', glow: '#00aaff' };
    }
  }, [expression]);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.08 - 1.2;

      // Subtle mouse tracking
      const mouseX = state.mouse.x * 0.15;
      const mouseY = state.mouse.y * 0.08;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouseY * 0.3,
        0.05
      );
    }

    // Speaking animation - subtle head bob
    if (headRef.current && isSpeaking) {
      headRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 12) * 0.02;
    }

    // Hair physics
    if (hairRef.current) {
      hairRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.03;
    }
  });

  return (
    <group ref={groupRef} scale={1.3}>
      {/* --- HEAD --- */}
      <group position={[0, 1.5, 0]}>
        {/* Face - Elegant oval shape */}
        <Sphere args={[0.32, 64, 64]} ref={headRef}>
          <MeshDistortMaterial
            color="#f0e6dc"
            distort={0.05}
            speed={1.5}
            roughness={0.3}
            metalness={0.1}
          />
        </Sphere>

        {/* Cheekbones highlight */}
        <Sphere position={[-0.15, -0.02, 0.22]} args={[0.08, 32, 32]}>
          <meshStandardMaterial color="#fce4d8" transparent opacity={0.6} />
        </Sphere>
        <Sphere position={[0.15, -0.02, 0.22]} args={[0.08, 32, 32]}>
          <meshStandardMaterial color="#fce4d8" transparent opacity={0.6} />
        </Sphere>

        {/* Eyes - Almond shaped with glow */}
        <group position={[0, 0.05, 0.25]}>
          {/* Left Eye */}
          <group position={[-0.1, 0, 0]}>
            <Sphere args={[0.045, 32, 32]} scale={[1.3, 0.9, 0.8]}>
              <meshStandardMaterial color="#ffffff" />
            </Sphere>
            <Sphere position={[0, 0, 0.02]} args={[0.025, 32, 32]}>
              <meshStandardMaterial
                color={colors.primary}
                emissive={colors.glow}
                emissiveIntensity={1.5}
              />
            </Sphere>
            <Sphere position={[0, 0, 0.035]} args={[0.012, 16, 16]}>
              <meshStandardMaterial color="#000000" />
            </Sphere>
          </group>

          {/* Right Eye */}
          <group position={[0.1, 0, 0]}>
            <Sphere args={[0.045, 32, 32]} scale={[1.3, 0.9, 0.8]}>
              <meshStandardMaterial color="#ffffff" />
            </Sphere>
            <Sphere position={[0, 0, 0.02]} args={[0.025, 32, 32]}>
              <meshStandardMaterial
                color={colors.primary}
                emissive={colors.glow}
                emissiveIntensity={1.5}
              />
            </Sphere>
            <Sphere position={[0, 0, 0.035]} args={[0.012, 16, 16]}>
              <meshStandardMaterial color="#000000" />
            </Sphere>
          </group>
        </group>

        {/* Eyebrows */}
        <RoundedBox position={[-0.1, 0.14, 0.24]} args={[0.08, 0.015, 0.02]} radius={0.005}>
          <meshStandardMaterial color="#2a1810" />
        </RoundedBox>
        <RoundedBox position={[0.1, 0.14, 0.24]} args={[0.08, 0.015, 0.02]} radius={0.005}>
          <meshStandardMaterial color="#2a1810" />
        </RoundedBox>

        {/* Nose - Subtle */}
        <Sphere position={[0, -0.02, 0.3]} args={[0.025, 16, 16]} scale={[0.6, 0.8, 1]}>
          <meshStandardMaterial color="#e8d4c8" />
        </Sphere>

        {/* Lips */}
        <group position={[0, -0.1, 0.27]}>
          <Sphere args={[0.04, 32, 32]} scale={[1.5, 0.5, 0.6]}>
            <meshStandardMaterial color="#cc6677" metalness={0.3} roughness={0.4} />
          </Sphere>
        </group>

        {/* HAIR - Flowing cyber style */}
        <group ref={hairRef}>
          {/* Main hair volume */}
          <Sphere position={[0, 0.15, -0.05]} args={[0.38, 32, 32]} scale={[1, 0.9, 0.9]}>
            <meshStandardMaterial color="#1a0a1e" metalness={0.4} roughness={0.6} />
          </Sphere>

          {/* Flowing strands */}
          {[-0.2, -0.1, 0, 0.1, 0.2].map((x, i) => (
            <Box
              key={i}
              position={[x, -0.1, -0.25]}
              args={[0.06, 0.5, 0.03]}
              rotation={[0.2, 0, x * 0.3]}
            >
              <meshStandardMaterial color="#1a0a1e" metalness={0.4} />
            </Box>
          ))}

          {/* Cyber highlights in hair */}
          <Torus position={[0.25, 0.1, 0.1]} args={[0.03, 0.008, 16, 32]} rotation={[0, 0.5, 0]}>
            <meshStandardMaterial
              color={colors.primary}
              emissive={colors.glow}
              emissiveIntensity={2}
            />
          </Torus>
        </group>

        {/* Cyber implant / earpiece */}
        <group position={[-0.32, 0, 0]}>
          <Box args={[0.02, 0.08, 0.03]}>
            <meshStandardMaterial color="#333" metalness={0.9} />
          </Box>
          <Sphere position={[0, 0, 0.02]} args={[0.015]}>
            <meshStandardMaterial
              color={colors.primary}
              emissive={colors.glow}
              emissiveIntensity={3}
            />
          </Sphere>
        </group>
      </group>

      {/* --- NECK --- */}
      <Sphere position={[0, 1.15, 0]} args={[0.08, 32, 32]} scale={[1, 1.5, 0.9]}>
        <meshStandardMaterial color="#f0e6dc" />
      </Sphere>

      {/* --- SHOULDERS & UPPER BODY --- */}
      <group position={[0, 0.7, 0]}>
        {/* Shoulders */}
        <Sphere position={[-0.35, 0.2, 0]} args={[0.12, 32, 32]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
        </Sphere>
        <Sphere position={[0.35, 0.2, 0]} args={[0.12, 32, 32]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
        </Sphere>

        {/* Torso - Sleek bodysuit */}
        <RoundedBox args={[0.5, 0.6, 0.25]} radius={0.1}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
        </RoundedBox>

        {/* Glowing chest piece / reactor */}
        <Sphere position={[0, 0.1, 0.13]} args={[0.06, 32, 32]}>
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.glow}
            emissiveIntensity={2}
            transparent
            opacity={0.9}
          />
        </Sphere>

        {/* Tech lines on suit */}
        <Box position={[-0.15, 0, 0.12]} args={[0.15, 0.01, 0.01]}>
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.glow}
            emissiveIntensity={1}
          />
        </Box>
        <Box position={[0.15, 0, 0.12]} args={[0.15, 0.01, 0.01]}>
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.glow}
            emissiveIntensity={1}
          />
        </Box>
      </group>

      {/* Floating holographic ring */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <Torus position={[0, 1.8, 0]} args={[0.4, 0.015, 16, 64]} rotation={[1.5, 0, 0]}>
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.glow}
            emissiveIntensity={1.5}
            transparent
            opacity={0.6}
          />
        </Torus>
      </Float>
    </group>
  );
}

export default function AvatarScene({
  expression,
  isSpeaking,
}: {
  expression: string;
  isSpeaking: boolean;
}) {
  return (
    <Canvas camera={{ position: [0, 0.5, 3.5], fov: 50 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-3, 2, 3]} intensity={1} color="#00ffff" />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="#ff00ff" />
      <spotLight position={[0, 4, 5]} angle={0.4} penumbra={1} intensity={1.5} castShadow />

      <CyberFemaleAvatar expression={expression} isSpeaking={isSpeaking} />

      <Sparkles count={30} scale={3} size={2} speed={0.3} opacity={0.15} color="#00ffcc" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={1.1}
        maxPolarAngle={1.9}
        minAzimuthAngle={-0.4}
        maxAzimuthAngle={0.4}
      />
    </Canvas>
  );
}


