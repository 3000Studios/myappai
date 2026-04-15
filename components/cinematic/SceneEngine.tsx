import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment } from '@react-three/drei';

export default function SceneEngine() {
  return (
    <Canvas shadows camera={{ position: [3, 2, 5], fov: 45 }}>
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

