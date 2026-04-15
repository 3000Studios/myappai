import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import './ThreeDAvatar.css'

// Avatar Mesh Component
function AvatarMesh({ isSpeaking, mood, expression }) {
  const meshRef = useRef()
  const headRef = useRef()
  const eyeLeftRef = useRef()
  const eyeRightRef = useRef()
  const mouthRef = useRef()

  const [blinkTimer, setBlinkTimer] = useState(0)
  const [mouthOpen, setMouthOpen] = useState(0)

  // Blinking animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const shouldBlink = Math.sin(time * 3) > 0.95

    if (eyeLeftRef.current && eyeRightRef.current) {
      const scaleY = shouldBlink ? 0.1 : 1
      eyeLeftRef.current.scale.y = THREE.MathUtils.lerp(
        eyeLeftRef.current.scale.y,
        scaleY,
        0.3
      )
      eyeRightRef.current.scale.y = THREE.MathUtils.lerp(
        eyeRightRef.current.scale.y,
        scaleY,
        0.3
      )
    }

    // Head movement based on mood
    if (headRef.current) {
      const headY = mood === 'excited' ? Math.sin(time * 2) * 0.1 : 0
      const headX = mood === 'thinking' ? Math.sin(time * 1) * 0.05 : 0
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        headX,
        0.1
      )
      headRef.current.position.y = THREE.MathUtils.lerp(
        headRef.current.position.y,
        headY,
        0.1
      )
    }

    // Mouth animation when speaking
    if (mouthRef.current && isSpeaking) {
      const targetOpen = Math.sin(time * 10) * 0.3 + 0.2
      setMouthOpen(THREE.MathUtils.lerp(mouthOpen, targetOpen, 0.3))
    } else {
      setMouthOpen(THREE.MathUtils.lerp(mouthOpen, 0, 0.1))
    }

    if (mouthRef.current) {
      mouthRef.current.scale.y = mouthOpen
    }

    // Subtle floating animation
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.05
    }
  })

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Head */}
      <group ref={headRef}>
        {/* Main head sphere */}
        <Sphere ref={headRef} args={[1, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#fdbcb4"
            roughness={0.8}
            metalness={0.1}
          />
        </Sphere>

        {/* Hair */}
        <Box args={[2.2, 0.8, 2]} position={[0, 0.8, 0]}>
          <meshStandardMaterial
            color="#4a3c28"
            roughness={0.9}
            metalness={0.1}
          />
        </Box>

        {/* Eyes */}
        <Sphere
          ref={eyeLeftRef}
          args={[0.15, 16, 16]}
          position={[-0.3, 0.1, 0.8]}
        >
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
        <Sphere
          ref={eyeRightRef}
          args={[0.15, 16, 16]}
          position={[0.3, 0.1, 0.8]}
        >
          <meshStandardMaterial color="#ffffff" />
        </Sphere>

        {/* Pupils */}
        <Sphere args={[0.08, 16, 16]} position={[-0.3, 0.1, 0.9]}>
          <meshStandardMaterial color="#4a90e2" />
        </Sphere>
        <Sphere args={[0.08, 16, 16]} position={[0.3, 0.1, 0.9]}>
          <meshStandardMaterial color="#4a90e2" />
        </Sphere>

        {/* Eyebrows */}
        <Box args={[0.4, 0.05, 0.1]} position={[-0.3, 0.35, 0.8]}>
          <meshStandardMaterial color="#3a2818" />
        </Box>
        <Box args={[0.4, 0.05, 0.1]} position={[0.3, 0.35, 0.8]}>
          <meshStandardMaterial color="#3a2818" />
        </Box>

        {/* Nose */}
        <Box args={[0.15, 0.3, 0.15]} position={[0, -0.1, 0.7]}>
          <meshStandardMaterial
            color="#f4a460"
            roughness={0.8}
            metalness={0.1}
          />
        </Box>

        {/* Mouth */}
        <Box ref={mouthRef} args={[0.6, 0.1, 0.2]} position={[0, -0.4, 0.6]}>
          <meshStandardMaterial color="#d2691e" />
        </Box>
      </group>

      {/* Neck */}
      <Cylinder args={[0.4, 0.5, 0.8, 16]} position={[0, -1.2, 0]}>
        <meshStandardMaterial color="#fdbcb4" roughness={0.8} metalness={0.1} />
      </Cylinder>

      {/* Shoulders */}
      <Box args={[2, 0.5, 1]} position={[0, -1.8, 0]}>
        <meshStandardMaterial color="#4a90e2" roughness={0.8} metalness={0.2} />
      </Box>
    </group>
  )
}

// Cylinder helper component
function Cylinder(props) {
  return (
    <mesh {...props}>
      <cylinderGeometry args={props.args} />
      <meshStandardMaterial {...props.material} />
    </mesh>
  )
}

function ThreeDAvatar({ isSpeaking, mood = 'neutral', expression = 'happy' }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (error) {
    return (
      <div className="avatar-error">
        <div className="avatar-fallback">
          <div className="avatar-icon">🦞</div>
          <div className="avatar-status">AI Assistant</div>
        </div>
      </div>
    )
  }

  return (
    <div className="three-d-avatar">
      {isLoading ? (
        <div className="avatar-loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Avatar...</div>
        </div>
      ) : (
        <div className="avatar-canvas">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <directionalLight position={[-10, -10, -5]} intensity={0.3} />
            <pointLight position={[0, 5, 0]} intensity={0.5} />

            <AvatarMesh
              isSpeaking={isSpeaking}
              mood={mood}
              expression={expression}
            />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
              minPolarAngle={Math.PI * 0.4}
              maxPolarAngle={Math.PI * 0.6}
            />
          </Canvas>
        </div>
      )}

      <div className="avatar-info">
        <div className="avatar-name">ClawedBot</div>
        <div className={`avatar-status ${mood}`}>{mood}</div>
      </div>
    </div>
  )
}

export default ThreeDAvatar
