import { useEffect, useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function SceneIntro() {
  const { camera } = useThree();
  const titleGroup = useRef<THREE.Group>(null);

  useEffect(() => {
    camera.position.set(0, 1.25, 6);
    camera.lookAt(0, 1.1, 0);
  }, [camera]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.25) * 0.4;
    camera.position.z = 6 - Math.cos(t * 0.35) * 0.35;
    camera.lookAt(0, 1.05, 0);

    if (titleGroup.current) {
      titleGroup.current.rotation.y = Math.sin(t * 0.3) * 0.12;
      titleGroup.current.position.y = 1.4 + Math.sin(t * 0.5) * 0.05;
    }
  });

  const titleMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color('#e0f1ff') });
    material.metalness = 1;
    material.roughness = 0.18;
    material.envMapIntensity = 1.2;
    return material;
  }, []);

  const subtitleMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color('#9eb8ff') });
    material.metalness = 0.6;
    material.roughness = 0.3;
    return material;
  }, []);

  useEffect(() => {
    return () => {
      titleMaterial.dispose();
      subtitleMaterial.dispose();
    };
  }, [titleMaterial, subtitleMaterial]);

  return (
    <group>
      <color attach="background" args={[0x050608]} />
      <fog attach="fog" args={[0x050608, 10, 24]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color={0xc8e0ff} />
      <directionalLight position={[-5, 3, -3]} intensity={0.6} color={0x304070} />
      <pointLight position={[0, 2.2, 1.8]} intensity={1.4} color={0x8bccff} />

      <group ref={titleGroup}>
        <Text
          fontSize={0.8}
          letterSpacing={0.04}
          anchorX="center"
          anchorY="middle"
          material={titleMaterial}
        >
          Career Break
        </Text>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.28}
          anchorX="center"
          anchorY="middle"
          material={subtitleMaterial}
        >
          chilling • reading • coding • sleeping
        </Text>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[10, 48]} />
        <meshStandardMaterial color="#101522" roughness={0.8} metalness={0.1} />
      </mesh>

      <mesh position={[-2.2, 2.4, -2.8]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial emissive="#3f66ff" emissiveIntensity={1.4} color="#101020" />
      </mesh>
      <mesh position={[2.6, 1.6, -1.4]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial emissive="#ff9d5c" emissiveIntensity={0.9} color="#281910" />
      </mesh>
    </group>
  );
}
