import type { ComponentProps } from 'react';
import { useGLTF } from '@react-three/drei';

const ROOM_MODEL_URL = '/models/room.glb';

type GroupProps = ComponentProps<'group'>;

export function RoomModel(props: GroupProps) {
  const { scene } = useGLTF(ROOM_MODEL_URL);
  return <primitive object={scene} dispose={null} {...props} />;
}

useGLTF.preload(ROOM_MODEL_URL);
