import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

export type VoxelPersonPose = 'sleeping' | 'reading' | 'typing';

export type VoxelPersonProps = {
  pose: VoxelPersonPose;
  scale?: number;
  color?: string;
} & ThreeElements['group'];

type PoseConfig = {
  torsoRotation: [number, number, number];
  headRotation: [number, number, number];
  leftArmRotation: [number, number, number];
  rightArmRotation: [number, number, number];
  leftLegRotation: [number, number, number];
  rightLegRotation: [number, number, number];
  leftArmPosition?: [number, number, number];
  rightArmPosition?: [number, number, number];
};

const TORSO = { width: 0.6, height: 0.9, depth: 0.35 } as const;
const LEG = { length: 0.65, thickness: 0.22 } as const;
const ARM = { length: 0.6, thickness: 0.18 } as const;
const HEAD = { size: 0.45 } as const;

const HALF_PI = Math.PI / 2;

const poseConfigMap: Record<VoxelPersonPose, PoseConfig> = {
  sleeping: {
    torsoRotation: [0, 0, 0],
    headRotation: [-0.25, 0.1, 0],
    leftArmRotation: [HALF_PI * 0.9, 0.2, -0.2],
    rightArmRotation: [HALF_PI * 0.75, -0.15, 0.25],
    leftLegRotation: [HALF_PI * 0.9, 0, 0.18],
    rightLegRotation: [HALF_PI * 0.7, 0, -0.12],
    leftArmPosition: [-TORSO.width * 0.45, LEG.length + TORSO.height - 0.05, 0.25],
    rightArmPosition: [TORSO.width * 0.45, LEG.length + TORSO.height - 0.05, 0.15],
  },
  reading: {
    torsoRotation: [0.2, 0, 0],
    headRotation: [-0.15, 0.12, 0],
    leftArmRotation: [-0.6, 0.5, -0.2],
    rightArmRotation: [-0.5, -0.6, 0.35],
    leftLegRotation: [0.4, 0.15, 0],
    rightLegRotation: [0.2, -0.2, 0],
    leftArmPosition: [-TORSO.width * 0.45, LEG.length + TORSO.height - 0.05, 0.1],
    rightArmPosition: [TORSO.width * 0.45, LEG.length + TORSO.height - 0.05, 0.1],
  },
  typing: {
    torsoRotation: [0.1, 0, 0],
    headRotation: [-0.05, 0.05, 0],
    leftArmRotation: [-0.9, 0.35, -0.2],
    rightArmRotation: [-0.85, -0.32, 0.25],
    leftLegRotation: [0.1, 0.2, 0],
    rightLegRotation: [0.05, -0.15, 0],
    leftArmPosition: [-TORSO.width * 0.45, LEG.length + TORSO.height - 0.08, 0.08],
    rightArmPosition: [TORSO.width * 0.45, LEG.length + TORSO.height - 0.08, 0.08],
  },
};

export function VoxelPerson({ pose, scale = 1, color = '#8fb4ff', ...rest }: VoxelPersonProps) {
  const config = useMemo<PoseConfig>(() => poseConfigMap[pose], [pose]);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  useEffect(() => {
    leftArmRef.current?.rotation.set(...config.leftArmRotation);
    rightArmRef.current?.rotation.set(...config.rightArmRotation);
    torsoRef.current?.rotation.set(...config.torsoRotation);
  }, [config]);

  useFrame((state) => {
    if (pose === 'typing') {
      const t = state.clock.getElapsedTime();
      const leftX = config.leftArmRotation[0] + Math.sin(t * 8) * 0.08;
      const leftZ = config.leftArmRotation[2] + Math.sin(t * 6) * 0.05;
      const rightX = config.rightArmRotation[0] + Math.sin(t * 8 + 0.6) * 0.07;
      const rightZ = config.rightArmRotation[2] + Math.sin(t * 6 + 0.4) * 0.04;

      leftArmRef.current?.rotation.set(leftX, config.leftArmRotation[1], leftZ);
      rightArmRef.current?.rotation.set(rightX, config.rightArmRotation[1], rightZ);
    }
  });

  const limbMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({ color });
    material.metalness = 0.2;
    material.roughness = 0.6;
    return material;
  }, [color]);

  const accentMaterial = useMemo(() => {
    const accentColor = new THREE.Color(color);
    accentColor.offsetHSL(0, 0, 0.15);
    const material = new THREE.MeshStandardMaterial({ color: accentColor });
    material.metalness = 0.25;
    material.roughness = 0.5;
    return material;
  }, [color]);

  useEffect(() => {
    return () => {
      limbMaterial.dispose();
      accentMaterial.dispose();
    };
  }, [limbMaterial, accentMaterial]);

  return (
    <group scale={scale} {...rest}>
      <group position={[-TORSO.width * 0.25, LEG.length, 0]} rotation={config.leftLegRotation}>
        <mesh position={[0, -LEG.length / 2, 0]} material={limbMaterial}>
          <boxGeometry args={[LEG.thickness, LEG.length, LEG.thickness]} />
        </mesh>
      </group>
      <group position={[TORSO.width * 0.25, LEG.length, 0]} rotation={config.rightLegRotation}>
        <mesh position={[0, -LEG.length / 2, 0]} material={limbMaterial}>
          <boxGeometry args={[LEG.thickness, LEG.length, LEG.thickness]} />
        </mesh>
      </group>

      <group ref={torsoRef} position={[0, LEG.length, 0]}>
        <mesh position={[0, TORSO.height / 2, 0]} material={limbMaterial}>
          <boxGeometry args={[TORSO.width, TORSO.height, TORSO.depth]} />
        </mesh>
      </group>

      <group position={[0, LEG.length + TORSO.height, 0]} rotation={config.headRotation}>
        <mesh position={[0, HEAD.size / 2 + 0.02, 0]} material={accentMaterial}>
          <boxGeometry args={[HEAD.size, HEAD.size, HEAD.size]} />
        </mesh>
      </group>

      <group
        ref={leftArmRef}
        position={config.leftArmPosition ?? [-TORSO.width * 0.5, LEG.length + TORSO.height - 0.1, 0]}
      >
        <mesh position={[0, -ARM.length / 2, 0]} material={limbMaterial}>
          <boxGeometry args={[ARM.thickness, ARM.length, ARM.thickness]} />
        </mesh>
      </group>
      <group
        ref={rightArmRef}
        position={config.rightArmPosition ?? [TORSO.width * 0.5, LEG.length + TORSO.height - 0.1, 0]}
      >
        <mesh position={[0, -ARM.length / 2, 0]} material={limbMaterial}>
          <boxGeometry args={[ARM.thickness, ARM.length, ARM.thickness]} />
        </mesh>
      </group>
    </group>
  );
}
