import { useCallback, useEffect, useMemo, useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree, type Euler } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl, TransformControls as TransformControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

import { AuraParticle } from '../components/AuraParticle';
import { BedModel } from '../components/BedModel';
import { ManModel } from '../components/ManModel';
import { RoomModel } from '../components/RoomModel';
import { useTransformStore, type TransformState } from '../store/transforms';
import { useTransformOrbitLock } from '../utils/useTransformOrbitLock';

const ROOM_SCALE = 0.52;
const ROOM_ROTATION: Euler = [0, -Math.PI / 2, 0];
const ROOM_OFFSET: [number, number, number] = [0, -0.05, 0];
const BED_OFFSET: [number, number, number] = [0.22, 0.0, -0.26];
const READ_CAMERA_DEFAULT = {
  position: [-2.1, 1.65, 3] as [number, number, number],
  target: [0.1, 1, 0.15] as [number, number, number],
};

export function SceneRead() {
  const { camera, controls } = useThree();
  const orbit = controls as OrbitControlsImpl | undefined;
  const controlsRef = useRef<TransformControlsImpl | null>(null);
  const characterRef = useRef<THREE.Group | null>(null);
  const applyingCameraRef = useRef(false);

  const editMode = useTransformStore((state) => state.editMode);
  const controlMode = useTransformStore((state) => state.controlMode);
  const setActivePose = useTransformStore((state) => state.setActivePose);
  const updateTransform = useTransformStore((state) => state.updateTransform);
  const setCameraState = useTransformStore((state) => state.setCameraState);
  const cameraState = useTransformStore((state) => state.cameras.reading);

  const applyTransform = useCallback((next?: TransformState) => {
    const node = characterRef.current;
    if (!node) {
      return;
    }
    const { position, rotation, scale } =
      next ?? useTransformStore.getState().transforms.reading;
    node.position.set(...position);
    node.rotation.set(...rotation);
    node.scale.set(...scale);
  }, []);

  useEffect(() => {
    setActivePose('reading');
  }, [setActivePose]);

  useEffect(() => {
    const next = cameraState ?? READ_CAMERA_DEFAULT;
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
      setCameraState('reading', {
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [orbit.target.x, orbit.target.y, orbit.target.z],
      });
    };
    orbit.addEventListener('end', handleEnd);
    return () => {
      orbit.removeEventListener('end', handleEnd);
    };
  }, [orbit, camera, setCameraState]);

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

  useEffect(() => () => tabletMaterial.dispose(), [tabletMaterial]);

  useEffect(() => {
    applyTransform();
    let previous = useTransformStore.getState().transforms.reading;
    const unsubscribe = useTransformStore.subscribe((state) => {
      const next = state.transforms.reading;
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

  useTransformOrbitLock(controlsRef, editMode);

  const handleObjectChange = () => {
    const node = characterRef.current;
    if (!node) return;
    updateTransform('reading', {
      position: [node.position.x, node.position.y, node.position.z],
      rotation: [node.rotation.x, node.rotation.y, node.rotation.z],
      scale: [node.scale.x, node.scale.y, node.scale.z],
    });
  };

  return (
    <group>
      <color attach="background" args={['#10070d']} />
      <hemisphereLight args={['#ffe5cc', '#7d5c5c', 0.5]} />
      <ambientLight intensity={0.52} color={0xffeedf} />
      <directionalLight position={[-2.4, 3.1, 1.8]} intensity={0.88} color={0xffe4c2} castShadow />
      <spotLight position={[1.5, 3, 2.2]} intensity={0.82} angle={0.55} penumbra={0.6} color={0xfbd5b4} castShadow />

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

      <group position={[0.22, 0.82, -0.18]} rotation={[-0.25, Math.PI / 2, 0.2]}>
        <mesh material={tabletMaterial} castShadow>
          <boxGeometry args={[0.6, 0.05, 0.38]} />
        </mesh>
        <group position={[0, 0.05, 0]}>
          <AuraParticle seed={0} />
          <AuraParticle seed={1} />
          <AuraParticle seed={2} />
        </group>
      </group>
    </group>
  );
}
