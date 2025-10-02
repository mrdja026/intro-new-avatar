import { useCallback, useEffect, useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import type { Group } from 'three';
import { useThree, type Euler } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl, TransformControls as TransformControlsImpl } from 'three-stdlib';
import { useFrame } from '@react-three/fiber';

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

const TRANSFORM_EPSILON = 1e-4;

function cloneTransformState(state: TransformState): TransformState {
  return {
    position: [...state.position] as [number, number, number],
    rotation: [...state.rotation] as [number, number, number],
    scale: [...state.scale] as [number, number, number],
  };
}

function transformsDiffer(a: TransformState, b: TransformState): boolean {
  for (let i = 0; i < 3; i += 1) {
    if (Math.abs(a.position[i] - b.position[i]) > TRANSFORM_EPSILON) {
      return true;
    }
    if (Math.abs(a.rotation[i] - b.rotation[i]) > TRANSFORM_EPSILON) {
      return true;
    }
    if (Math.abs(a.scale[i] - b.scale[i]) > TRANSFORM_EPSILON) {
      return true;
    }
  }
  return false;
}

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
  const transformCacheRef = useRef<TransformState>(
    cloneTransformState(useTransformStore.getState().transforms.coding),
  );

  const applyTransform = useCallback((next: TransformState) => {
    const node = characterRef.current;
    if (!node) {
      return;
    }
    const { position, rotation, scale } = next;
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
    const initial = useTransformStore.getState().transforms.coding;
    transformCacheRef.current = cloneTransformState(initial);
    applyTransform(initial);

    const unsubscribe = useTransformStore.subscribe((state) => state.transforms.coding, (next) => {
      if (!transformsDiffer(next, transformCacheRef.current)) {
        return;
      }
      const cloned = cloneTransformState(next);
      transformCacheRef.current = cloned;
      applyTransform(cloned);
    });

    return unsubscribe;
  }, [applyTransform]);

  useEffect(() => {
    applyTransform(transformCacheRef.current);
  }, [applyTransform, editMode]);

  useTransformOrbitLock(controlsRef, editMode);

  const handleObjectChange = () => {
    const node = characterRef.current;
    if (!node) return;
    const next: TransformState = {
      position: [node.position.x, node.position.y, node.position.z],
      rotation: [node.rotation.x, node.rotation.y, node.rotation.z],
      scale: [node.scale.x, node.scale.y, node.scale.z],
    };
    transformCacheRef.current = cloneTransformState(next);
    updateTransform('coding', next);
  };

  useFrame(() => {
    if (!editMode) {
      return;
    }
    const node = characterRef.current;
    if (!node) {
      return;
    }
    const current: TransformState = {
      position: [node.position.x, node.position.y, node.position.z],
      rotation: [node.rotation.x, node.rotation.y, node.rotation.z],
      scale: [node.scale.x, node.scale.y, node.scale.z],
    };
    if (!transformsDiffer(current, transformCacheRef.current)) {
      return;
    }
    transformCacheRef.current = cloneTransformState(current);
    updateTransform('coding', current);
  });

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
