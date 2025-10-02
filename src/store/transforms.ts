import { MathUtils } from 'three';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CharacterPose = 'sleeping' | 'reading' | 'coding';
export type TransformMode = 'translate' | 'rotate' | 'scale';

export type TransformState = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

export type SceneTransforms = Record<CharacterPose, TransformState>;

export type CameraState = {
  position: [number, number, number];
  target: [number, number, number];
};

export type SceneCameras = Record<CharacterPose, CameraState>;

export type TransformStore = {
  activePose: CharacterPose;
  transforms: SceneTransforms;
  cameras: SceneCameras;
  editMode: boolean;
  controlMode: TransformMode;
  setActivePose: (pose: CharacterPose) => void;
  setEditMode: (value: boolean) => void;
  setControlMode: (mode: TransformMode) => void;
  updateTransform: (pose: CharacterPose, partial: Partial<TransformState>) => void;
  setCameraState: (pose: CharacterPose, camera: CameraState) => void;
  resetSceneState: () => void;
  saveStateSnapshot: () => void;
  loadStateSnapshot: () => void;
};

const STORAGE_KEY = 'three-vibe-film:scene-state:v1';
const POSES: CharacterPose[] = ['sleeping', 'reading', 'coding'];

const TRANSFORM_TEMPLATE: SceneTransforms = {
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

const CAMERA_TEMPLATE: SceneCameras = {
  sleeping: {
    position: [2, 1.5, 3.1],
    target: [0.15, 1, -0.05],
  },
  reading: {
    position: [-2.1, 1.65, 3],
    target: [0.1, 1, 0.15],
  },
  coding: {
    position: [2, 1.6, 2.9],
    target: [0.05, 1.05, 0],
  },
};

const EPSILON = 1e-6;

type PersistedSnapshot = {
  transforms: SceneTransforms;
  cameras: SceneCameras;
};

function cloneVector(source: [number, number, number]): [number, number, number] {
  return [source[0], source[1], source[2]];
}

function cloneTransformState(state: TransformState): TransformState {
  return {
    position: cloneVector(state.position),
    rotation: cloneVector(state.rotation),
    scale: cloneVector(state.scale),
  };
}

function cloneCameraState(state: CameraState): CameraState {
  return {
    position: cloneVector(state.position),
    target: cloneVector(state.target),
  };
}

function createDefaultTransforms(): SceneTransforms {
  return {
    sleeping: cloneTransformState(TRANSFORM_TEMPLATE.sleeping),
    reading: cloneTransformState(TRANSFORM_TEMPLATE.reading),
    coding: cloneTransformState(TRANSFORM_TEMPLATE.coding),
  };
}

function createDefaultCameras(): SceneCameras {
  return {
    sleeping: cloneCameraState(CAMERA_TEMPLATE.sleeping),
    reading: cloneCameraState(CAMERA_TEMPLATE.reading),
    coding: cloneCameraState(CAMERA_TEMPLATE.coding),
  };
}

function isVector3(value: unknown): value is [number, number, number] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((item) => typeof item === 'number' && Number.isFinite(item))
  );
}

function vectorFromUnknown(value: unknown, fallback: [number, number, number]): [number, number, number] {
  return isVector3(value) ? [value[0], value[1], value[2]] : cloneVector(fallback);
}

function hydrateTransforms(raw: unknown): SceneTransforms {
  const source = (raw ?? {}) as Record<string, unknown>;
  const result = {} as SceneTransforms;
  for (const pose of POSES) {
    const template = TRANSFORM_TEMPLATE[pose];
    const candidate = (source[pose] ?? {}) as Record<string, unknown>;
    result[pose] = {
      position: vectorFromUnknown(candidate.position, template.position),
      rotation: vectorFromUnknown(candidate.rotation, template.rotation),
      scale: vectorFromUnknown(candidate.scale, template.scale),
    };
  }
  return result;
}

