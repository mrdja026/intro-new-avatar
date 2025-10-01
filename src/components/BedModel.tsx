import type { ComponentProps } from 'react';
import { useGLTF } from '@react-three/drei';

const BED_MODEL_URL = '/models/bed-single.glb';

type GroupProps = ComponentProps<'group'>;

export function BedModel(props: GroupProps) {
  const { scene } = useGLTF(BED_MODEL_URL);
  return <primitive object={scene} dispose={null} {...props} />;
}

useGLTF.preload(BED_MODEL_URL);
