import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { VoxelPerson } from '../components/VoxelPerson';
import { createRandom } from '../utils/random';

type TextMesh = THREE.Mesh & { material: THREE.Material | THREE.Material[] };

type FloatingZProps = {
  seed: number;
  origin: [number, number, number];
};

function FloatingZ({ seed, origin }: FloatingZProps) {
  const textRef = useRef<TextMesh | null>(null);

  const assignRef = useCallback((mesh: THREE.Object3D | null) => {
    textRef.current = (mesh as TextMesh | null) ?? null;
  }, []);

  const config = useMemo(() => {
    const rand = createRandom(seed);
    return {
      fontSize: 0.22 + rand() * 0.06,
      cycle: 1.4 + rand() * 0.5,
      sway: 0.12 + rand() * 0.05,
      drift: 0.09 + rand() * 0.04,
      phase: rand() * Math.PI * 2,
    };
  }, [seed]);

  useEffect(() => {
    const mat = textRef.current?.material;
    if (!mat) return;
    if (Array.isArray(mat)) {
      mat.forEach((m) => {
        m.transparent = true;
        m.depthWrite = false;
      });
      return;
    }
    mat.transparent = true;
    mat.depthWrite = false;
  }, []);

  useFrame((state) => {
    const mesh = textRef.current;
    if (!mesh) return;
    const elapsed = (state.clock.getElapsedTime() + seed * 0.17) % config.cycle;
    const progress = elapsed / config.cycle;
    const y = origin[1] + progress * 1.2;
    const x = origin[0] + Math.sin(progress * Math.PI * 2 + config.phase) * config.sway;
    const z = origin[2] + Math.cos(progress * Math.PI * 2 + config.phase) * config.drift;
    mesh.position.set(x, y, z);
    const opacity = Math.max(0, Math.pow(1 - progress, 1.2));
    const mat = mesh.material;
    if (Array.isArray(mat)) {
      mat.forEach((m) => (m.opacity = opacity));
    } else {
      mat.opacity = opacity;
    }
  });

  return (
    <Text
      ref={assignRef}
      position={origin}
      fontSize={config.fontSize}
      anchorX="center"
      anchorY="middle"
      color="#dceaff"
    >
      Z
    </Text>
  );
}

