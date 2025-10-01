import { create } from 'zustand';

export type CharacterPose = 'sleeping' | 'reading' | 'coding';

export type TransformState = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

export type SceneTransforms = Record<CharacterPose, TransformState>;

export type TransformStore = {
  activePose: CharacterPose;
  transforms: SceneTransforms;
  setActivePose: (pose: CharacterPose) => void;
  updateTransform: (pose: CharacterPose, partial: Partial<TransformState>) => void;
};

const defaultTransforms: SceneTransforms = {
  sleeping: {
    position: [0, 0.18, -0.02],
    rotation: [Math.PI / 2, Math.PI / 2, 0.05],
    scale: [0.3, 0.3, 0.3],
  },
  reading: {
    position: [0.02, 0.16, 0],
    rotation: [Math.PI / 2.15, Math.PI / 2.1, 0.18],
    scale: [0.3, 0.3, 0.3],
  },
  coding: {
    position: [-0.1, 0.38, -0.25],
    rotation: [0, Math.PI / 2.1, 0],
    scale: [0.24, 0.24, 0.24],
  },
};

export const useTransformStore = create<TransformStore>((set) => ({
  activePose: 'sleeping',
  transforms: defaultTransforms,
  setActivePose: (pose) => set({ activePose: pose }),
  updateTransform: (pose, partial) =>
    set((state) => {
      const current = state.transforms[pose];
      return {
        transforms: {
          ...state.transforms,
          [pose]: {
            position: partial.position ?? current.position,
            rotation: partial.rotation ?? current.rotation,
            scale: partial.scale ?? current.scale,
          },
        },
      };
    }),
}));





