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

  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf7e5d4, roughness: 0.7, metalness: 0.1 }), []);
  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf3ded0, roughness: 0.85, metalness: 0.05 }), []);
  const ceilingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xfff7ed, roughness: 0.95, metalness: 0 }), []);
  const trimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xe2c6b8, roughness: 0.7, metalness: 0.08 }), []);
  const rugMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xe5caff, roughness: 0.92 }), []);
  const windowFrameMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xeedbd0, roughness: 0.45, metalness: 0.18 }), []);
  const windowGlowMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xfff2de,
      emissive: new THREE.Color('#ffd9a6'),
      emissiveIntensity: 1.2,
      roughness: 0.35,
    });
    mat.transparent = true;
    mat.opacity = 0.88;
    return mat;
  }, []);
  const artFrameMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xfff2e6, roughness: 0.9 }), []);
  const artAccentMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf28fb8, roughness: 0.84 }), []);
  const nightstandMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xdcb9a8, roughness: 0.65, metalness: 0.18 }), []);
  const lampBaseMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xb08c76, roughness: 0.5, metalness: 0.28 }), []);
  const lampShadeMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xfff1d2,
      emissive: new THREE.Color('#ffe3a8'),
      emissiveIntensity: 1.3,
      roughness: 0.4,
    });
    mat.transparent = true;
    mat.opacity = 0.82;
    return mat;
  }, []);
  const plantPotMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xdab8a2, roughness: 0.6, metalness: 0.18 }), []);
  const plantLeafMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x9fcf8a, roughness: 0.35, metalness: 0.05 }), []);

  useEffect(() => {
    return () => {
      wallMaterial.dispose();
      floorMaterial.dispose();
      ceilingMaterial.dispose();
      trimMaterial.dispose();
      rugMaterial.dispose();
      windowFrameMaterial.dispose();
      windowGlowMaterial.dispose();
      artFrameMaterial.dispose();
      artAccentMaterial.dispose();
      nightstandMaterial.dispose();
      lampBaseMaterial.dispose();
      lampShadeMaterial.dispose();
      plantPotMaterial.dispose();
      plantLeafMaterial.dispose();
    };
  }, [
    wallMaterial,
    floorMaterial,
    ceilingMaterial,
    trimMaterial,
    rugMaterial,
    windowFrameMaterial,
    windowGlowMaterial,
    artFrameMaterial,
    artAccentMaterial,
    nightstandMaterial,
    lampBaseMaterial,
    lampShadeMaterial,
    plantPotMaterial,
    plantLeafMaterial,
  ]);

  const bedMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xcabdf4, roughness: 0.55, metalness: 0.12 }), []);
  const mattressMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xe2d5fb, roughness: 0.7 }), []);
  const pillowMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xefe5ff, roughness: 0.4 }), []);
  const blanketMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf3cce0, roughness: 0.5, metalness: 0.1 }), []);

  useEffect(() => {
    return () => {
      bedMaterial.dispose();
      mattressMaterial.dispose();
      pillowMaterial.dispose();
      blanketMaterial.dispose();
    };
  }, [bedMaterial, mattressMaterial, pillowMaterial, blanketMaterial]);

  const pillowPositions: [number, number, number][] = [
    [-0.6, 0.9, 0],
    [0.6, 0.9, 0],
  ];

  const zOrigins: [number, number, number][] = [
    [-0.4, 1.65, 0.42],
    [-0.1, 1.75, 0.48],
    [0.2, 1.6, 0.38],
  ];

  return (
    <group>
      <color attach="background" args={['#1a1013']} />
      <hemisphereLight args={['#7a8cff', '#1a2235', 0.45]} />
      <ambientLight intensity={0.5} color={0xbccdef} />
      <directionalLight position={[2.5, 3.6, 1.5]} intensity={0.9} color={0xfff3c4} castShadow />
      <spotLight
        position={[0, 3.8, 2.4]}
        intensity={0.9}
        angle={0.55}
        penumbra={0.55}
        color={0x88aaff}
        castShadow
      />
      <pointLight position={[-1.45, 1.35, 1.05]} intensity={0.8} color={0xffe3b0} distance={6} />
      <pointLight position={[1.8, 2.2, -0.8]} intensity={0.4} color={0x7bbcff} distance={7} />

      <group>
        <mesh position={[0, 2.5, -3.1]} material={wallMaterial} receiveShadow>
          <planeGeometry args={[10, 5]} />
        </mesh>
        <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial} receiveShadow>
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
        <mesh position={[1.3, 1.8, -3.05]} material={windowFrameMaterial}>
          <boxGeometry args={[2.8, 2, 0.2]} />
        </mesh>
        <mesh position={[1.3, 1.8, -3.02]} material={windowGlowMaterial}>
          <boxGeometry args={[2.4, 1.6, 0.06]} />
        </mesh>
        <mesh position={[-1.8, 1.8, -3.05]} material={artFrameMaterial}>
          <boxGeometry args={[1.8, 1.1, 0.08]} />
        </mesh>
        <mesh position={[-1.8, 1.8, -3.04]} material={artAccentMaterial}>
          <boxGeometry args={[1.2, 0.7, 0.04]} />
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

      <VoxelPerson
        pose="sleeping"
        scale={0.95}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        position={[0, 1.15, 0.16]}
        color="#8fb4ff"
      />

      {zOrigins.map((origin, index) => (
        <FloatingZ key={`zzz-${index}`} seed={index + 1} origin={origin} />
      ))}
    </group>
  );
}



