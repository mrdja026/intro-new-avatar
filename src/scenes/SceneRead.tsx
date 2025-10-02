import { useCallback, useEffect, useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree, type Euler } from '@react-three/fiber';
import type { Group } from 'three';
import type { OrbitControls as OrbitControlsImpl, TransformControls as TransformControlsImpl } from 'three-stdlib';
import { ManModel } from '../components/ManModel';
import { RoomModel } from '../components/RoomModel';
import { useTransformStore, type TransformState } from '../store/transforms';
import { useTransformOrbitLock } from '../utils/useTransformOrbitLock';

const ROOM_SCALE = 0.52;
const ROOM_ROTATION: Euler = [0, -Math.PI / 2, 0];
const ROOM_OFFSET: [number, number, number] = [0, -0.05, 0];
const CHARACTER_OFFSET: [number, number, number] = [0.22, 0.0, -0.26];
const READ_CAMERA_DEFAULT = {
  position: [-2.1, 1.65, 3] as [number, number, number],
  target: [0.1, 1, 0.15] as [number, number, number],
};

export function SceneRead() {
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
  const cameraState = useTransformStore((state) => state.cameras.reading);
  const transformCacheRef = useRef<TransformState>(useTransformStore.getState().transforms.reading);

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

  useEffect(() => {
    const initial = useTransformStore.getState().transforms.reading;
    transformCacheRef.current = initial;
    applyTransform(initial);

    const unsubscribe = useTransformStore.subscribe((state) => {
      const next = state.transforms.reading;
      if (transformCacheRef.current === next) {
        return;
      }
      transformCacheRef.current = next;
      applyTransform(next);
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

      <group position={CHARACTER_OFFSET}>
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

    </group>
  );
}
