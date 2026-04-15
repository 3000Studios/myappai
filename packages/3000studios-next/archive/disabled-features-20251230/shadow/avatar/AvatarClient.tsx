// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useLLMFusionCore } from "@/brain/llmFusionCore";
import ShadowSubtitle from "@/components/ShadowSubtitle";
import { Suspense, useEffect, useState } from "react";
import ShadowAvatar from "./shadowAvatar";
import useVoiceAvatar from "@/hooks/useVoiceAvatar";

export default function AvatarClient() {
  const [wsMsg, setWsMsg] = useState("");
  const [connected, setConnected] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceState, setVoiceState] = useState({
    talking: false,
    volume: 0,
    mood: "idle",
  });
  const llm = useLLMFusionCore();

  // Voice activation hook
  useEffect(() => {
    if (!voiceEnabled) {
      setVoiceState({ talking: false, volume: 0, mood: "idle" });
      return;
    }

    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("Voice Avatar: getUserMedia not supported");
      setWsMsg("Microphone not supported");
      return;
    }

    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;
    let timeArray: any;
    let animationFrame: number;
    let stream: MediaStream;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((mediaStream) => {
        stream = mediaStream;
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        timeArray = new Uint8Array(analyser.fftSize) as any;

        microphone.connect(analyser);

        setWsMsg("Microphone activated");

        // Animation loop to detect speech
        const detectSpeech = () => {
          analyser.getByteTimeDomainData(timeArray);

          // Calculate RMS volume from time domain data
          let sumSquares = 0;
          for (let i = 0; i < timeArray.length; i++) {
            const centered = (timeArray[i] - 128) / 128; // normalize to -1..1
            sumSquares += centered * centered;
          }
          const rms = Math.sqrt(sumSquares / timeArray.length);
          const normalizedVolume = Math.max(0, Math.min(1, rms));

          // Determine if talking based on volume threshold
          const isTalking = normalizedVolume > 0.02; // Adjust sensitivity

          // Determine mood based on volume intensity
          let newMood = "idle";
          if (normalizedVolume > 0.4) {
            newMood = "angry"; // Loud voice
          } else if (normalizedVolume > 0.15 && isTalking) {
            newMood = "excited"; // Moderate voice
          } else if (isTalking) {
            newMood = "talking"; // Soft voice
          }

          setVoiceState({
            talking: isTalking,
            volume: normalizedVolume,
            mood: newMood,
          });

          animationFrame = requestAnimationFrame(detectSpeech);
        };

        detectSpeech();
      })
      .catch((error) => {
        console.error("", error);
        setWsMsg("Microphone access denied");
        setVoiceEnabled(false);
      });

    // Cleanup
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (audioContext) {
        audioContext.close();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [voiceEnabled]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3334");

    ws.onopen = () => {
      setConnected(true);
      setWsMsg("Shadow Avatar Online");
    };

    ws.onmessage = (e) => {
      setWsMsg(e.data);
    };

    ws.onerror = () => {
      setConnected(false);
      setWsMsg("Connection error");
    };

    ws.onclose = () => {
      setConnected(false);
      setWsMsg("Disconnected");
    };

    return () => ws.close();
  }, []);

  const transcript: string | undefined = (
    voiceState as unknown as { transcript?: string }
  )?.transcript;
  useEffect(() => {
    if (voiceEnabled && transcript) {
      llm.sendToLLM(transcript).then((reply) => {
        setWsMsg(reply);
      });
    }
  }, [voiceEnabled, transcript, llm]);

  return (
    <div className="min-h-screen bg-corporate-charcoal text-corporate-silver relative">
      <Canvas>
        <ShadowSubtitle />
        <PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={40} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 4, 5]} intensity={2} />
        <directionalLight
          position={[-2, 2, -5]}
          intensity={1}
          color="#0080ff"
        />
        <pointLight position={[0, 2, 0]} intensity={1} color="#00ffff" />

        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />

        <Suspense fallback={null}>
          <ShadowAvatar
            message={wsMsg}
            voiceState={voiceEnabled ? voiceState : null}
          />
        </Suspense>

        <gridHelper
          args={[10, 10, "#00ffff", "#003"]}
          position={[0, -1.5, 0]}
        />
      </Canvas>

      <div className="absolute top-5 left-5 bg-black/80 p-5 rounded-xl border border-corporate-steel shadow-2xl panel">
        <h1 className="text-2xl font-heading font-bold text-corporate-gold mb-2 glow-text">
          SHADOW AVATAR
        </h1>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={connected ? "status-dot-online" : "status-dot-offline"}
          ></span>
          <span
            className={
              connected ? "text-green-400 font-bold" : "text-red-400 font-bold"
            }
          >
            {connected ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
        <p className="text-sm mb-1">{wsMsg}</p>
        <p className="text-xs text-corporate-silver">
          WebSocket: ws://localhost:3334
        </p>
        <div className="mt-3">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={
              voiceEnabled
                ? "px-4 py-2 rounded-md bg-green-400 text-corporate-navy font-bold text-sm"
                : "px-4 py-2 rounded-md bg-corporate-steel text-white font-bold text-sm"
            }
          >
            {voiceEnabled ? "Voice Active" : "Enable Voice"}
          </button>
        </div>
        {voiceEnabled && (
          <div className="mt-2 text-xs text-corporate-silver">
            <div>Mood: {voiceState.mood}</div>
            <div>Volume: {(voiceState.volume * 100).toFixed(0)}%</div>
            <div>Talking: {voiceState.talking ? "YES" : "NO"}</div>
          </div>
        )}
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-3 rounded-lg border border-corporate-steel text-sm hint-bar">
        Drag to rotate • Scroll to zoom • Double-click to reset
      </div>
    </div>
  );
}

