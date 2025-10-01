import { useEffect, useMemo } from 'react';
import { useThree, type Euler } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

import { AuraParticle } from '../components/AuraParticle';
import { BedModel } from '../components/BedModel';
import { ManModel } from '../components/ManModel';
import { RoomModel } from '../components/RoomModel';
import { useTransformStore } from '../store/transforms';

const ROOM_SCALE = 0.52;
const ROOM_ROTATION: Euler = [0, -Math.PI / 2, 0];
const ROOM_OFFSET: [number, number, number] = [0, -0.05, 0];
const BED_OFFSET: [number, number, number] = [0.22, 0.0, -0.26];

export function SceneRead() {
  const { camera, controls } = useThree();
  const orbit = controls as OrbitControlsImpl | undefined;
  const setActivePose = useTransformStore((state) => state.setActivePose);
  const transform = useTransformStore((state) => state.transforms.reading);

  useEffect(() => {
    setActivePose('reading');
    camera.position.set(-2.1, 1.65, 3);
    camera.lookAt(0.1, 1, 0.15);
    orbit?.target.set(0.1, 1, 0.15);
    orbit?.update();
  }, [camera, orbit, setActivePose]);

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
        <group position={transform.position} rotation={transform.rotation}>
          <ManModel scale={transform.scale} />
        </group>
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
