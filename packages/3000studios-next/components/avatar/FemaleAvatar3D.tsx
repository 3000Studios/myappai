'use client';

import {
  Billboard,
  Capsule,
  ContactShadows,
  Cylinder,
  Environment,
  Float,
  MeshDistortMaterial,
  RoundedBox,
  Sparkles,
  Sphere,
  Text,
} from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// ============================================
// PREMIUM 3D FEMALE AVATAR COMPONENT
// Works on both public and admin sections
// ============================================

interface AvatarProps {
  expression?: string;
  isSpeaking?: boolean;
  variant?: 'full' | 'bust' | 'head';
  showHUD?: boolean;
  interactionEnabled?: boolean;
}

// Hair strand component for realistic hair
function HairStrands({ color = '#1a1a2e' }: { color?: string }) {
  const strandsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (strandsRef.current) {
      // Subtle hair physics
      strandsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={strandsRef}>
      {/* Main hair volume */}
      <Sphere args={[0.38, 32, 32]} position={[0, 0.05, -0.05]}>
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </Sphere>
      {/* Side hair */}
      <Capsule args={[0.08, 0.5, 8, 16]} position={[-0.28, -0.2, 0]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Capsule>
      <Capsule args={[0.08, 0.5, 8, 16]} position={[0.28, -0.2, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Capsule>
      {/* Back hair (long) */}
      <Capsule args={[0.15, 1.2, 8, 16]} position={[0, -0.6, -0.15]} rotation={[0.1, 0, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Capsule>
    </group>
  );
}

// Eye component with blinking and expression
function Eye({
  position,
  expression,
  isSpeaking,
}: {
  position: [number, number, number];
  expression: string;
  isSpeaking: boolean;
}) {
  const eyeRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);
  const [blink, setBlink] = useState(false);

  // Natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
      },
      3000 + Math.random() * 2000
    );
    return () => clearInterval(blinkInterval);
  }, []);

  useFrame((state) => {
    if (pupilRef.current) {
      // Subtle eye movement following virtual point
      const t = state.clock.elapsedTime;
      pupilRef.current.position.x = Math.sin(t * 0.5) * 0.01;
      pupilRef.current.position.y = Math.cos(t * 0.7) * 0.005;
    }
  });

  const getIrisColor = () => {
    switch (expression) {
      case 'happy':
        return '#00e5ff';
      case 'excited':
        return '#ffeb3b';
      case 'angry':
        return '#ff1744';
      case 'sad':
        return '#5c6bc0';
      case 'talking':
        return '#00bcd4';
      default:
        return '#00aaff';
    }
  };

  return (
    <group position={position}>
      {/* Eyeball */}
      <Sphere ref={eyeRef} args={[0.045, 32, 32]} scale={[1, blink ? 0.1 : 1, 1]}>
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0} />
      </Sphere>
      {/* Iris */}
      <Sphere args={[0.025, 32, 32]} position={[0, 0, 0.025]}>
        <meshStandardMaterial
          color={getIrisColor()}
          emissive={getIrisColor()}
          emissiveIntensity={isSpeaking ? 1.5 : 0.5}
        />
      </Sphere>
      {/* Pupil */}
      <Sphere ref={pupilRef} args={[0.012, 16, 16]} position={[0, 0, 0.035]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
    </group>
  );
}

// Lips with speaking animation
function Lips({ isSpeaking, expression }: { isSpeaking: boolean; expression: string }) {
  const lipsRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (lipsRef.current && isSpeaking) {
      // Natural speaking motion
      const t = state.clock.elapsedTime;
      lipsRef.current.scale.y = 0.8 + Math.sin(t * 15) * 0.3;
      lipsRef.current.scale.x = 1 + Math.cos(t * 12) * 0.1;
    } else if (lipsRef.current) {
      // Idle expression
      lipsRef.current.scale.y = expression === 'happy' ? 1.1 : 1;
      lipsRef.current.scale.x = expression === 'happy' ? 1.2 : 1;
    }
  });

  return (
    <group position={[0, -0.12, 0.28]}>
      {/* Upper lip */}
      <RoundedBox ref={lipsRef} args={[0.08, 0.015, 0.02]} radius={0.005}>
        <meshStandardMaterial color="#d4848a" roughness={0.3} />
      </RoundedBox>
      {/* Lower lip */}
      <RoundedBox args={[0.07, 0.02, 0.02]} position={[0, -0.015, 0]} radius={0.005}>
        <meshStandardMaterial color="#c77b81" roughness={0.3} />
      </RoundedBox>
    </group>
  );
}

