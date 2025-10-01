import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { VoxelPerson } from '../components/VoxelPerson';

function useBedMaterials() {
  const frame = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x1c2436, roughness: 0.55, metalness: 0.15 }), []);
  const mattress = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x202c46, roughness: 0.7 }), []);
  const pillow = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x2d3d5e, roughness: 0.4 }), []);

  useEffect(() => {
    return () => {
      frame.dispose();
      mattress.dispose();
      pillow.dispose();
    };
  }, [frame, mattress, pillow]);

  return { frame, mattress, pillow };
}

type AuraProps = {
  seed: number;
  radius: number;
  height: number;
};

function AuraParticle({ seed, radius, height }: AuraProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#6bc6ff'),
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    });
    return mat;
  }, []);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.getElapsedTime() + seed * 0.4;
    const angle = t * 0.6 + seed;
    const y = height + Math.sin(t * 1.7 + seed) * 0.15;
    mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    mesh.quaternion.copy(state.camera.quaternion);
    material.opacity = 0.45 + Math.sin(t * 2.2 + seed) * 0.18;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[0.24, 0.24]} />
    </mesh>
  );
}

export function SceneRead() {
  const { camera } = useThree();
  const desiredCamera = useRef(new THREE.Vector3(-2.2, 1.9, 4.1));
  const lookTarget = useRef(new THREE.Vector3(0, 1.1, 0.2));

  useEffect(() => {
    camera.position.copy(desiredCamera.current);
    camera.lookAt(lookTarget.current);
  }, [camera]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    desiredCamera.current.set(
      -2.2 + Math.sin(t * 0.17) * 0.4,
      1.85 + Math.sin(t * 0.2) * 0.12,
      4 + Math.cos(t * 0.18) * 0.32,
    );
    camera.position.lerp(desiredCamera.current, 0.05);

    lookTarget.current.set(
      0.15 + Math.sin(t * 0.14) * 0.12,
      1.05 + Math.sin(t * 0.2) * 0.08,
      0.2 + Math.cos(t * 0.16) * 0.06,
    );
    camera.lookAt(lookTarget.current);
  });

  const { frame, mattress, pillow } = useBedMaterials();

  const bookMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1b2338,
      emissive: new THREE.Color('#7dd6ff'),
      emissiveIntensity: 1.9,
      roughness: 0.3,
      metalness: 0.15,
    });
    return mat;
  }, []);

  useEffect(() => () => bookMaterial.dispose(), [bookMaterial]);

  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x111a2b, roughness: 0.82, metalness: 0.06 }), []);
  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x0d111b, roughness: 0.9, metalness: 0.04 }), []);
  const carpetMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x1f2738, roughness: 0.92 }), []);
  const windowFrameMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x2a374f, roughness: 0.5, metalness: 0.2 }), []);
  const windowGlowMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1f2435,
      emissive: new THREE.Color('#ffb374'),
      emissiveIntensity: 0.65,
      roughness: 0.35,
    });
    mat.transparent = true;
    mat.opacity = 0.78;
    return mat;
  }, []);
  const shelfMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x252f45, roughness: 0.6, metalness: 0.2 }), []);
  const accentBookMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xff7f5e, roughness: 0.4, metalness: 0.2 }), []);
  const sideTableMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x2b364d, roughness: 0.55, metalness: 0.16 }), []);
  const plantPotMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x2c3446, roughness: 0.6, metalness: 0.15 }), []);
  const plantLeafMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x3f7a58, roughness: 0.45, metalness: 0.08 }), []);

  useEffect(() => {
    return () => {
      wallMaterial.dispose();
      floorMaterial.dispose();
      carpetMaterial.dispose();
      windowFrameMaterial.dispose();
      windowGlowMaterial.dispose();
      shelfMaterial.dispose();
      accentBookMaterial.dispose();
      sideTableMaterial.dispose();
      plantPotMaterial.dispose();
      plantLeafMaterial.dispose();
    };
  }, [
    wallMaterial,
    floorMaterial,
    carpetMaterial,
    windowFrameMaterial,
    windowGlowMaterial,
    shelfMaterial,
    accentBookMaterial,
    sideTableMaterial,
    plantPotMaterial,
    plantLeafMaterial,
  ]);

  return (
    <group>
      <color attach="background" args={['#050608']} />
      <ambientLight intensity={0.42} />
      <spotLight
        position={[-1.2, 3.2, 2.6]}
        angle={0.55}
        penumbra={0.7}
        intensity={1.1}
        color={0xa5c7ff}
      />
      <pointLight position={[0.8, 1.6, 0.8]} intensity={0.7} color={0xffb37a} distance={7} />
      <pointLight position={[-2.6, 2.2, 2]} intensity={0.45} color={0x4b6da8} distance={9} />

      <group>
        <mesh position={[0, 1.5, -2.8]} material={wallMaterial} receiveShadow>
          <planeGeometry args={[9, 5]} />
        </mesh>
        <mesh position={[4.8, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial} receiveShadow>
          <planeGeometry args={[6, 5]} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMaterial} receiveShadow>
          <planeGeometry args={[15, 12]} />
        </mesh>
        <mesh position={[0, 0.01, 0.4]} rotation={[-Math.PI / 2, 0, 0]} material={carpetMaterial} receiveShadow>
          <circleGeometry args={[1.9, 36]} />
        </mesh>
        <mesh position={[1.6, 1.7, -2.78]} material={windowFrameMaterial}>
          <planeGeometry args={[2.6, 1.7]} />
        </mesh>
        <mesh position={[1.6, 1.7, -2.77]} material={windowGlowMaterial}>
          <planeGeometry args={[2.3, 1.4]} />
        </mesh>
      </group>

      <group position={[2.3, 0.8, 0.3]}>
        <mesh material={shelfMaterial} castShadow>
          <boxGeometry args={[0.6, 1.6, 0.25]} />
        </mesh>
        <mesh position={[0, 0.5, 0.18]} material={accentBookMaterial} castShadow>
          <boxGeometry args={[0.4, 0.18, 0.18]} />
        </mesh>
        <mesh position={[0, 0.1, 0.18]} material={accentBookMaterial} castShadow>
          <boxGeometry args={[0.35, 0.14, 0.18]} />
        </mesh>
      </group>

      <group position={[-1.2, 0.4, 1]}> 
        <mesh material={sideTableMaterial} castShadow>
          <boxGeometry args={[0.7, 0.5, 0.5]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} material={sideTableMaterial} castShadow>
          <boxGeometry args={[0.7, 0.12, 0.5]} />
        </mesh>
        <mesh position={[0.1, 0.6, 0]} material={accentBookMaterial} castShadow>
          <boxGeometry args={[0.3, 0.12, 0.28]} />
        </mesh>
      </group>

      <group position={[2.1, 0.18, -0.9]}>
        <mesh material={plantPotMaterial} castShadow>
          <cylinderGeometry args={[0.22, 0.28, 0.26, 12]} />
        </mesh>
        <mesh position={[0, 0.32, 0]} material={plantLeafMaterial} castShadow>
          <coneGeometry args={[0.45, 0.6, 6]} />
        </mesh>
      </group>

      <group>
        <mesh position={[0, 0.35, 0]} material={frame} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.4, 2]} />
        </mesh>
        <mesh position={[0, 0.7, 0]} material={mattress} castShadow receiveShadow>
          <boxGeometry args={[3.05, 0.3, 1.85]} />
        </mesh>
        <mesh position={[-0.6, 0.85, 0]} material={pillow}>
          <boxGeometry args={[0.9, 0.24, 0.75]} />
        </mesh>
        <mesh position={[0.6, 0.85, 0]} material={pillow}>
          <boxGeometry args={[0.9, 0.24, 0.75]} />
        </mesh>
      </group>

      <VoxelPerson
        pose="reading"
        scale={0.95}
        position={[-0.45, 0.65, 0]}
        rotation={[0, Math.PI / 2, 0]}
        color="#8fb4ff"
      />

      <group position={[0.32, 1.24, 0.32]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={bookMaterial} castShadow>
          <boxGeometry args={[0.72, 0.05, 0.5]} />
        </mesh>
      </group>

      <group position={[0.32, 1.24, 0.32]}>
        <AuraParticle seed={1} radius={0.32} height={0.16} />
        <AuraParticle seed={2} radius={0.38} height={0.2} />
        <AuraParticle seed={3} radius={0.44} height={0.18} />
      </group>
    </group>
  );
}
