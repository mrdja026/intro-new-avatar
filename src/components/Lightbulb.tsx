import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type LightbulbProps = {
  seed: number;
  origin: THREE.Vector3;
  radius?: number;
  height?: number;
};

export function Lightbulb({ seed, origin, radius = 0.35, height = 0.75 }: LightbulbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0xfff4c3,
    emissive: new THREE.Color('#fff4c3'),
    emissiveIntensity: 1.6,
    roughness: 0.25,
  }), []);
  const baseMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x2c2f3c, roughness: 0.4, metalness: 0.4 }), []);
  const ideaColor = useMemo(() => new THREE.Color().setHSL(0.1 + (seed % 5) * 0.04, 0.6, 0.6), [seed]);

  useEffect(() => {
    glowMaterial.color.copy(ideaColor);
    glowMaterial.emissive.copy(ideaColor);
  }, [glowMaterial, ideaColor]);

  useEffect(() => () => {
    glowMaterial.dispose();
    baseMaterial.dispose();
  }, [glowMaterial, baseMaterial]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + seed * 0.5;
    const group = groupRef.current;
    if (!group) return;
    const angle = t * 0.7 + seed;
    const up = Math.sin(t * 2.4) * 0.12;
    const x = origin.x + Math.cos(angle) * radius;
    const z = origin.z + Math.sin(angle) * radius;
    const y = origin.y + height + Math.sin(t * 1.6 + seed) * 0.1 + up;
    group.position.set(x, y, z);
    group.rotation.y = angle;
  });

  return (
    <group ref={groupRef}>
      <pointLight intensity={0.65} distance={2.6} color={ideaColor} />
      <mesh material={glowMaterial}>
        <sphereGeometry args={[0.18, 18, 18]} />
      </mesh>
      <mesh position={[0, -0.22, 0]} material={baseMaterial}>
        <cylinderGeometry args={[0.08, 0.12, 0.2, 12]} />
      </mesh>
      <mesh position={[0, -0.33, 0]} material={baseMaterial}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 12]} />
      </mesh>
    </group>
  );
}
