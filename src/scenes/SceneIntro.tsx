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
      color: new THREE.Color('#0f1c41'),
      emissive: new THREE.Color('#4a7dff'),
      emissiveIntensity: 0.7,
      metalness: 0.75,
      roughness: 0.22,
    });
    return material;
  }, []);

  const subtitleMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14306c'),
      emissive: new THREE.Color('#7aa9ff'),
      emissiveIntensity: 0.45,
      roughness: 0.3,
    });
    return material;
  }, []);

  const glowMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#c9dbff',
      emissive: new THREE.Color('#dff2ff'),
      emissiveIntensity: 1.4,
      roughness: 0.85,
    });
    mat.transparent = true;
    mat.opacity = 0.92;
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
      <color attach="background" args={['#d2e5ff']} />
      <fog attach="fog" args={[0xd2e5ff, 12, 28]} />

      <ambientLight intensity={0.65} color={0xf7fbff} />
      <directionalLight position={[2.4, 5.2, 3.6]} intensity={0.9} color={0xfff2d1} castShadow />
      <directionalLight position={[-4, 3.5, -2.5]} intensity={0.6} color={0x8dbaff} />
      <pointLight position={[0, 2.6, 1.8]} intensity={1.1} color={0x9acbff} />

      <mesh position={[0, 1.4, -1.2]}>
        <planeGeometry args={[6, 3.6]} />
        <primitive object={glowMaterial} />
      </mesh>

      <group ref={titleGroup}>
        <Text
          fontSize={0.95}
          letterSpacing={0.045}
          anchorX="center"
          anchorY="middle"
          material={titleMaterial}
        >
          Career Break
        </Text>
        <Text
          position={[0, -0.82, 0]}
          fontSize={0.32}
          anchorX="center"
          anchorY="middle"
          material={subtitleMaterial}
        >
          Chilling · Reading · Coding · Sleeping
        </Text>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[12, 56]} />
        <meshStandardMaterial color="#b8c9ef" roughness={0.92} metalness={0.04} />
      </mesh>

      <mesh position={[-2.4, 2.5, -2.6]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial emissive="#5a8dff" emissiveIntensity={1.6} color="#d9ecff" />
      </mesh>
      <mesh position={[2.8, 1.4, -1.2]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial emissive="#ffd19a" emissiveIntensity={1} color="#fff2dd" />
      </mesh>
    </group>
  );
}