// Main Avatar Body
function FemaleAvatarBody({
  expression = 'neutral',
  isSpeaking = false,
  variant = 'full',
}: {
  expression: string;
  isSpeaking: boolean;
  variant: 'full' | 'bust' | 'head';
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Breathing and mouse tracking
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;

      // Breathing animation
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.03;

      // Mouse parallax (subtle head turning)
      const targetRotY = mouse.x * 0.3;
      const targetRotX = -mouse.y * 0.15;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.05
      );
    }
  });

  const skinColor = '#f5dcd4';
  const bodyColor = '#1a1a2e';
  const accentColor = '#D4AF37'; // Gold accent

  return (
    <group ref={groupRef}>
      {/* --- HEAD --- */}
      <group position={[0, variant === 'head' ? 0 : 1.6, 0]}>
        {/* Face */}
        <Sphere args={[0.32, 64, 64]}>
          <MeshDistortMaterial
            color={skinColor}
            distort={0.02}
            speed={1}
            roughness={0.4}
            metalness={0}
          />
        </Sphere>

        {/* Hair */}
        <group position={[0, 0.1, 0]}>
          <HairStrands color="#1a1a2e" />
        </group>

        {/* Eyes */}
        <Eye position={[-0.1, 0.05, 0.25]} expression={expression} isSpeaking={isSpeaking} />
        <Eye position={[0.1, 0.05, 0.25]} expression={expression} isSpeaking={isSpeaking} />

        {/* Eyebrows */}
        <RoundedBox
          args={[0.06, 0.01, 0.01]}
          position={[-0.1, 0.12, 0.28]}
          rotation={[0, 0, expression === 'angry' ? 0.2 : -0.05]}
          radius={0.003}
        >
          <meshStandardMaterial color="#2d2d2d" />
        </RoundedBox>
        <RoundedBox
          args={[0.06, 0.01, 0.01]}
          position={[0.1, 0.12, 0.28]}
          rotation={[0, 0, expression === 'angry' ? -0.2 : 0.05]}
          radius={0.003}
        >
          <meshStandardMaterial color="#2d2d2d" />
        </RoundedBox>

        {/* Nose */}
        <Sphere args={[0.03, 16, 16]} position={[0, -0.02, 0.3]}>
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </Sphere>

        {/* Lips */}
        <Lips isSpeaking={isSpeaking} expression={expression} />

        {/* Ears */}
        <Sphere args={[0.05, 16, 16]} position={[-0.32, 0, 0]}>
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </Sphere>
        <Sphere args={[0.05, 16, 16]} position={[0.32, 0, 0]}>
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </Sphere>

        {/* Earrings (Gold) */}
        <Sphere args={[0.015, 16, 16]} position={[-0.34, -0.08, 0]}>
          <meshStandardMaterial color={accentColor} metalness={1} roughness={0.2} />
        </Sphere>
        <Sphere args={[0.015, 16, 16]} position={[0.34, -0.08, 0]}>
          <meshStandardMaterial color={accentColor} metalness={1} roughness={0.2} />
        </Sphere>

        {/* Tech Halo (Cyber Element) */}
        <Float speed={3} rotationIntensity={0.3}>
          <Cylinder
            args={[0.45, 0.45, 0.015, 64]}
            position={[0, 0.4, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
              metalness={1}
              roughness={0}
            />
          </Cylinder>
        </Float>
      </group>

      {variant !== 'head' && (
        <>
          {/* --- NECK --- */}
          <Cylinder args={[0.08, 0.1, 0.25, 16]} position={[0, 1.25, 0]}>
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </Cylinder>

          {/* Necklace */}
          <Cylinder args={[0.11, 0.11, 0.01, 32]} position={[0, 1.15, 0.02]} rotation={[0.2, 0, 0]}>
            <meshStandardMaterial color={accentColor} metalness={1} roughness={0.2} />
          </Cylinder>

          {/* --- TORSO --- */}
          <group position={[0, 0.6, 0]}>
            {/* Upper body base */}
            <Capsule args={[0.22, 0.6, 16, 32]}>
              <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.5} />
            </Capsule>

            {/* Chest accent lines */}
            <RoundedBox args={[0.3, 0.02, 0.01]} position={[0, 0.2, 0.22]} radius={0.005}>
              <meshStandardMaterial
                color={accentColor}
                emissive={accentColor}
                emissiveIntensity={0.5}
                metalness={1}
              />
            </RoundedBox>

            {/* Core reactor (heart glow) */}
            <Sphere args={[0.05]} position={[0, 0.15, 0.2]}>
              <meshStandardMaterial
                color="#00e5ff"
                emissive="#00e5ff"
                emissiveIntensity={isSpeaking ? 2 : 1}
              />
            </Sphere>
          </group>

          {/* --- SHOULDERS --- */}
          <Sphere args={[0.12, 16, 16]} position={[-0.35, 1, 0]}>
            <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.5} />
          </Sphere>
          <Sphere args={[0.12, 16, 16]} position={[0.35, 1, 0]}>
            <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.5} />
          </Sphere>

          {variant === 'full' && (
            <>
              {/* --- ARMS --- */}
              <Capsule args={[0.06, 0.5, 8, 16]} position={[-0.45, 0.5, 0]} rotation={[0, 0, 0.15]}>
                <meshStandardMaterial color={skinColor} roughness={0.5} />
              </Capsule>
              <Capsule args={[0.06, 0.5, 8, 16]} position={[0.45, 0.5, 0]} rotation={[0, 0, -0.15]}>
                <meshStandardMaterial color={skinColor} roughness={0.5} />
              </Capsule>

              {/* Bracelets */}
              <Cylinder
                args={[0.07, 0.07, 0.02, 16]}
                position={[-0.5, 0.2, 0]}
                rotation={[0, 0, 0.15]}
              >
                <meshStandardMaterial color={accentColor} metalness={1} roughness={0.2} />
              </Cylinder>
              <Cylinder
                args={[0.07, 0.07, 0.02, 16]}
                position={[0.5, 0.2, 0]}
                rotation={[0, 0, -0.15]}
              >
                <meshStandardMaterial color={accentColor} metalness={1} roughness={0.2} />
              </Cylinder>

              {/* --- LOWER BODY --- */}
              <Capsule args={[0.18, 0.4, 8, 16]} position={[0, 0, 0]}>
                <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.5} />
              </Capsule>

              {/* --- LEGS (hints) --- */}
              <Capsule args={[0.1, 0.8, 8, 16]} position={[-0.12, -0.7, 0]}>
                <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.5} />
              </Capsule>
              <Capsule args={[0.1, 0.8, 8, 16]} position={[0.12, -0.7, 0]}>
                <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.5} />
              </Capsule>
            </>
          )}
        </>
      )}
    </group>
  );
}