export function SceneSleep() {
  const { camera } = useThree();
  const desiredCamera = useRef(new THREE.Vector3(2.6, 1.9, 4.2));
  const lookTarget = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    camera.position.copy(desiredCamera.current);
    camera.lookAt(lookTarget.current);
  }, [camera]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    desiredCamera.current.set(
      2.4 + Math.sin(t * 0.18) * 0.45,
      1.85 + Math.sin(t * 0.22) * 0.15,
      4.1 + Math.cos(t * 0.16) * 0.35,
    );
    camera.position.lerp(desiredCamera.current, 0.05);

    lookTarget.current.set(
      Math.sin(t * 0.12) * 0.2,
      1 + Math.sin(t * 0.2) * 0.06,
      0.08 + Math.cos(t * 0.14) * 0.08,
    );
    camera.lookAt(lookTarget.current);
  });

  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x101728, roughness: 0.85, metalness: 0.05 }), []);
  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x0b0f16, roughness: 0.92, metalness: 0.04 }), []);
  const rugMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x1c2436, roughness: 0.95 }), []);
  const windowFrameMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x1f2d45, roughness: 0.45, metalness: 0.18 }), []);
  const windowGlowMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0b1c36,
      emissive: new THREE.Color('#4a68b9'),
      emissiveIntensity: 1.1,
      roughness: 0.4,
    });
    mat.transparent = true;
    mat.opacity = 0.85;
    return mat;
  }, []);
  const nightstandMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x202b3f, roughness: 0.6, metalness: 0.18 }), []);
  const lampBaseMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x26324c, roughness: 0.4, metalness: 0.3 }), []);
  const lampShadeMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x5c73c3,
      emissive: new THREE.Color('#4d64ff'),
      emissiveIntensity: 0.7,
      roughness: 0.35,
    });
    mat.transparent = true;
    mat.opacity = 0.78;
    return mat;
  }, []);
  const plantPotMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x2a3348, roughness: 0.55, metalness: 0.15 }), []);
  const plantLeafMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x3d7862, roughness: 0.4, metalness: 0.05 }), []);

  useEffect(() => {
    return () => {
      wallMaterial.dispose();
      floorMaterial.dispose();
      rugMaterial.dispose();
      windowFrameMaterial.dispose();
      windowGlowMaterial.dispose();
      nightstandMaterial.dispose();
      lampBaseMaterial.dispose();
      lampShadeMaterial.dispose();
      plantPotMaterial.dispose();
      plantLeafMaterial.dispose();
    };
  }, [
    wallMaterial,
    floorMaterial,
    rugMaterial,
    windowFrameMaterial,
    windowGlowMaterial,
    nightstandMaterial,
    lampBaseMaterial,
    lampShadeMaterial,
    plantPotMaterial,
    plantLeafMaterial,
  ]);

  const bedMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x1e2538, roughness: 0.5, metalness: 0.1 }), []);
  const mattressMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x20304c, roughness: 0.7 }), []);
  const pillowMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x31436a, roughness: 0.4 }), []);

  useEffect(() => {
    return () => {
      bedMaterial.dispose();
      mattressMaterial.dispose();
      pillowMaterial.dispose();
    };
  }, [bedMaterial, mattressMaterial, pillowMaterial]);

  const pillowPositions: [number, number, number][] = [
    [-0.6, 0.82, 0],
    [0.6, 0.82, 0],
  ];

  const zOrigins: [number, number, number][] = [
    [-0.4, 1.55, 0.42],
    [-0.1, 1.65, 0.48],
    [0.2, 1.5, 0.38],
  ];

  return (
    <group>
      <color attach="background" args={['#050608']} />
      <ambientLight intensity={0.4} />
      <spotLight
        position={[0, 4.1, 2.2]}
        intensity={1.15}
        angle={0.6}
        penumbra={0.6}
        color={0x87a8ff}
        castShadow
      />
      <pointLight position={[-2.2, 1.6, 2.4]} intensity={0.55} color={0x314b7a} />
      <pointLight position={[-1.45, 1.25, 1.05]} intensity={0.9} color={0x708dff} distance={6} />

      <group>
        <mesh position={[0, 1.5, -2.8]} material={wallMaterial} receiveShadow>
          <planeGeometry args={[9, 5]} />
        </mesh>
        <mesh position={[-4.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial} receiveShadow>
          <planeGeometry args={[6, 5]} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMaterial} receiveShadow>
          <planeGeometry args={[15, 12]} />
        </mesh>
        <mesh position={[1.2, 0.01, 0.6]} rotation={[-Math.PI / 2, 0, 0]} material={rugMaterial} receiveShadow>
          <circleGeometry args={[1.6, 32]} />
        </mesh>
        <mesh position={[-1.4, 1.6, -2.79]} material={windowFrameMaterial}>
          <planeGeometry args={[2.5, 1.8]} />
        </mesh>
        <mesh position={[-1.4, 1.6, -2.78]} material={windowGlowMaterial}>
          <planeGeometry args={[2.2, 1.5]} />
        </mesh>
      </group>

      <group position={[-1.45, 0.45, 1.05]}>
        <mesh material={nightstandMaterial} castShadow>
          <boxGeometry args={[0.6, 0.5, 0.6]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} material={nightstandMaterial} castShadow>
          <boxGeometry args={[0.6, 0.12, 0.6]} />
        </mesh>
        <mesh position={[0, 0.65, 0]} material={lampBaseMaterial} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.4, 12]} />
        </mesh>
        <mesh position={[0, 0.95, 0]} material={lampShadeMaterial} castShadow>
          <cylinderGeometry args={[0.25, 0.18, 0.3, 16]} />
        </mesh>
      </group>

      <group position={[1.9, 0.18, -0.4]}>
        <mesh material={plantPotMaterial} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 0.28, 12]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} material={plantLeafMaterial} castShadow>
          <coneGeometry args={[0.5, 0.7, 5]} />
        </mesh>
      </group>

      <group>
        <mesh position={[0, 0.35, 0]} material={bedMaterial} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.4, 2]} />
        </mesh>
        <mesh position={[0, 0.7, 0]} material={mattressMaterial} castShadow receiveShadow>
          <boxGeometry args={[3.05, 0.3, 1.85]} />
        </mesh>
        {pillowPositions.map(([px, py, pz]) => (
          <mesh key={`pillow-${px}-${pz}`} position={[px, py, pz]} material={pillowMaterial} castShadow>
            <boxGeometry args={[0.9, 0.2, 0.75]} />
          </mesh>
        ))}
      </group>

      <VoxelPerson
        pose="sleeping"
        scale={0.95}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        position={[0, 1.05, 0.16]}
        color="#8fb4ff"
      />

      {zOrigins.map((origin, index) => (
        <FloatingZ key={`zzz-${index}`} seed={index + 1} origin={origin} />
      ))}
    </group>
  );
}
