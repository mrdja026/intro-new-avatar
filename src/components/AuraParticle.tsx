import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type AuraParticleProps = {
  seed: number;
};

export function AuraParticle({ seed }: AuraParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new THREE.Color('#ffe6a8'),
      emissiveIntensity: 1.4,
      roughness: 0.6,
      metalness: 0,
    });
    mat.transparent = true;
    mat.opacity = 0.55;
    mat.depthWrite = false;
    return mat;
  }, []);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.getElapsedTime() + seed * 0.3;
    const radius = 0.22 + 0.04 * seed;
    mesh.position.set(Math.cos(t * 1.2) * radius, 0.12 + Math.sin(t * 1.8) * 0.06, Math.sin(t * 1.2) * radius);
    material.opacity = 0.45 + Math.sin(t * 2.4) * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[0.14, 0.14]} />
      <primitive object={material} />
    </mesh>
  );
}
