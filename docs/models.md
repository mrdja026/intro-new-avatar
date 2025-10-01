# ✅ CODEX PROMPT: Add a Low-Poly Model (Bed Example)

You are a senior Three.js + React developer. Update the existing **voxel career break film** (React + Vite + React-Three-Fiber + Drei + Zustand) to support **imported GLTF models** in addition to voxel primitives. Demonstrate this by adding a **low-poly bed model** for the “Sleeping” and “Reading” scenes.

## Requirements

1. **Dependencies**

   - Already installed: `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`.
   - Add `three-stdlib` if not present.

   ```bash
   npm i three-stdlib
   ```

2. **Asset Setup**

   - Create a folder `public/models/`.
   - Place a placeholder model `bed.glb` there (Codex should generate a dummy cube export or instructions to download a free low-poly bed from Sketchfab/PolyPizza and save it as `public/models/bed.glb`).
   - Ensure Vite copies from `public/`.

3. **New Component: `BedModel.tsx`**

   - Uses Drei’s `useGLTF` to load `/models/bed.glb`.
   - Returns a `<primitive object={scene} />` with scale + rotation props.
   - Typescript safe.

   ```tsx
   import { useGLTF } from "@react-three/drei";

   export function BedModel(props: JSX.IntrinsicElements["group"]) {
     const { scene } = useGLTF("/models/bed.glb");
     return <primitive object={scene} {...props} />;
   }

   useGLTF.preload("/models/bed.glb");
   ```

4. **Scene Integration**

   - In `SceneSleep.tsx`:

     - Replace voxel bed with `<BedModel position={[0,0,0]} scale={0.8} />`.

   - In `SceneRead.tsx`:

     - Same `<BedModel>` behind the voxel person.

   - Keep voxel person + floating “Zzz” / glowing book.

5. **File Tree Additions**

   ```
   src/
     components/
       BedModel.tsx
   public/
     models/
       bed.glb
   ```

6. **Run Instructions**

   ```bash
   npm run dev
   # open http://localhost:5173
   # Switch to Sleep (scene 2) or Read (scene 3) and you’ll see imported BedModel instead of voxel bed
   ```

---

### Deliverables

- **Full contents** for `src/components/BedModel.tsx`.
- Updated code snippets in `SceneSleep.tsx` and `SceneRead.tsx` showing how `BedModel` replaces voxel bed.
- A stub `public/models/bed.glb` (Codex may generate a cube as placeholder, but instruct the user to swap it with a real downloaded low-poly bed later).

---

⚡ End of prompt. Codex should output:

1. Terminal command to add `three-stdlib` (if missing).
2. New file `src/components/BedModel.tsx`.
3. Updated `SceneSleep.tsx` and `SceneRead.tsx`.
4. Instruction about adding `public/models/bed.glb` manually.

---

Do you want me to also prep a **second example** (like swapping in a low-poly desk + monitor for the coding scene) so you see how to scale beyond just the bed?
