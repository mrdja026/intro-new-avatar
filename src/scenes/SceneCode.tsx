import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { VoxelPerson } from '../components/VoxelPerson';
import { codeRainFragment, codeRainVertex, createCodeRainUniforms } from '../shaders/codeRain';

export function SceneCode() {
  const { camera } = useThree();
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    camera.position.set(2.4, 1.8, 3.4);
    camera.lookAt(0, 1.05, 0);
  }, [camera]);

  const deskMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x1a2334, roughness: 0.6, metalness: 0.2 }), []);
  const monitorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x111623, metalness: 0.4, roughness: 0.6 }), []);
  const keyboardMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x222d3f, roughness: 0.5 }), []);
  const chairMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x202f44, roughness: 0.6 }), []);

  const shaderUniforms = useMemo(() => createCodeRainUniforms(), []);

  useEffect(() => {
    return () => {
      deskMaterial.dispose();
      monitorMaterial.dispose();
      keyboardMaterial.dispose();
      chairMaterial.dispose();
    };
  }, [chairMaterial, deskMaterial, keyboardMaterial, monitorMaterial]);

  useFrame((state) => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime() * 0.45;
  });

  return (
    <group>
      <ambientLight intensity={0.45} />
      <spotLight position={[-2.4, 3, 1.6]} intensity={1.1} angle={0.5} color={0x8af2ff} penumbra={0.6} />
      <pointLight position={[1.6, 2.4, 2.2]} intensity={0.9} color={0x5aa2ff} />

      <group position={[0, 0.9, 0]}>
        <mesh material={deskMaterial} receiveShadow castShadow>
          <boxGeometry args={[3.2, 0.2, 1.2]} />
        </mesh>
        <mesh position={[0, -0.65, 0.45]} material={deskMaterial} castShadow>
          <boxGeometry args={[3.2, 1.1, 0.18]} />
        </mesh>
      </group>

      <group position={[-0.25, 0.45, -0.4]}>
        <mesh position={[0, 0.25, 0]} material={chairMaterial} castShadow>
          <boxGeometry args={[0.9, 0.5, 0.9]} />
        </mesh>
        <mesh position={[0, 0.82, -0.35]} material={chairMaterial} castShadow>
          <boxGeometry args={[0.9, 0.8, 0.1]} />
        </mesh>
        <mesh position={[0, -0.15, 0]} material={chairMaterial} castShadow>
          <boxGeometry args={[0.5, 0.3, 0.5]} />
        </mesh>
      </group>

      <group position={[0.45, 1.1, -0.2]}>
        <mesh material={monitorMaterial} castShadow>
          <boxGeometry args={[0.9, 0.6, 0.08]} />
        </mesh>
        <mesh position={[0, -0.45, 0.08]} material={monitorMaterial}>
          <boxGeometry args={[0.15, 0.5, 0.2]} />
        </mesh>
        <mesh position={[0, -0.75, 0.28]} material={monitorMaterial} castShadow>
          <boxGeometry args={[0.6, 0.08, 0.6]} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[0.86, 0.56]} />
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

      <mesh position={[0.05, 0.95, 0.2]} material={keyboardMaterial} castShadow>
        <boxGeometry args={[1.2, 0.05, 0.45]} />
      </mesh>

      <VoxelPerson
        pose="typing"
        scale={0.95}
        position={[-0.7, 0.55, 0]}
        rotation={[0, Math.PI / 2, 0]}
        color="#8fb4ff"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[15, 12]} />
        <meshStandardMaterial color="#0b0f16" roughness={1} />
      </mesh>
    </group>
  );
}
