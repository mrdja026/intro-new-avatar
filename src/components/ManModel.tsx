import type { ComponentProps } from 'react';
import { useGLTF } from '@react-three/drei';

const MAN_MODEL_URL = '/models/man.glb';

type GroupProps = ComponentProps<'group'>;

export function ManModel(props: GroupProps) {
  const { scene } = useGLTF(MAN_MODEL_URL);
  return <primitive object={scene} dispose={null} {...props} />;
}

useGLTF.preload(MAN_MODEL_URL);
