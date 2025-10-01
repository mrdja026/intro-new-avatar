Alright 🚀 let’s extend the Codex prompt so you can **swap in both a low-poly bed (for Sleep/Read scenes)** _and_ a **low-poly desk + monitor (for Code scene)**. This way you’ll have a full pattern for mixing voxel characters with imported props.

---

# ✅ CODEX PROMPT: Import Bed + Desk/Monitor Models into the Voxel Film

You are a senior React Three Fiber developer. Update the existing **voxel career break film** project so that some voxel props are replaced by **imported GLTF models**. Show this with two examples:

1. **Bed** (for `SceneSleep` and `SceneRead`)
2. **Desk + Monitor** (for `SceneCode`)

Use free/placeholder `.glb` files that can later be replaced by real low-poly assets.

---

## Requirements

### 1. Dependencies

Already installed:

- `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`

Add `three-stdlib` if not present:

```bash
npm i three-stdlib
```

### 2. Asset Setup

- Create folder `public/models/`
- Add placeholders:

  - `bed.glb` → any cube exported as `.glb` (placeholder)
  - `desk.glb` → cube stretched flat
  - `monitor.glb` → thin rectangle

⚠️ Codex should generate instructions or dummy geometry exports; user will later replace with real low-poly GLTFs from Sketchfab/PolyPizza.

### 3. New Components

Create these in `src/components/`:

**`BedModel.tsx`**

```tsx
import { useGLTF } from "@react-three/drei";

export function BedModel(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/models/bed.glb");
  return <primitive object={scene} {...props} />;
}
useGLTF.preload("/models/bed.glb");
```

**`DeskModel.tsx`**

```tsx
import { useGLTF } from "@react-three/drei";

export function DeskModel(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/models/desk.glb");
  return <primitive object={scene} {...props} />;
}
useGLTF.preload("/models/desk.glb");
```

**`MonitorModel.tsx`**

```tsx
import { useGLTF } from "@react-three/drei";

export function MonitorModel(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/models/monitor.glb");
  return <primitive object={scene} {...props} />;
}
useGLTF.preload("/models/monitor.glb");
```

### 4. Scene Integration

**`SceneSleep.tsx`**

```tsx
import { BedModel } from "../components/BedModel";
// ...
<Group>
  <BedModel position={[0, 0, 0]} scale={0.8} />
  {/* Voxel person in sleeping pose */}
  {/* Floating Zzz text */}
</Group>;
```

**`SceneRead.tsx`**

```tsx
import { BedModel } from "../components/BedModel";
// ...
<Group>
  <BedModel position={[0, 0, 0]} scale={0.8} />
  {/* Voxel person in reading pose */}
  {/* Book aura effect */}
</Group>;
```

**`SceneCode.tsx`**

```tsx
import { DeskModel } from "../components/DeskModel";
import { MonitorModel } from "../components/MonitorModel";
// ...
<Group>
  <DeskModel position={[0, 0, 0]} scale={1.2} />
  <MonitorModel position={[0, 1.2, -0.5]} scale={0.7} />
  {/* Voxel person typing in chair */}
  {/* Shader screen overlay on monitor */}
</Group>;
```

### 5. File Tree Additions

```
public/
  models/
    bed.glb
    desk.glb
    monitor.glb
src/
  components/
    BedModel.tsx
    DeskModel.tsx
    MonitorModel.tsx
```

### 6. Run Instructions

```bash
npm run dev
# open http://localhost:5173
# Switch scenes with Space/Shift+Space
# Sleep/Read use BedModel
# Code uses DeskModel + MonitorModel
```

---

## Deliverables

1. Terminal command to install missing deps (`three-stdlib`).
2. New files `BedModel.tsx`, `DeskModel.tsx`, `MonitorModel.tsx`.
3. Updated snippets for `SceneSleep.tsx`, `SceneRead.tsx`, `SceneCode.tsx`.
4. Instructions to put dummy `.glb` files in `public/models/` now and replace with real low-poly assets later.

---

⚡ End of prompt. Codex should output the full code contents of new files + integration updates, ready to run.

---

👉 Do you want me to also include an **example shader screen on the imported monitor** (so the monitor model has an actual glowing screen with code-rain shader attached)?
