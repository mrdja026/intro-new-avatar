import { useMemo } from 'react';
import { useSceneStore } from '../store';
import { useTransformStore, type CharacterPose } from '../store/transforms';

const POSE_LABELS: Record<CharacterPose, string> = {
  sleeping: 'Sleeping',
  reading: 'Reading',
  coding: 'Coding',
};

type InspectorFieldProps = {
  label: string;
  values: [number, number, number];
  onChange: (next: [number, number, number]) => void;
};

function InspectorField({ label, values, onChange }: InspectorFieldProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '52px repeat(3, 1fr)', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase', color: '#8ea4ff' }}>{label}</span>
      {(['X', 'Y', 'Z'] as const).map((axis, index) => (
        <input
          key={axis}
          type="number"
          value={Number(values[index]).toFixed(2)}
          step={0.05}
          onChange={(event) => {
            const next = [...values] as [number, number, number];
            next[index] = Number(event.target.value);
            onChange(next);
          }}
          style={{
            width: '100%',
            padding: '4px 6px',
            background: 'rgba(12,16,24,0.7)',
            border: '1px solid rgba(130,148,255,0.35)',
            borderRadius: 4,
            color: '#dbe6ff',
            fontSize: 12,
          }}
        />
      ))}
    </div>
  );
}

export function TransformInspector() {
  const sceneName = useSceneStore((state) => state.sceneNames[state.sceneIndex]);
  const { activePose, transforms, setActivePose, updateTransform } = useTransformStore();
  const transform = transforms[activePose];

  const poseOptions = useMemo(() => (Object.keys(POSE_LABELS) as CharacterPose[]), []);

  return (
    <div
      style={{
        position: 'absolute',
        right: 20,
        bottom: 68,
        width: 260,
        padding: '14px 16px',
        background: 'rgba(5, 8, 14, 0.8)',
        border: '1px solid rgba(120, 140, 220, 0.35)',
        borderRadius: 12,
        backdropFilter: 'blur(12px)',
        color: '#dbe6ff',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', color: '#9fb3ff' }}>Transform Debug</div>
      <div style={{ fontSize: 11, color: '#c6d4ff', marginBottom: 4 }}>{sceneName}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {poseOptions.map((pose) => (
          <button
            key={pose}
            type="button"
            onClick={() => setActivePose(pose)}
            style={{
              flex: 1,
              padding: '4px 6px',
              background: pose === activePose ? 'rgba(120, 140, 255, 0.35)' : 'rgba(12, 16, 24, 0.7)',
              border: '1px solid rgba(130, 148, 255, 0.35)',
              borderRadius: 4,
              color: '#e8f0ff',
              fontSize: 11,
              letterSpacing: 0.3,
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {POSE_LABELS[pose]}
          </button>
        ))}
      </div>
      <InspectorField
        label="Pos"
        values={transform.position}
        onChange={(values) => updateTransform(activePose, { position: values })}
      />
      <InspectorField
        label="Rot"
        values={transform.rotation}
        onChange={(values) => updateTransform(activePose, { rotation: values })}
      />
      <InspectorField
        label="Scale"
        values={transform.scale}
        onChange={(values) => updateTransform(activePose, { scale: values })}
      />
    </div>
  );
}

