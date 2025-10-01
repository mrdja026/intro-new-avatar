import { useEffect, useMemo, useRef, useState } from 'react';

export type TransitionProps = {
  triggerKey: number;
  durationMs?: number;
};

export function Transition({ triggerKey, durationMs = 600 }: TransitionProps) {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];

    setVisible(true);
    const half = Math.max(1, durationMs / 2);

    setOpacity(0);
    timers.current.push(
      window.setTimeout(() => {
        setOpacity(1);
      }, 0),
    );

    timers.current.push(
      window.setTimeout(() => {
        setOpacity(0);
      }, half),
    );

    timers.current.push(
      window.setTimeout(() => {
        setVisible(false);
      }, durationMs),
    );

    return () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, [triggerKey, durationMs]);

  const style = useMemo(
    () => ({
      opacity,
      transition: `opacity ${durationMs / 2}ms ease`,
    }),
    [opacity, durationMs],
  );

  if (!visible && opacity === 0) {
    return null;
  }

  return <div className="transition-overlay" style={style} />;
}
