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
      color: new THREE.Color('#6b4cf0'),
      emissive: new THREE.Color('#6b4cf0'),
      emissiveIntensity: 0.75,
      metalness: 0.35,
      roughness: 0.22,
    });
    return material;
  }, []);

  const subtitleMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2f3c4a'),
      emissive: new THREE.Color('#a1bdc7'),
      emissiveIntensity: 0.35,
      roughness: 0.32,
    });
    return material;
  }, []);

  const glowMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#f2ece0',
      emissive: new THREE.Color('#fbf4e6'),
      emissiveIntensity: 0.95,
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
      <color attach="background" args={['#dfd7c5']} />
      <fog attach="fog" args={[0xdfd7c5, 18, 32]} />

      <ambientLight intensity={0.75} color={0xdfd7c5} />
      <directionalLight position={[2.4, 5.2, 3.6]} intensity={0.6} color={0xffe2c6} castShadow />
      <directionalLight position={[-4, 3.5, -2.5]} intensity={0.45} color={0xbecbdb} />
      <pointLight position={[0, 2.6, 1.8]} intensity={0.85} color={0xa1bdc7} />

      <mesh position={[0, 1.35, -1.2]}>
        <planeGeometry args={[6.4, 3.9]} />
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
        <meshStandardMaterial color="#efe5d3" roughness={0.93} metalness={0.04} />
      </mesh>

      <mesh position={[-2.4, 2.4, -2.6]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial emissive="#6b4cf0" emissiveIntensity={1.1} color="#d8c8ff" />
      </mesh>
      <mesh position={[2.8, 1.4, -1.2]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial emissive="#d38a54" emissiveIntensity={0.8} color="#f5d6b4" />
      </mesh>
    </group>
  );
}
