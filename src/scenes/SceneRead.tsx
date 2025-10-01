import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { VoxelPerson } from '../components/VoxelPerson';

function AuraParticle({ seed }: { seed: number }) {
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

export function SceneRead() {
  const { camera } = useThree();
  const desiredCamera = useRef(new THREE.Vector3(-2.4, 1.95, 4.1));
  const lookTarget = useRef(new THREE.Vector3(0, 1.05, 0.2));

  useEffect(() => {
    camera.position.copy(desiredCamera.current);
    camera.lookAt(lookTarget.current);
  }, [camera]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    desiredCamera.current.set(
      -2.3 + Math.sin(t * 0.17) * 0.42,
      1.95 + Math.sin(t * 0.2) * 0.14,
      4 + Math.cos(t * 0.16) * 0.32,
    );
    camera.position.lerp(desiredCamera.current, 0.05);

    lookTarget.current.set(
      0.1 + Math.sin(t * 0.14) * 0.1,
      1.05 + Math.sin(t * 0.21) * 0.08,
      0.2 + Math.cos(t * 0.18) * 0.08,
    );
    camera.lookAt(lookTarget.current);
  });

  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf7e5d4, roughness: 0.7, metalness: 0.1 }), []);
  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf3ded0, roughness: 0.85, metalness: 0.05 }), []);
  const ceilingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xfff7ed, roughness: 0.95, metalness: 0 }), []);
  const trimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xe2c6b8, roughness: 0.7, metalness: 0.08 }), []);
  const rugMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xe5caff, roughness: 0.92 }), []);
  const windowFrameMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xeedbd0, roughness: 0.45, metalness: 0.18 }), []);
  const windowGlowMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xfff2de,
      emissive: new THREE.Color('#ffd5a6'),
      emissiveIntensity: 1,
      roughness: 0.38,
    });
    mat.transparent = true;
    mat.opacity = 0.8;
    return mat;
  }, []);
  const nightstandMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xdcb9a8, roughness: 0.65, metalness: 0.18 }), []);
  const lampBaseMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xb08c76, roughness: 0.5, metalness: 0.28 }), []);
  const lampShadeMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xfff1d2,
      emissive: new THREE.Color('#ffe7ad'),
      emissiveIntensity: 1.15,
      roughness: 0.4,
    });
    mat.transparent = true;
    mat.opacity = 0.78;
    return mat;
  }, []);
  const plantPotMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xdab8a2, roughness: 0.6, metalness: 0.18 }), []);
  const plantLeafMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x9fcf8a, roughness: 0.35, metalness: 0.05 }), []);
  const pillowMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xefe5ff, roughness: 0.4 }), []);
  const mattressMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xe2d5fb, roughness: 0.7 }), []);
  const bedMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xcabdf4, roughness: 0.55, metalness: 0.12 }), []);
  const blanketMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf3cce0, roughness: 0.5, metalness: 0.1 }), []);
  const tabletMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1b2338,
      emissive: new THREE.Color('#9de7ff'),
      emissiveIntensity: 2.2,
      roughness: 0.22,
      metalness: 0.18,
    });
    return mat;
  }, []);

  useEffect(() => {
    return () => {
      wallMaterial.dispose();
      floorMaterial.dispose();
      ceilingMaterial.dispose();
      trimMaterial.dispose();
      rugMaterial.dispose();
      windowFrameMaterial.dispose();
      windowGlowMaterial.dispose();
      nightstandMaterial.dispose();
      lampBaseMaterial.dispose();
      lampShadeMaterial.dispose();
      plantPotMaterial.dispose();
      plantLeafMaterial.dispose();
      pillowMaterial.dispose();
      mattressMaterial.dispose();
      bedMaterial.dispose();
      blanketMaterial.dispose();
      tabletMaterial.dispose();
    };
  }, [
    wallMaterial,
    floorMaterial,
    ceilingMaterial,
    trimMaterial,
    rugMaterial,
    windowFrameMaterial,
    windowGlowMaterial,
    nightstandMaterial,
    lampBaseMaterial,
    lampShadeMaterial,
    plantPotMaterial,
    plantLeafMaterial,
    pillowMaterial,
    mattressMaterial,
    bedMaterial,
    blanketMaterial,
    tabletMaterial,
  ]);

  const pillowPositions: [number, number, number][] = [
    [-0.6, 0.9, 0],
    [0.6, 0.9, 0],
  ];

  return (
    <group>
      <color attach="background" args={['#1a1115']} />
      <hemisphereLight args={['#ffe5cc', '#7d5c5c', 0.5]} />
      <ambientLight intensity={0.5} color={0xffeedf} />
      <directionalLight position={[-2.6, 3.8, 1.6]} intensity={0.92} color={0xffe4c2} castShadow />
      <spotLight position={[1.4, 3.1, 2.4]} intensity={0.88} angle={0.55} penumbra={0.6} color={0xfbd5b4} castShadow />
      <pointLight position={[0.6, 2.3, -1.1]} intensity={0.48} color={0xf0b9a2} distance={7} />

      <group>
        <mesh position={[0, 2.5, -3.1]} material={wallMaterial} receiveShadow>
          <planeGeometry args={[10, 5]} />
        </mesh>
        <mesh position={[5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial} receiveShadow>
          <planeGeometry args={[6, 5]} />
        </mesh>
        <mesh position={[0, 2.5, 1.8]} rotation={[0, Math.PI, 0]} material={wallMaterial} receiveShadow>
          <planeGeometry args={[10, 5]} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMaterial} receiveShadow>
          <planeGeometry args={[15, 12]} />
        </mesh>
        <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]} material={ceilingMaterial}>
          <planeGeometry args={[15, 12]} />
        </mesh>
        <mesh position={[0, 0.6, -3.09]} material={trimMaterial}>
          <boxGeometry args={[10, 0.2, 0.2]} />
        </mesh>
        <mesh position={[0, 0.6, 1.79]} material={trimMaterial}>
          <boxGeometry args={[10, 0.2, 0.2]} />
        </mesh>
        <mesh position={[0, 3.45, -3.08]} material={trimMaterial}>
          <boxGeometry args={[10, 0.15, 0.2]} />
        </mesh>
        <mesh position={[1.8, 1.8, -3.05]} material={windowFrameMaterial}>
          <boxGeometry args={[2.8, 2, 0.2]} />
        </mesh>
        <mesh position={[1.8, 1.8, -3.02]} material={windowGlowMaterial}>
          <boxGeometry args={[2.4, 1.6, 0.06]} />
        </mesh>
        <mesh position={[-1.6, 1.9, -3.04]} material={trimMaterial}>
          <boxGeometry args={[1.4, 1.05, 0.06]} />
        </mesh>
        <mesh position={[1.2, 0.02, 0.6]} rotation={[-Math.PI / 2, 0, 0]} material={rugMaterial} receiveShadow>
          <circleGeometry args={[1.9, 36]} />
        </mesh>
      </group>

      <group position={[-1.45, 0.55, 1.05]}>
        <mesh material={nightstandMaterial} castShadow>
          <boxGeometry args={[0.7, 0.56, 0.6]} />
        </mesh>
        <mesh position={[0, 0.45, 0]} material={nightstandMaterial} castShadow>
          <boxGeometry args={[0.7, 0.12, 0.6]} />
        </mesh>
        <mesh position={[0, 0.76, 0]} material={lampBaseMaterial} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.42, 12]} />
        </mesh>
        <mesh position={[0, 1.05, 0]} material={lampShadeMaterial} castShadow>
          <cylinderGeometry args={[0.28, 0.2, 0.32, 18]} />
        </mesh>
      </group>

      <group position={[2.1, 0.2, -0.4]}>
        <mesh material={plantPotMaterial} castShadow>
          <cylinderGeometry args={[0.28, 0.32, 0.33, 14]} />
        </mesh>
        <mesh position={[0, 0.42, 0]} material={plantLeafMaterial} castShadow>
          <coneGeometry args={[0.55, 0.9, 6]} />
        </mesh>
      </group>

      <group>
        <mesh position={[0, 0.45, 0]} material={bedMaterial} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.45, 2.1]} />
        </mesh>
        <mesh position={[0, 0.85, 0]} material={mattressMaterial} castShadow receiveShadow>
          <boxGeometry args={[3.25, 0.35, 1.95]} />
        </mesh>
        <mesh position={[0, 1.05, 0.7]} material={blanketMaterial} castShadow>
          <boxGeometry args={[3, 0.18, 1.2]} />
        </mesh>
        {pillowPositions.map(([px, py, pz]) => (
          <mesh key={`pillow-${px}-${pz}`} position={[px, py, pz]} material={pillowMaterial} castShadow>
            <boxGeometry args={[0.95, 0.25, 0.78]} />
          </mesh>
        ))}
      </group>

      <group position={[0.25, 1.12, 0.36]} rotation={[-0.2, Math.PI / 2, 0.15]}>
        <mesh material={tabletMaterial} castShadow>
          <boxGeometry args={[0.7, 0.05, 0.45]} />
        </mesh>
        <group position={[0, 0.06, 0]}>
          <AuraParticle seed={0} />
          <AuraParticle seed={1} />
          <AuraParticle seed={2} />
        </group>
      </group>

      <VoxelPerson
        pose="reading"
        scale={0.95}
        position={[0.1, 1.08, 0.2]}
        rotation={[-Math.PI / 2.1, Math.PI / 2, 0.22]}
        color="#8fb4ff"
      />
    </group>
  );
}