function hydrateCameras(raw: unknown): SceneCameras {
  const source = (raw ?? {}) as Record<string, unknown>;
  const result = {} as SceneCameras;
  for (const pose of POSES) {
    const template = CAMERA_TEMPLATE[pose];
    const candidate = (source[pose] ?? {}) as Record<string, unknown>;
    result[pose] = {
      position: vectorFromUnknown(candidate.position, template.position),
      target: vectorFromUnknown(candidate.target, template.target),
    };
  }
  return result;
}

function vectorsEqual(a: [number, number, number], b: [number, number, number]): boolean {
  return (
    Math.abs(a[0] - b[0]) <= EPSILON &&
    Math.abs(a[1] - b[1]) <= EPSILON &&
    Math.abs(a[2] - b[2]) <= EPSILON
  );
}

export const useTransformStore = create<TransformStore>()(
  persist(
    (set, get) => ({
      activePose: 'sleeping',
      transforms: createDefaultTransforms(),
      cameras: createDefaultCameras(),
      editMode: false,
      controlMode: 'translate',
      setActivePose: (pose) => set({ activePose: pose }),
      setEditMode: (value) => set({ editMode: value }),
      setControlMode: (mode) => set({ controlMode: mode }),
      updateTransform: (pose, partial) => {
        const current = get().transforms[pose];
        const next: TransformState = {
          position: cloneVector(partial.position ?? current.position),
          rotation: cloneVector(partial.rotation ?? current.rotation),
          scale: cloneVector(partial.scale ?? current.scale),
        };

        if (
          vectorsEqual(next.position, current.position) &&
          vectorsEqual(next.rotation, current.rotation) &&
          vectorsEqual(next.scale, current.scale)
        ) {
          return;
        }

        set((state) => ({
          transforms: {
            ...state.transforms,
            [pose]: next,
          },
        }));
      },
      setCameraState: (pose, camera) => {
        const current = get().cameras[pose];
        if (
          vectorsEqual(camera.position, current.position) &&
          vectorsEqual(camera.target, current.target)
        ) {
          return;
        }

        set((state) => ({
          cameras: {
            ...state.cameras,
            [pose]: {
              position: cloneVector(camera.position),
              target: cloneVector(camera.target),
            },
          },
        }));
      },
      resetSceneState: () =>
        set(() => ({
          transforms: createDefaultTransforms(),
          cameras: createDefaultCameras(),
        })),
      saveStateSnapshot: () => {
        if (typeof window === 'undefined') {
          return;
        }
        try {
          const snapshot: PersistedSnapshot = {
            transforms: get().transforms,
            cameras: get().cameras,
          };
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        } catch (error) {
          console.warn('Failed to persist transform state', error);
        }
      },
      loadStateSnapshot: () => {
        if (typeof window === 'undefined') {
          return;
        }
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (!raw) {
            return;
          }
          const parsed = JSON.parse(raw) as Partial<PersistedSnapshot>;
          set((state) => ({
            ...state,
            transforms: hydrateTransforms(parsed?.transforms),
            cameras: hydrateCameras(parsed?.cameras),
          }));
        } catch (error) {
          console.warn('Failed to hydrate transform state', error);
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: typeof window === 'undefined' ? undefined : createJSONStorage(() => window.localStorage),
      partialize: (state) => ({
        transforms: state.transforms,
        cameras: state.cameras,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<PersistedSnapshot> | undefined;
        return {
          ...currentState,
          transforms: hydrateTransforms(persisted?.transforms),
          cameras: hydrateCameras(persisted?.cameras),
        };
      },
    },
  ),
);

export function degreesToRadiansVector(values: [number, number, number]): [number, number, number] {
  return [
    MathUtils.degToRad(values[0]),
    MathUtils.degToRad(values[1]),
    MathUtils.degToRad(values[2]),
  ];
}

export function radiansToDegreesVector(values: [number, number, number]): [number, number, number] {
  return [
    MathUtils.radToDeg(values[0]),
    MathUtils.radToDeg(values[1]),
    MathUtils.radToDeg(values[2]),
  ];
}
