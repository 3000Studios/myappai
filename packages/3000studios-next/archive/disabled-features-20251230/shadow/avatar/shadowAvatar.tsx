// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  PositionalAudio,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { useAvatarSounds } from "@/hooks/useAvatarSounds";

export default function ShadowAvatar({
  message,
  voiceState,
}: {
  message: string;
  voiceState?: any;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [emotion, setEmotion] = useState("idle");
  const [speaking, setSpeaking] = useState(false);

  // Load 3D model and animations
  const { scene, animations } = useGLTF("/models/shadow_entity.glb");
  const { actions, names } = useAnimations(animations, groupRef);

  // Sound effect refs
  const idleHum = useRef<any>();
  const growl = useRef<any>();
  const alertSound = useRef<any>();
  const charge = useRef<any>();
  const roar = useRef<any>();
  const footsteps = useRef<any>();

  // Sound auto-map
  const soundMap = useAvatarSounds();
  const [audioEnabled, setAudioEnabled] = useState(false);

  const avatarSound = {
    idle:
      soundMap["idle"] ||
      soundMap["ambient"] ||
      soundMap["ambient_loop"] ||
      null,
    talk: soundMap["talk"] || soundMap["voice"] || null,
    anger: soundMap["growl"] || soundMap["roar"] || null,
    excited: soundMap["charge"] || null,
    alert: soundMap["alert"] || soundMap["hiss"] || null,
    footsteps: soundMap["footsteps"] || soundMap["step"] || null,
  };

  // Handle message-based emotion triggers
  useEffect(() => {
    if (!message) return;

    console.log("Avatar received:", message);

    // Determine emotion based on message content
    if (
      message.toLowerCase().includes("error") ||
      message.toLowerCase().includes("fail")
    ) {
      setEmotion("angry");
      growl.current?.play();
    } else if (
      message.toLowerCase().includes("deploy") ||
      message.toLowerCase().includes("success")
    ) {
      setEmotion("excited");
      charge.current?.play();
    } else if (
      message.toLowerCase().includes("hey") ||
      message.toLowerCase().includes("hello")
    ) {
      setEmotion("happy");
      alertSound.current?.play();
    } else {
      setEmotion("talking");
    }

    setSpeaking(true);

    // Return to idle after animation
    setTimeout(() => {
      setEmotion("idle");
      setSpeaking(false);
    }, 3000);
  }, [message]);

  // Handle animation playback based on emotion
  useEffect(() => {
    if (!actions) return;

    // Stop all animations
    Object.values(actions).forEach((action: any) => action?.stop());

    // Play animation based on emotion
    switch (emotion) {
      case "idle":
        actions.Idle?.reset().fadeIn(0.5).play();
        actions.Breath?.reset().fadeIn(0.5).play();
        break;
      case "talking":
        actions.Talk?.reset().fadeIn(0.2).play();
        actions.Blink?.reset().fadeIn(0.1).play();
        break;
      case "excited":
        actions.Excited?.reset().fadeIn(0.3).play();
        break;
      case "angry":
        actions.Angry?.reset().fadeIn(0.2).play();
        break;
      case "happy":
        actions.LookAround?.reset().fadeIn(0.3).play();
        break;
    }
  }, [emotion, actions]);

  // Handle real-time voice control
  useEffect(() => {
    if (!voiceState) return;

    // Update emotion based on voice
    if (voiceState.mood && voiceState.mood !== emotion) {
      setEmotion(voiceState.mood);
    }

    // Update speaking state
    setSpeaking(voiceState.talking);

    // Trigger sounds based on voice volume
    if (voiceState.volume > 0.4 && !growl.current?.isPlaying) {
      growl.current?.play();
    }
  }, [voiceState, emotion]);

  // Subtle continuous animations
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Gentle floating effect
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.02;

    // Subtle glow pulsing based on emotion
    if (emotion === "excited") {
      groupRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.02);
    } else if (emotion === "angry") {
      groupRef.current.rotation.y = Math.sin(time * 10) * 0.05;
    } else {
      groupRef.current.scale.setScalar(1);
      groupRef.current.rotation.y = 0;
    }
  });

  // Color based on emotion
  const getColor = () => {
    switch (emotion) {
      case "angry":
        return "#ff0000";
      case "excited":
        return "#00ff00";
      case "happy":
        return "#ffff00";
      case "talking":
        return "#00ffff";
      default:
        return "#0080ff";
    }
  };

  // Safe positional wrapper
  function safePositional(refObj: any, url?: string, props?: any) {
    if (!audioEnabled || !url) return null;
    return (
      <PositionalAudio
        ref={refObj}
        url={url}
        distance={props?.distance ?? 5}
        loop={props?.loop ?? false}
        autoplay={props?.autoplay ?? false}
      />
    );
  }

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Audio enable button to satisfy autoplay policies */}
      {!audioEnabled && (
        <Html position={[0, 2.2, 0]} center>
          <button
            onClick={() => setAudioEnabled(true)}
            style={{
              padding: "8px 12px",
              background: "#111",
              color: "#0ff",
              border: "1px solid #0ff",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Enable Audio
          </button>
        </Html>
      )}
      {/* 3D Model */}
      <primitive object={scene} scale={1.5} />

      {/* Sound Effects via auto-map (WAV) */}
      {safePositional(idleHum, avatarSound.idle, { distance: 5, loop: true })}
      {safePositional(growl, avatarSound.anger, { distance: 4 })}
      {safePositional(alertSound, avatarSound.alert, { distance: 4 })}
      {safePositional(charge, avatarSound.excited, { distance: 4 })}
      {safePositional(roar, soundMap["roar"], { distance: 4 })}
      {safePositional(footsteps, avatarSound.footsteps, { distance: 3 })}

      {/* Energy aura when speaking */}
      {speaking && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial
            color={getColor()}
            transparent
            opacity={0.15}
            emissive={getColor()}
            emissiveIntensity={0.6}
          />
        </mesh>
      )}
    </group>
  );
}

// Preload the GLTF model
useGLTF.preload("/models/shadow_entity.glb");

