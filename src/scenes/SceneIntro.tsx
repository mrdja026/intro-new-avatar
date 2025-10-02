import { useEffect, useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function SceneIntro() {
  const { camera } = useThree();
  const titleGroup = useRef<THREE.Group>(null);

  useEffect(() => {
    camera.position.set(0.4, 1.35, 5.4);
    camera.lookAt(0, 1.2, 0);
  }, [camera]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    camera.position.x = 0.4 + Math.sin(t * 0.22) * 0.45;
    camera.position.z = 5.4 - Math.cos(t * 0.28) * 0.35;
    camera.lookAt(0, 1.2 + Math.sin(t * 0.18) * 0.04, 0);

    if (titleGroup.current) {
      titleGroup.current.rotation.y = Math.sin(t * 0.25) * 0.15;
      titleGroup.current.position.y = 1.5 + Math.sin(t * 0.45) * 0.08;
    }
  });

  const titleMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1d1b2f'),
      emissive: new THREE.Color('#7a5cff'),
      emissiveIntensity: 0.6,
      metalness: 0.55,
      roughness: 0.28,
    });
    return material;
  }, []);

  const subtitleMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#636b85'),
      emissive: new THREE.Color('#a8b0ff'),
      emissiveIntensity: 0.25,
      roughness: 0.32,
    });
    return material;
  }, []);

  const glowMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#f0f2ff',
      emissive: new THREE.Color('#f4f6ff'),
      emissiveIntensity: 1.1,
      roughness: 0.9,
    });
    mat.transparent = true;
    mat.opacity = 0.95;
    return mat;
  }, []);

  useEffect(() => {
    return () => {
      titleMaterial.dispose();
      subtitleMaterial.dispose();
      glowMaterial.dispose();
    };
  }, [titleMaterial, subtitleMaterial, glowMaterial]);

  return (
    <group>
      <color attach="background" args={['#ffffff']} />
      <fog attach="fog" args={[0xf6f6ff, 18, 32]} />

      <ambientLight intensity={0.85} color={0xffffff} />
      <directionalLight position={[2.4, 5.2, 3.6]} intensity={0.65} color={0xffe9d6} castShadow />
      <directionalLight position={[-4, 3.5, -2.5]} intensity={0.5} color={0xd9e3ff} />
      <pointLight position={[0, 2.6, 1.8]} intensity={0.9} color={0xc8d3ff} />

      <mesh position={[0, 1.35, -1.2]}>
        <planeGeometry args={[6.2, 3.7]} />
        <primitive object={glowMaterial} />
      </mesh>

      <group ref={titleGroup}>
        <Text
          fontSize={0.92}
          letterSpacing={0.04}
          anchorX="center"
          anchorY="middle"
          material={titleMaterial}
        >
          Carier Break in 2025
        </Text>
        <Text
          position={[0, -0.82, 0]}
          fontSize={0.3}
          anchorX="center"
          anchorY="middle"
          material={subtitleMaterial}
        >
          Chilling - Reading - Coding - Sleeping
        </Text>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[12, 56]} />
        <meshStandardMaterial color="#ecefff" roughness={0.94} metalness={0.03} />
      </mesh>

      <mesh position={[-2.4, 2.4, -2.6]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial emissive="#8266ff" emissiveIntensity={1.2} color="#ebe5ff" />
      </mesh>
      <mesh position={[2.8, 1.4, -1.2]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial emissive="#ffb67f" emissiveIntensity={0.9} color="#fff0dd" />
      </mesh>
    </group>
  );
}
