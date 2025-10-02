import { useCallback, useEffect, useMemo, useRef } from "react";
import { Text, TransformControls } from "@react-three/drei";
import { useFrame, useThree, type Euler } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl, TransformControls as TransformControlsImpl } from "three-stdlib";
import type { Group } from "three";
import * as THREE from "three";

import { BedModel } from "../components/BedModel";
import { ManModel } from "../components/ManModel";
import { RoomModel } from "../components/RoomModel";
import { useTransformStore, type TransformState } from "../store/transforms";
import { createRandom } from "../utils/random";
import { useTransformOrbitLock } from "../utils/useTransformOrbitLock";

type TextMesh = THREE.Mesh & { material: THREE.Material | THREE.Material[] };

type FloatingZProps = {
  seed: number;
  origin: [number, number, number];
};

const ROOM_SCALE = 0.52;
const ROOM_ROTATION: Euler = [0, -Math.PI / 2, 0];
const ROOM_OFFSET: [number, number, number] = [0, -0.05, 0];
const BED_OFFSET: [number, number, number] = [0.22, 0, -0.26];
const SLEEP_CAMERA_DEFAULT = {
  position: [2, 1.5, 3.1] as [number, number, number],
  target: [0.15, 1, -0.05] as [number, number, number],
};

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
    <Text ref={assignRef} position={origin} fontSize={config.fontSize} anchorX="center" anchorY="middle" color="#dceaff">
      Z
    </Text>
  );
}

export function SceneSleep() {
  const { camera, controls } = useThree();
  const orbit = controls as OrbitControlsImpl | undefined;
  const controlsRef = useRef<TransformControlsImpl | null>(null);
  const characterRef = useRef<Group | null>(null);
  const applyingCameraRef = useRef(false);

  const editMode = useTransformStore((state) => state.editMode);
  const controlMode = useTransformStore((state) => state.controlMode);
  const setActivePose = useTransformStore((state) => state.setActivePose);
  const updateTransform = useTransformStore((state) => state.updateTransform);
  const setCameraState = useTransformStore((state) => state.setCameraState);
  const cameraState = useTransformStore((state) => state.cameras.sleeping);
  const applyTransform = useCallback((next?: TransformState) => {
    const node = characterRef.current;
    if (!node) {
      return;
    }
    const { position, rotation, scale } =
      next ?? useTransformStore.getState().transforms.sleeping;
    node.position.set(...position);
    node.rotation.set(...rotation);
    node.scale.set(...scale);
  }, []);

  useEffect(() => {
    setActivePose("sleeping");
  }, [setActivePose]);

  useEffect(() => {
    const next = cameraState ?? SLEEP_CAMERA_DEFAULT;
    applyingCameraRef.current = true;
    camera.position.set(...next.position);
    camera.lookAt(...next.target);
    orbit?.target.set(...next.target);
    orbit?.update();
    applyingCameraRef.current = false;
  }, [cameraState, camera, orbit]);

  useEffect(() => {
    if (!orbit) {
      return;
    }
    const handleEnd = () => {
      if (applyingCameraRef.current) {
        return;
      }
      setCameraState("sleeping", {
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [orbit.target.x, orbit.target.y, orbit.target.z],
      });
    };
    orbit.addEventListener('end', handleEnd);
    return () => {
      orbit.removeEventListener('end', handleEnd);
    };
  }, [orbit, camera, setCameraState]);

  useTransformOrbitLock(controlsRef, editMode);

  useEffect(() => {
    applyTransform();
    let previous = useTransformStore.getState().transforms.sleeping;
    const unsubscribe = useTransformStore.subscribe((state) => {
      const next = state.transforms.sleeping;
      if (
        next.position === previous.position &&
        next.rotation === previous.rotation &&
        next.scale === previous.scale
      ) {
        return;
      }
      previous = next;
      applyTransform(next);
    });
    return unsubscribe;
  }, [applyTransform]);

  useEffect(() => {
    applyTransform();
  }, [applyTransform, editMode]);

  const handleObjectChange = useCallback(() => {
    const node = characterRef.current;
    if (!node) return;
    updateTransform("sleeping", {
      position: [node.position.x, node.position.y, node.position.z],
      rotation: [node.rotation.x, node.rotation.y, node.rotation.z],
      scale: [node.scale.x, node.scale.y, node.scale.z],
    });
  }, [updateTransform]);

  const zOrigins: [number, number, number][] = [
    [0.32, 0.6, -0.28],
    [0.45, 0.68, -0.18],
    [0.55, 0.65, -0.22],
  ];

  return (
    <group>
      <color attach="background" args={["#10070d"]} />
      <hemisphereLight args={["#ffe8d2", "#35242f", 0.55]} />
      <ambientLight intensity={0.55} color={0xfff1df} />
      <directionalLight position={[1.4, 3, 2.2]} intensity={0.9} color={0xffe7c2} castShadow />

      <RoomModel position={ROOM_OFFSET} scale={ROOM_SCALE} rotation={ROOM_ROTATION} />

      <group position={BED_OFFSET}>
        <BedModel scale={0.62} />
        {editMode ? (
          <TransformControls ref={controlsRef} mode={controlMode} onObjectChange={handleObjectChange}>
            <group ref={characterRef}>
              <ManModel />
            </group>
          </TransformControls>
        ) : (
          <group ref={characterRef}>
            <ManModel />
          </group>
        )}
      </group>

      {zOrigins.map((origin, index) => (
        <FloatingZ key={`zzz-${index}`} seed={index + 1} origin={origin} />
      ))}
    </group>
  );
}
