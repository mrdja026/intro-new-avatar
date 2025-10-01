import { useEffect } from 'react';
import type { ComponentProps } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';

const SITTING_MAN_URL = '/models/sitting_man/scene.gltf';

type GroupProps = ComponentProps<'group'>;

type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

export function SittingManModel(props: GroupProps) {
  const { scene, animations } = useGLTF(SITTING_MAN_URL) as GLTFResult;
  const { ref, actions, names } = useAnimations(animations, scene);

  useEffect(() => {
    names.forEach((name) => {
      const action = actions[name];
      action?.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.2).play();
    });
    return () => {
      names.forEach((name) => actions[name]?.fadeOut(0.1));
    };
  }, [actions, names]);

  return <primitive ref={ref} object={scene} dispose={null} {...props} />;
}

useGLTF.preload(SITTING_MAN_URL);