// Status HUD overlay
function StatusHUD({ expression, isSpeaking }: { expression: string; isSpeaking: boolean }) {
  return (
    <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
      <group position={[0, 2.2, 0]}>
        <Text
          fontSize={0.08}
          color={isSpeaking ? '#FFD700' : '#00e5ff'}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {isSpeaking ? '● SPEAKING' : `◉ ${expression.toUpperCase()}`}
        </Text>
      </group>
    </Billboard>
  );
}

// Main exported component
export default function FemaleAvatar3D({
  expression = 'neutral',
  isSpeaking = false,
  variant = 'full',
  showHUD = true,
  interactionEnabled = true,
}: AvatarProps) {
  const [currentExpression, setCurrentExpression] = useState(expression);
  const [speaking, setSpeaking] = useState(isSpeaking);

  // Listen for voice commands
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVoiceCommand = (e: CustomEvent) => {
      if (e.detail?.target === 'avatar') {
        if (e.detail.action === 'speak') {
          setSpeaking(true);
          setCurrentExpression('talking');
          setTimeout(() => {
            setSpeaking(false);
            setCurrentExpression('neutral');
          }, e.detail.duration || 3000);
        }
        if (e.detail.action === 'emotion') {
          setCurrentExpression(e.detail.value);
        }
      }
    };

    window.addEventListener('voice-command', handleVoiceCommand as EventListener);
    return () => window.removeEventListener('voice-command', handleVoiceCommand as EventListener);
  }, []);

  // Sync with props
  useEffect(() => {
    setCurrentExpression(expression);
    setSpeaking(isSpeaking);
  }, [expression, isSpeaking]);

  const cameraPosition = useMemo(() => {
    switch (variant) {
      case 'head':
        return [0, 0, 1.5] as [number, number, number];
      case 'bust':
        return [0, 1.2, 2.5] as [number, number, number];
      default:
        return [0, 0.5, 4] as [number, number, number];
    }
  }, [variant]);

  return (
    <div className="w-full h-full relative">
      {/* Status indicator */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            speaking ? 'bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50' : 'bg-cyan-400'
          }`}
        />
        <span className="text-xs font-mono tracking-widest uppercase text-cyan-400/80">
          AI: {currentExpression}
        </span>
      </div>

      <Canvas
        camera={{ position: cameraPosition, fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 3, 5]} intensity={0.8} color="#00e5ff" />
        <pointLight position={[5, -3, 5]} intensity={0.5} color="#ff00ff" />
        <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={1} castShadow />

        {/* Avatar */}
        <FemaleAvatarBody expression={currentExpression} isSpeaking={speaking} variant={variant} />

        {/* Effects */}
        <Sparkles
          count={40}
          scale={variant === 'head' ? 2 : 5}
          size={2}
          speed={0.3}
          opacity={0.3}
          color="#D4AF37"
        />

        {/* Environment */}
        <Environment preset="city" />

        {variant === 'full' && (
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={3} blur={2} />
        )}

        {showHUD && <StatusHUD expression={currentExpression} isSpeaking={speaking} />}
      </Canvas>
    </div>
  );
}

