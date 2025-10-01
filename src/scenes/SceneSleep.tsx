import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, useThree, type Euler } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

import { BedModel } from '../components/BedModel';
import { ManModel } from '../components/ManModel';
import { RoomModel } from '../components/RoomModel';
import { useTransformStore } from '../store/transforms';
import { createRandom } from '../utils/random';

type TextMesh = THREE.Mesh & { material: THREE.Material | THREE.Material[] };

type FloatingZProps = {
  seed: number;
  origin: [number, number, number];
};

const ROOM_SCALE = 0.52;
const ROOM_ROTATION: Euler = [0, -Math.PI / 2, 0];
const ROOM_OFFSET: [number, number, number] = [0, -0.05, 0];
const BED_OFFSET: [number, number, number] = [0.22, 0.0, -0.26];

function FloatingZ({ seed, origin }: FloatingZProps) {
  const textRef = useRef<TextMesh | null>(null);

  const assignRef = useCallback((mesh: THREE.Object3D | null) => {
    textRef.current = (mesh as TextMesh | null) ?? null;
  }, []);

  const config = useMemo(() => {
    const rand = createRandom(seed);
    return {
      fontSize: 0.18 + rand() * 0.05,
      cycle: 1.6 + rand() * 0.4,
      sway: 0.1 + rand() * 0.04,
      drift: 0.08 + rand() * 0.03,
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
    const y = origin[1] + progress * 0.6;
    const x = origin[0] + Math.sin(progress * Math.PI * 2 + config.phase) * config.sway;
    const z = origin[2] + Math.cos(progress * Math.PI * 2 + config.phase) * config.drift;
    mesh.position.set(x, y, z);
    const opacity = Math.max(0, Math.pow(1 - progress, 1.3));
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
  const { camera, controls } = useThree();
  const orbit = controls as OrbitControlsImpl | undefined;
  const setActivePose = useTransformStore((state) => state.setActivePose);
  const transform = useTransformStore((state) => state.transforms.sleeping);

  useEffect(() => {
    setActivePose('sleeping');
    camera.position.set(2, 1.5, 3.1);
    camera.lookAt(0.15, 1, -0.05);
    orbit?.target.set(0.15, 1, -0.05);
    orbit?.update();
  }, [camera, orbit, setActivePose]);

  const zOrigins: [number, number, number][] = [
    [0.32, 0.6, -0.28],
    [0.45, 0.68, -0.18],
    [0.55, 0.65, -0.22],
  ];

  return (
    <group>
      <color attach="background" args={['#10070d']} />
      <hemisphereLight args={['#ffe8d2', '#35242f', 0.55]} />
      <ambientLight intensity={0.55} color={0xfff1df} />
      <directionalLight position={[1.4, 3, 2.2]} intensity={0.9} color={0xffe7c2} castShadow />

      <RoomModel position={ROOM_OFFSET} scale={ROOM_SCALE} rotation={ROOM_ROTATION} />

      <group position={BED_OFFSET}>
        <BedModel scale={0.62} />
        <ManModel position={transform.position} rotation={transform.rotation} scale={transform.scale} />
      </group>

      {zOrigins.map((origin, index) => (
        <FloatingZ key={`zzz-${index}`} seed={index + 1} origin={origin} />
      ))}
    </group>
  );
}

