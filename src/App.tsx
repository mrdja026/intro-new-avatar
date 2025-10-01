import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { Hud } from './components/Hud';
import { Transition } from './components/Transition';
import { useSceneStore } from './store';
import { SceneCode } from './scenes/SceneCode';
import { SceneIntro } from './scenes/SceneIntro';
import { SceneRead } from './scenes/SceneRead';
import { SceneSleep } from './scenes/SceneSleep';

const sceneComponents = [SceneIntro, SceneSleep, SceneRead, SceneCode] as const;

function App() {
  const sceneIndex = useSceneStore((state) => state.sceneIndex);
  const nextScene = useSceneStore((state) => state.nextScene);
  const prevScene = useSceneStore((state) => state.prevScene);
  const sceneNames = useSceneStore((state) => state.sceneNames);

  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    setTransitionKey((value) => value + 1);
  }, [sceneIndex]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;
      event.preventDefault();
      if (event.shiftKey) {
        prevScene();
      } else {
        nextScene();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextScene, prevScene]);

  const CurrentScene = useMemo(() => sceneComponents[sceneIndex] ?? SceneIntro, [sceneIndex]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.2, 6], fov: 55 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={[0x050608]} />
        <Suspense fallback={null}>
          <CurrentScene />
        </Suspense>
      </Canvas>
      <Hud />
      <Transition triggerKey={transitionKey} durationMs={600} />
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          right: 20,
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(226, 235, 255, 0.45)',
        }}
      >
        {sceneNames[sceneIndex]}
      </div>
    </div>
  );
}

export default App;

