import { useMemo } from "react";

import { useSceneStore } from "../store";
import {
  useTransformStore,
  type CharacterPose,
  type TransformMode,
  degreesToRadiansVector,
  radiansToDegreesVector,
} from "../store/transforms";

const POSE_LABELS: Record<CharacterPose, string> = {
  sleeping: "Sleeping",
  reading: "Reading",
  coding: "Coding",
};

const MODE_LABELS: Record<TransformMode, string> = {
  translate: "Move",
  rotate: "Rotate",
  scale: "Scale",
};

type InspectorFieldProps = {
  label: string;
  values: [number, number, number];
  onChange: (next: [number, number, number]) => void;
  precision?: number;
  step?: number;
};

function InspectorField({ label, values, onChange, precision = 2, step }: InspectorFieldProps) {
  const effectiveStep = step ?? (precision === 0 ? 1 : precision <= 2 ? 0.1 : 0.1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "52px repeat(3, 1fr)", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase", color: "#8ea4ff" }}>{label}</span>
      {(["X", "Y", "Z"] as const).map((axis, index) => (
        <input
          key={axis}
          type="number"
          value={values[index].toFixed(precision)}
          step={effectiveStep}
          onChange={(event) => {
            const next = [...values] as [number, number, number];
            next[index] = Number(event.target.value);
            onChange(next);
          }}
          style={{
            width: "100%",
            padding: "4px 6px",
            background: "rgba(12,16,24,0.7)",
            border: "1px solid rgba(130,148,255,0.35)",
            borderRadius: 4,
            color: "#dbe6ff",
            fontSize: 12,
          }}
        />
      ))}
    </div>
  );
}

export function TransformInspector() {
  const sceneName = useSceneStore((state) => state.sceneNames[state.sceneIndex]);
  const {
    activePose,
    transforms,
    editMode,
    controlMode,
    setActivePose,
    setEditMode,
    setControlMode,
    updateTransform,
    saveStateSnapshot,
    loadStateSnapshot,
  } = useTransformStore();

  const transform = transforms[activePose];
  const rotationDegrees = radiansToDegreesVector(transform.rotation);

  const poseOptions = useMemo(() => Object.keys(POSE_LABELS) as CharacterPose[], []);
  const modeOptions = useMemo(() => Object.keys(MODE_LABELS) as TransformMode[], []);

  return (
    <div
      style={{
        position: "absolute",
        right: 20,
        bottom: 68,
        width: 280,
        padding: "14px 16px",
        background: "rgba(5, 8, 14, 0.85)",
        border: "1px solid rgba(120, 140, 220, 0.35)",
        borderRadius: 12,
        backdropFilter: "blur(12px)",
        color: "#dbe6ff",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", color: "#9fb3ff" }}>
            Transform Debug
          </div>
          <div style={{ fontSize: 11, color: "#c6d4ff" }}>{sceneName}</div>
        </div>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11 }}>
          <input
            type="checkbox"
            checked={editMode}
            onChange={(event) => setEditMode(event.target.checked)}
          />
          Edit
        </label>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {poseOptions.map((pose) => (
          <button
            key={pose}
            type="button"
            onClick={() => setActivePose(pose)}
            style={{
              flex: 1,
              padding: "4px 6px",
              background: pose === activePose ? "rgba(120, 140, 255, 0.35)" : "rgba(12, 16, 24, 0.7)",
              border: "1px solid rgba(130, 148, 255, 0.35)",
              borderRadius: 4,
              color: "#e8f0ff",
              fontSize: 11,
              letterSpacing: 0.3,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {POSE_LABELS[pose]}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {modeOptions.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setControlMode(mode)}
            disabled={!editMode}
            style={{
              flex: 1,
              padding: "4px 6px",
              background: controlMode === mode ? "rgba(200, 160, 255, 0.35)" : "rgba(12, 16, 24, 0.7)",
              border: "1px solid rgba(160, 130, 255, 0.35)",
              borderRadius: 4,
              color: editMode ? "#f0e6ff" : "rgba(220, 220, 220, 0.4)",
              fontSize: 11,
              letterSpacing: 0.3,
              textTransform: "uppercase",
              cursor: editMode ? "pointer" : "not-allowed",
            }}
          >
            {MODE_LABELS[mode]}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <button
          type="button"
          onClick={saveStateSnapshot}
          style={{
            flex: 1,
            padding: "4px 6px",
            background: "rgba(24, 18, 42, 0.85)",
            border: "1px solid rgba(110, 90, 210, 0.5)",
            borderRadius: 4,
            color: "#ede8ff",
            fontSize: 11,
            letterSpacing: 0.3,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Save State
        </button>
        <button
          type="button"
          onClick={loadStateSnapshot}
          style={{
            flex: 1,
            padding: "4px 6px",
            background: "rgba(14, 20, 30, 0.85)",
            border: "1px solid rgba(110, 140, 210, 0.45)",
            borderRadius: 4,
            color: "#d4e5ff",
            fontSize: 11,
            letterSpacing: 0.3,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Load State
        </button>
      </div>

      <InspectorField
        label="Pos"
        values={transform.position}
        step={0.1}
        onChange={(values) => updateTransform(activePose, { position: values })}
      />
      <InspectorField
        label="Rot (deg)"
        values={rotationDegrees}
        precision={1}
        step={5}
        onChange={(values) => updateTransform(activePose, { rotation: degreesToRadiansVector(values) })}
      />
      <InspectorField
        label="Scale"
        values={transform.scale}
        precision={2}
        step={0.02}
        onChange={(values) => updateTransform(activePose, { scale: values })}
      />
    </div>
  );
}
