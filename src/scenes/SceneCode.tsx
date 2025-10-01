import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { Lightbulb } from '../components/Lightbulb';
import { VoxelPerson } from '../components/VoxelPerson';
import { codeRainFragment, codeRainVertex, createCodeRainUniforms } from '../shaders/codeRain';

export function SceneCode() {
  const { camera } = useThree();
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const coderRef = useRef<THREE.Group>(null);

  useEffect(() => {
    camera.position.set(2.3, 1.9, 3.1);
    camera.lookAt(0, 1.1, 0);
  }, [camera]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const radius = 0.38;
    camera.position.x = 2.3 + Math.sin(t * 0.22) * radius;
    camera.position.z = 3.1 - Math.cos(t * 0.22) * radius;
    camera.lookAt(0, 1.1 + Math.sin(t * 0.18) * 0.05, 0);

    if (coderRef.current) {
      coderRef.current.position.y = 0.62 + Math.sin(t * 1.4) * 0.025;
    }

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = t * 0.52;
    }
  });

  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf5dfce, roughness: 0.68, metalness: 0.08 }), []);
  const accentWallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf2cab8, roughness: 0.64, metalness: 0.1 }), []);
  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf1ded0, roughness: 0.78, metalness: 0.05 }), []);
  const ceilingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xfff6ec, roughness: 0.95 }), []);
  const trimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xe4c7b6, roughness: 0.72, metalness: 0.08 }), []);
  const stripMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf8e1d1,
      emissive: new THREE.Color('#ffe8c9'),
      emissiveIntensity: 1.2,
      roughness: 0.3,
    });
    return mat;
  }, []);
  const deskMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xd6c7f5, roughness: 0.5, metalness: 0.18 }), []);
  const deskBaseMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xc4b6ec, roughness: 0.45, metalness: 0.22 }), []);
  const chairMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xd9b49d, roughness: 0.5, metalness: 0.16 }), []);
  const cushionMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf2d4c3, roughness: 0.4, metalness: 0.12 }), []);
  const monitorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x202637, roughness: 0.42, metalness: 0.35 }), []);
  const keyboardMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x2a3244, roughness: 0.5, metalness: 0.25 }), []);
  const decorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xff9f85, roughness: 0.4, metalness: 0.18 }), []);
  const shelfMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xe8cbd8, roughness: 0.55, metalness: 0.12 }), []);

  const shaderUniforms = useMemo(() => {
    const uniforms = createCodeRainUniforms();
    uniforms.uColor.value = new THREE.Color('#7ef4ff');
    return uniforms;
  }, []);

  useEffect(() => {
    return () => {
      wallMaterial.dispose();
      accentWallMaterial.dispose();
      floorMaterial.dispose();
      ceilingMaterial.dispose();
      trimMaterial.dispose();
      stripMaterial.dispose();
      deskMaterial.dispose();
      deskBaseMaterial.dispose();
      chairMaterial.dispose();
      cushionMaterial.dispose();
      monitorMaterial.dispose();
      keyboardMaterial.dispose();
      decorMaterial.dispose();
      shelfMaterial.dispose();
    };
  }, [
    wallMaterial,
    accentWallMaterial,
    floorMaterial,
    ceilingMaterial,
    trimMaterial,
    stripMaterial,
    deskMaterial,
    deskBaseMaterial,
    chairMaterial,
    cushionMaterial,
    monitorMaterial,
    keyboardMaterial,
    decorMaterial,
    shelfMaterial,
  ]);

  const bulbOrigin = useMemo(() => new THREE.Vector3(-0.55, 1.55, 0), []);
  const bulbConfigs = useMemo(
    () => [
      { seed: 0, radius: 0.42, height: 0.48 },
      { seed: 1, radius: 0.5, height: 0.58 },
      { seed: 2, radius: 0.6, height: 0.68 },
      { seed: 3, radius: 0.68, height: 0.78 },
    ],
    [],
  );

  return (
    <group>
      <color attach="background" args={['#180f14']} />
      <hemisphereLight args={['#ffe8d2', '#7a6b6b', 0.55]} />
      <ambientLight intensity={0.58} color={0xfff1df} />
      <directionalLight position={[1.8, 3.6, 2.4]} intensity={0.85} color={0xffe7c2} castShadow />
      <spotLight position={[-2.4, 3.2, 2.1]} intensity={0.95} angle={0.55} penumbra={0.6} color={0xfcd6b8} castShadow />
      <pointLight position={[0.4, 2.5, -1.2]} intensity={0.55} color={0xffd8a4} distance={8} />

      <group>
        <mesh position={[0, 2.4, -2.8]} material={wallMaterial} receiveShadow>
          <planeGeometry args={[9, 5]} />
        </mesh>
        <mesh position={[4.4, 2.4, 0]} rotation={[0, Math.PI / 2, 0]} material={accentWallMaterial} receiveShadow>
          <planeGeometry args={[6, 5]} />
        </mesh>
        <mesh position={[0, 2.4, 1.8]} rotation={[0, Math.PI, 0]} material={accentWallMaterial} receiveShadow>
          <planeGeometry args={[9, 5]} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMaterial} receiveShadow>
          <planeGeometry args={[14, 11]} />
        </mesh>
        <mesh position={[0, 2.9, 0]} rotation={[Math.PI / 2, 0, 0]} material={ceilingMaterial}>
          <planeGeometry args={[14, 11]} />
        </mesh>
        <mesh position={[0, 0.55, -2.79]} material={trimMaterial}>
          <boxGeometry args={[9, 0.18, 0.2]} />
        </mesh>
        <mesh position={[0, 3.25, -2.78]} material={trimMaterial}>
          <boxGeometry args={[9, 0.1, 0.2]} />
        </mesh>
        <mesh position={[-3.8, 2.4, 0]} rotation={[0, -Math.PI / 2, 0]} material={trimMaterial}>
          <boxGeometry args={[5, 0.18, 0.2]} />
        </mesh>
        <mesh position={[0, 2.65, -2.75]} material={stripMaterial}>
          <boxGeometry args={[7.2, 0.08, 0.12]} />
        </mesh>
        <mesh position={[-1.6, 2.15, -2.74]} material={decorMaterial}>
          <boxGeometry args={[0.7, 1, 0.08]} />
        </mesh>
        <group position={[2.2, 1.4, -2.7]}>
          <mesh material={shelfMaterial}>
            <boxGeometry args={[1.2, 0.12, 0.3]} />
          </mesh>
          <mesh position={[0.35, -0.18, 0.02]} material={decorMaterial}>
            <boxGeometry args={[0.25, 0.26, 0.1]} />
          </mesh>
        </group>
      </group>

      <group position={[-0.2, 0.88, 0]}>
        <mesh position={[0, -0.28, 0]} material={deskBaseMaterial} castShadow>
          <boxGeometry args={[3.2, 0.5, 1.35]} />
        </mesh>
        <mesh position={[0, 0.08, 0]} material={deskMaterial} castShadow>
          <boxGeometry args={[3.4, 0.12, 1.55]} />
        </mesh>
        <mesh position={[-1.25, -0.78, 0.48]} material={deskBaseMaterial} castShadow>
          <boxGeometry args={[0.45, 1.15, 0.35]} />
        </mesh>
        <mesh position={[1.25, -0.78, 0.48]} material={deskBaseMaterial} castShadow>
          <boxGeometry args={[0.45, 1.15, 0.35]} />
        </mesh>
      </group>

      <group position={[-0.5, 0.52, -0.35]}>
        <mesh material={chairMaterial} castShadow>
          <boxGeometry args={[0.95, 0.22, 0.92]} />
        </mesh>
        <mesh position={[0, 0.62, -0.32]} material={chairMaterial} castShadow>
          <boxGeometry args={[0.95, 0.92, 0.18]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} material={cushionMaterial} castShadow>
          <boxGeometry args={[0.82, 0.18, 0.88]} />
        </mesh>
        <mesh position={[0, -0.4, 0]} material={chairMaterial} castShadow>
          <cylinderGeometry args={[0.15, 0.13, 0.45, 12]} />
        </mesh>
      </group>

      <group position={[0.65, 1.12, -0.18]}>
        <mesh material={monitorMaterial} castShadow>
          <boxGeometry args={[0.95, 0.6, 0.1]} />
        </mesh>
        <mesh position={[0, -0.45, 0.11]} material={monitorMaterial}>
          <boxGeometry args={[0.18, 0.48, 0.24]} />
        </mesh>
        <mesh position={[0, -0.68, 0.32]} material={monitorMaterial} castShadow>
          <boxGeometry args={[0.62, 0.1, 0.68]} />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[0.92, 0.58]} />
          <shaderMaterial
            ref={shaderRef}
            transparent
            fragmentShader={codeRainFragment}
            vertexShader={codeRainVertex}
            uniforms={shaderUniforms}
            depthWrite={false}
          />
        </mesh>
      </group>

      <mesh position={[0.05, 0.98, 0.28]} material={keyboardMaterial} castShadow>
        <boxGeometry args={[1.28, 0.08, 0.48]} />
      </mesh>
      <mesh position={[-0.7, 0.98, 0.5]} material={keyboardMaterial} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.3, 12]} />
      </mesh>

      <group ref={coderRef} position={[-0.6, 0.62, 0]} rotation={[0, Math.PI / 2, 0]}>
        <VoxelPerson pose="typing" scale={0.92} color="#8fb4ff" />
      </group>

      {bulbConfigs.map((config) => (
        <Lightbulb
          key={config.seed}
          seed={config.seed}
          origin={bulbOrigin}
          radius={config.radius}
          height={config.height}
        />
      ))}
    </group>
  );
}
