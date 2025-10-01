import type { ComponentProps } from 'react';
import { useGLTF } from '@react-three/drei';

const COMPUTER_MODEL_URL = '/models/computer.glb';

type GroupProps = ComponentProps<'group'>;

export function ComputerModel(props: GroupProps) {
  const { scene } = useGLTF(COMPUTER_MODEL_URL);
  return <primitive object={scene} dispose={null} {...props} />;
}

useGLTF.preload(COMPUTER_MODEL_URL);
