import { forwardRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type SmoothPersonPose = 'typing';

export type SmoothPersonProps = {
  pose?: SmoothPersonPose;
  bodyColor?: string;
  accentColor?: string;
  headColor?: string;
};

export const SmoothPerson = forwardRef<THREE.Group, SmoothPersonProps>(
  ({ bodyColor = '#6fa8ff', accentColor = '#4d6dff', headColor = '#f5d7c4' }, ref) => {
    const limbMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.35,
      metalness: 0.15,
    }), [bodyColor]);

    const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.45,
      metalness: 0.2,
    }), [accentColor]);

    const headMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: headColor,
      roughness: 0.6,
      metalness: 0.05,
    }), [headColor]);

    const torsoMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: '#1f2c44',
      roughness: 0.38,
      metalness: 0.2,
    }), []);

    const leftArm = new THREE.Euler(-1.1, 0.32, -0.18);
    const rightArm = new THREE.Euler(-1.05, -0.28, 0.22);

    useFrame((state) => {
      const t = state.clock.getElapsedTime();
      const armOffset = Math.sin(t * 8) * 0.08;
      leftArm.x = -1.1 + armOffset;
      rightArm.x = -1.05 + Math.sin(t * 8 + 0.6) * 0.07;
    });

    return (
      <group ref={ref}>
        <group position={[0, 0.8, 0]}>
          <mesh material={torsoMaterial} position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.28, 0.33, 0.9, 16]} />
          </mesh>
          <mesh material={accentMaterial} position={[0, 0.95, 0]}>
            <torusGeometry args={[0.24, 0.05, 12, 30]} />
          </mesh>
        </group>

        <group position={[0, 1.45, 0]}>
          <mesh material={headMaterial}>
            <sphereGeometry args={[0.24, 24, 24]} />
          </mesh>
          <mesh position={[0, 0.25, -0.18]} material={headMaterial}>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
        </group>

        <group position={[-0.32, 1.0, 0]} rotation={leftArm}>
          <mesh material={limbMaterial}>
            <cylinderGeometry args={[0.1, 0.11, 0.72, 12]} />
          </mesh>
          <mesh position={[0, -0.4, 0]} material={limbMaterial}>
            <sphereGeometry args={[0.12, 16, 12]} />
          </mesh>
        </group>

        <group position={[0.32, 1.0, 0]} rotation={rightArm}>
          <mesh material={limbMaterial}>
            <cylinderGeometry args={[0.1, 0.11, 0.72, 12]} />
          </mesh>
          <mesh position={[0, -0.4, 0]} material={limbMaterial}>
            <sphereGeometry args={[0.12, 16, 12]} />
          </mesh>
        </group>

        <group position={[-0.18, 0.4, 0.05]} rotation={[0.2, 0, 0.05]}>
          <mesh material={limbMaterial}>
            <cylinderGeometry args={[0.12, 0.14, 0.8, 12]} />
          </mesh>
          <mesh position={[0, -0.4, 0]} material={limbMaterial}>
            <sphereGeometry args={[0.14, 16, 12]} />
          </mesh>
        </group>

        <group position={[0.18, 0.4, 0.05]} rotation={[0.2, 0, -0.05]}>
          <mesh material={limbMaterial}>
            <cylinderGeometry args={[0.12, 0.14, 0.8, 12]} />
          </mesh>
          <mesh position={[0, -0.4, 0]} material={limbMaterial}>
            <sphereGeometry args={[0.14, 16, 12]} />
          </mesh>
        </group>
      </group>
    );
  },
);

SmoothPerson.displayName = 'SmoothPerson';
