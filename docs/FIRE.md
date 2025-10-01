Great 🔥 let’s extend the Codex prompt one more time so that the **imported monitor model** has a **glowing animated screen** — using the **code rain shader** you already scoped earlier. This way your “coding scene” feels alive, not just static geometry.

---

# ✅ CODEX PROMPT: Monitor Model + Shader Screen (Code Rain Effect)

You are a senior React Three Fiber + GLSL developer. Update the voxel career break film so the imported **MonitorModel** displays an **animated code rain shader** on its screen.

---

## Requirements

### 1. Monitor Model Setup

- Keep `MonitorModel.tsx` as before, but modify so it exposes a **child `<mesh>` for the screen area**.
- The screen area should be a **plane** attached in front of the monitor (instead of requiring UVs from the imported GLB).

### 2. Shader File

Create `src/shaders/codeRain.ts` with a simple GLSL shader:

```ts
export const codeRainVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const codeRainFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float iTime;

  float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    // vertical stripes moving down
    float speed = 0.5;
    float y = fract(vUv.y + iTime * speed);
    float brightness = step(0.95, rand(vec2(vUv.x*40.0, floor(y*40.0))));
    gl_FragColor = vec4(0.0, 1.0, 0.0, brightness);
  }
`;
```

### 3. Screen Component

Create `ShaderScreen.tsx` in `src/components/`:

```tsx
import { useRef } from "react";
import { ShaderMaterial } from "three";
import { useFrame } from "@react-three/fiber";
import { codeRainVertex, codeRainFragment } from "../shaders/codeRain";

export function ShaderScreen(props: JSX.IntrinsicElements["mesh"]) {
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh {...props}>
      <planeGeometry args={[1.2, 0.8]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={codeRainVertex}
        fragmentShader={codeRainFragment}
        uniforms={{ iTime: { value: 0 } }}
      />
    </mesh>
  );
}
```

### 4. Integrating into Monitor

Update `MonitorModel.tsx`:

```tsx
import { useGLTF } from "@react-three/drei";
import { ShaderScreen } from "./ShaderScreen";

export function MonitorModel(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/models/monitor.glb");

  return (
    <group {...props}>
      <primitive object={scene} />
      {/* Attach shader screen in front of monitor */}
      <ShaderScreen position={[0, 0.6, 0.05]} />
    </group>
  );
}

useGLTF.preload("/models/monitor.glb");
```

### 5. Scene Integration

In `SceneCode.tsx`, nothing changes except you keep using `<MonitorModel />`. The shader will render automatically inside it.

---

## File Tree Additions

```
src/
  components/
    ShaderScreen.tsx
  shaders/
    codeRain.ts
```

---

## Run Instructions

```bash
npm run dev
# Open http://localhost:5173
# Switch to the Coding scene → the imported monitor now shows green Matrix-like code rain animation
```

---

## Deliverables

1. Full contents for `src/shaders/codeRain.ts`.
2. Full contents for `src/components/ShaderScreen.tsx`.
3. Updated `src/components/MonitorModel.tsx` to include the shader screen.
4. Confirmation that `SceneCode.tsx` continues to render `<MonitorModel />` as before.

---

⚡ End of prompt. Codex should output these new files and updates fully.

---

👉 Do you also want me to add a **glow effect (postprocessing bloom or emissive screen)** so the monitor light softly illuminates the voxel person, or keep it flat shader-only for now?
