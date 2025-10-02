import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import type { OrbitControls as OrbitControlsImpl, TransformControls as TransformControlsImpl } from 'three-stdlib';

type DraggingChangedEvent = {
  value: boolean;
};

type TransformControlsWithEvents = TransformControlsImpl & {
  addEventListener: (type: 'dragging-changed', listener: (event: DraggingChangedEvent) => void) => void;
  removeEventListener: (type: 'dragging-changed', listener: (event: DraggingChangedEvent) => void) => void;
};

export function useTransformOrbitLock(
  controlsRef: MutableRefObject<TransformControlsImpl | null>,
  active: boolean,
) {
  const { controls } = useThree();

  useEffect(() => {
    const orbit = controls as OrbitControlsImpl | undefined;
    if (!orbit) {
      return;
    }

    if (!active) {
      orbit.enabled = true;
      return;
    }

    const transformControls = controlsRef.current as TransformControlsWithEvents | null;
    if (!transformControls) {
      return;
    }

    const handleDrag = (event: DraggingChangedEvent) => {
      orbit.enabled = !event.value;
    };

    transformControls.addEventListener('dragging-changed', handleDrag);

    return () => {
      transformControls.removeEventListener('dragging-changed', handleDrag);
      orbit.enabled = true;
    };
  }, [controls, controlsRef, active]);
}
