'use client';

import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { ProceduralCar } from '@/components/ProceduralCar';
import type { Car } from '@/lib/cars';

type HeroCanvasProps = {
  accent: string;
  reducedMotion: boolean;
  silhouette: Car['silhouette'];
};

export function HeroCanvas({ accent, reducedMotion, silhouette }: HeroCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 34, position: [5.2, 2.8, 6.2], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.25} />
        <hemisphereLight args={['#ffffff', '#10131a', 1.4]} />
        <directionalLight position={[4, 7, 6]} intensity={3.2} />
        <spotLight position={[-6, 5, -4]} intensity={2.4} angle={0.5} penumbra={0.9} color={accent} />
        <ProceduralCar accent={accent} autoRotate={!reducedMotion} silhouette={silhouette} />
        <ContactShadows position={[0, -0.56, 0]} opacity={0.48} scale={8} blur={2.8} far={5} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3.1}
          maxPolarAngle={Math.PI / 2.15}
          minAzimuthAngle={-Math.PI / 2.4}
          maxAzimuthAngle={Math.PI / 2.4}
        />
      </Suspense>
    </Canvas>
  );
}
