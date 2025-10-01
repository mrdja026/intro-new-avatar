import { create } from 'zustand';

export type ScenePose = 'Intro' | 'Sleeping' | 'Reading' | 'Coding';

export type SceneStore = {
  sceneIndex: number;
  sceneNames: ScenePose[];
  setSceneIndex: (index: number) => void;
  nextScene: () => void;
  prevScene: () => void;
};

export const SCENE_NAMES: ScenePose[] = ['Intro', 'Sleeping', 'Reading', 'Coding'];

export const useSceneStore = create<SceneStore>((set, get) => ({
  sceneIndex: 0,
  sceneNames: SCENE_NAMES,
  setSceneIndex: (index: number) => {
    const clamped = Math.max(0, Math.min(SCENE_NAMES.length - 1, Math.round(index)));
    set({ sceneIndex: clamped });
  },
  nextScene: () => {
    const { sceneIndex } = get();
    const next = (sceneIndex + 1) % SCENE_NAMES.length;
    set({ sceneIndex: next });
  },
  prevScene: () => {
    const { sceneIndex } = get();
    const prev = (sceneIndex - 1 + SCENE_NAMES.length) % SCENE_NAMES.length;
    set({ sceneIndex: prev });
  },
}));
