import { useCallback, useEffect, useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import type { Group } from 'three';
import { useThree, type Euler } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl, TransformControls as TransformControlsImpl } from 'three-stdlib';

import { ComputerModel } from '../components/ComputerModel';
import { SittingManModel } from '../components/SittingManModel';
import { RoomModel } from '../components/RoomModel';
import { useTransformStore, type TransformState } from '../store/transforms';
import { useTransformOrbitLock } from '../utils/useTransformOrbitLock';

const ROOM_SCALE = 0.5;
const ROOM_ROTATION: Euler = [0, Math.PI / 2, 0];
const ROOM_OFFSET: [number, number, number] = [0, -0.05, 0];
const CODE_CAMERA_DEFAULT = {
  position: [2, 1.6, 2.9] as [number, number, number],
  target: [0.05, 1.05, 0] as [number, number, number],
};

export function SceneCode() {
  const { camera, controls } = useThree();
  const orbit = controls as OrbitControlsImpl | undefined;
  const characterRef = useRef<Group | null>(null);
  const controlsRef = useRef<TransformControlsImpl | null>(null);
  const applyingCameraRef = useRef(false);

  const editMode = useTransformStore((state) => state.editMode);
  const controlMode = useTransformStore((state) => state.controlMode);
  const setActivePose = useTransformStore((state) => state.setActivePose);
  const updateTransform = useTransformStore((state) => state.updateTransform);
  const setCameraState = useTransformStore((state) => state.setCameraState);
  const cameraState = useTransformStore((state) => state.cameras.coding);

  const applyTransform = useCallback((next?: TransformState) => {
    const node = characterRef.current;
    if (!node) {
      return;
    }
    const { position, rotation, scale } =
      next ?? useTransformStore.getState().transforms.coding;
    node.position.set(...position);
    node.rotation.set(...rotation);
    node.scale.set(...scale);
  }, []);

  useEffect(() => {
    setActivePose('coding');
  }, [setActivePose]);

  useEffect(() => {
    const next = cameraState ?? CODE_CAMERA_DEFAULT;
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
      setCameraState('coding', {
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [orbit.target.x, orbit.target.y, orbit.target.z],
      });
    };
    orbit.addEventListener('end', handleEnd);
    return () => {
      orbit.removeEventListener('end', handleEnd);
    };
  }, [orbit, camera, setCameraState]);

  useEffect(() => {
    applyTransform();
    let previous = useTransformStore.getState().transforms.coding;
    const unsubscribe = useTransformStore.subscribe((state) => {
      const next = state.transforms.coding;
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
    updateTransform('coding', {
      position: [node.position.x, node.position.y, node.position.z],
      rotation: [node.rotation.x, node.rotation.y, node.rotation.z],
      scale: [node.scale.x, node.scale.y, node.scale.z],
    });
  };

  return (
    <group>
      <color attach="background" args={['#0f0710']} />
      <hemisphereLight args={['#ffe1c9', '#2e202f', 0.55]} />
      <ambientLight intensity={0.58} color={0xfff1df} />
      <directionalLight position={[1.2, 3, 2.2]} intensity={0.85} color={0xffe7c2} castShadow />
      <spotLight position={[-2, 2.9, 2]} intensity={0.9} angle={0.54} penumbra={0.55} color={0xfcd6b8} castShadow />
      <pointLight position={[0.25, 2.2, -1]} intensity={0.48} color={0xffd8a4} distance={6.5} />

      <RoomModel position={ROOM_OFFSET} scale={ROOM_SCALE} rotation={ROOM_ROTATION} />

      <ComputerModel position={[0.05, 0.02, -0.2]} rotation={[0, Math.PI / 2.6, 0]} scale={0.5} />

      {editMode ? (
        <TransformControls ref={controlsRef} mode={controlMode} onObjectChange={handleObjectChange}>
          <group ref={characterRef}>
            <SittingManModel />
          </group>
        </TransformControls>
      ) : (
        <group ref={characterRef}>
          <SittingManModel />
        </group>
      )}
    </group>
  );
}


