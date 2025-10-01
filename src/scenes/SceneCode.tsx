import { useEffect } from 'react';
import { useThree, type Euler } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

import { ComputerModel } from '../components/ComputerModel';
import { SittingManModel } from '../components/SittingManModel';
import { RoomModel } from '../components/RoomModel';
import { useTransformStore } from '../store/transforms';

const ROOM_SCALE = 0.5;
const ROOM_ROTATION: Euler = [0, Math.PI / 2, 0];
const ROOM_OFFSET: [number, number, number] = [0, -0.05, 0];

export function SceneCode() {
  const { camera, controls } = useThree();
  const orbit = controls as OrbitControlsImpl | undefined;
  const setActivePose = useTransformStore((state) => state.setActivePose);
  const transform = useTransformStore((state) => state.transforms.coding);

  useEffect(() => {
    setActivePose('coding');
    camera.position.set(2, 1.6, 2.9);
    camera.lookAt(0.05, 1.05, 0);
    orbit?.target.set(0.05, 1.05, 0);
    orbit?.update();
  }, [camera, orbit, setActivePose]);

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

      <group position={transform.position} rotation={transform.rotation}>
        <SittingManModel scale={transform.scale} />
      </group>
    </group>
  );
}
