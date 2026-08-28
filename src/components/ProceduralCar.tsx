'use client';

import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type * as THREE from 'three';
import type { Car } from '@/lib/cars';

type ProceduralCarProps = {
  accent: string;
  autoRotate: boolean;
  silhouette: Car['silhouette'];
};

type Profile = {
  body: [number, number, number];
  cabin: [number, number, number];
  cabinPosition: [number, number, number];
  wheelX: number;
  wheelZ: number;
  wheelRadius: number;
  stanceY: number;
};

const profiles: Record<Car['silhouette'], Profile> = {
  sports: {
    body: [3.35, 0.5, 1.34],
    cabin: [1.35, 0.48, 1.08],
    cabinPosition: [0.18, 0.48, 0],
    wheelX: 1.15,
    wheelZ: 0.72,
    wheelRadius: 0.42,
    stanceY: -0.42
  },
  coupe: {
    body: [3.45, 0.64, 1.4],
    cabin: [1.55, 0.58, 1.12],
    cabinPosition: [0.22, 0.56, 0],
    wheelX: 1.18,
    wheelZ: 0.75,
    wheelRadius: 0.43,
    stanceY: -0.43
  },
  sedan: {
    body: [3.55, 0.67, 1.42],
    cabin: [1.95, 0.66, 1.17],
    cabinPosition: [0.05, 0.61, 0],
    wheelX: 1.22,
    wheelZ: 0.76,
    wheelRadius: 0.42,
    stanceY: -0.44
  },
  crossover: {
    body: [3.55, 0.82, 1.5],
    cabin: [2.08, 0.8, 1.28],
    cabinPosition: [0.02, 0.75, 0],
    wheelX: 1.22,
    wheelZ: 0.81,
    wheelRadius: 0.47,
    stanceY: -0.48
  },
  suv: {
    body: [3.65, 0.96, 1.58],
    cabin: [2.18, 1.0, 1.36],
    cabinPosition: [0.0, 0.9, 0],
    wheelX: 1.25,
    wheelZ: 0.86,
    wheelRadius: 0.5,
    stanceY: -0.51
  }
};

export function ProceduralCar({ accent, autoRotate, silhouette }: ProceduralCarProps) {
  const group = useRef<THREE.Group>(null);
  const profile = profiles[silhouette];
  const wheelPositions: Array<[number, number, number]> = [
    [-profile.wheelX, profile.stanceY, profile.wheelZ],
    [-profile.wheelX, profile.stanceY, -profile.wheelZ],
    [profile.wheelX, profile.stanceY, profile.wheelZ],
    [profile.wheelX, profile.stanceY, -profile.wheelZ]
  ];

  useFrame((_state, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={group} rotation={[0.04, -0.58, 0]} position={[0, 0.18, 0]}>
      <RoundedBox args={profile.body} radius={0.28} smoothness={8} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color={accent}
          metalness={0.78}
          roughness={0.22}
          clearcoat={1}
        />
      </RoundedBox>
      <RoundedBox
        args={profile.cabin}
        radius={0.24}
        smoothness={8}
        position={profile.cabinPosition}
      >
        <meshPhysicalMaterial
          color="#11151d"
          metalness={0.4}
          roughness={0.13}
          transmission={0.12}
        />
      </RoundedBox>
      <RoundedBox
        args={[0.9, 0.12, profile.body[2] * 0.84]}
        radius={0.08}
        smoothness={4}
        position={[-profile.body[0] / 2 + 0.25, 0.12, 0]}
      >
        <meshPhysicalMaterial
          color={accent}
          metalness={0.78}
          roughness={0.22}
          clearcoat={1}
        />
      </RoundedBox>
      <mesh position={[-profile.body[0] / 2 - 0.01, 0.03, 0]}>
        <boxGeometry args={[0.05, 0.18, profile.body[2] * 0.66]} />
        <meshStandardMaterial color="#f5f7ff" emissive="#d8e8ff" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[profile.body[0] / 2 + 0.01, 0.05, 0]}>
        <boxGeometry args={[0.04, 0.18, profile.body[2] * 0.68]} />
        <meshStandardMaterial color="#ff4d3d" emissive="#ff321f" emissiveIntensity={1.5} />
      </mesh>
      {wheelPositions.map((position) => (
        <group key={position.join(':')} position={position} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[profile.wheelRadius, profile.wheelRadius, 0.28, 32]} />
            <meshStandardMaterial color="#08090c" roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry
              args={[profile.wheelRadius * 0.55, profile.wheelRadius * 0.55, 0.01, 16]}
            />
            <meshStandardMaterial color="#9da5af" metalness={0.9} roughness={0.22} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
