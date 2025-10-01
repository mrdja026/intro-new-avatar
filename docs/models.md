# Models & Components

## Core Characters
- `src/components/VoxelPerson.tsx` renders the blocky avatar used in the intro, sleep, and read scenes. Limbs and head are box primitives that respond to the `pose` prop (`'sleeping' | 'reading' | 'typing'`). The component exposes optional `scale` and `color` overrides and animates arms while typing via `useFrame`.
- `src/components/SmoothPerson.tsx` provides the rounded low-poly variant for the coding vignette. It is built from cylinders, spheres, and a torus collar, with subtle typing motion baked in. Swap this in when you need a softer silhouette without rewriting scene logic.

## Shared Room Shell
- Both `src/scenes/SceneSleep.tsx` and `src/scenes/SceneRead.tsx` share the same warm bedroom set: walls, trims, window glow, rug, nightstand, lamp, and plant are all combinations of boxes, cylinders, and cones. Camera easing is handled with `useFrame` to keep slow orbits consistent between scenes.
- The reading scene positions the `VoxelPerson` with the `reading` pose and adds a glowing tablet (simple emissive box) plus three `AuraParticle` planes that orbit above the screen for a gentle shine.
- The sleep scene reuses the voxel bed layout and layers floating `FloatingZ` text meshes. Each `Z` owns its own randomised drift path so the spacing stays organic across transitions.

## Coding Studio Set
- `src/scenes/SceneCode.tsx` composes a matching room shell, a multi-part desk (`deskMaterial` for the top, `deskBaseMaterial` for supports), and a monitor that hosts the `codeRain` shader from `src/shaders/codeRain.ts`. The `Lightbulb` component (`src/components/Lightbulb.tsx`) spawns emissive bulbs that orbit the coder, each with its own point light.
- The same scene swaps in the `SmoothPerson` and the existing `VoxelPerson` typing pose (for animation reuse) so you can choose whichever silhouette suits the shot.

## Effects & Utilities
- `src/components/Transition.tsx` handles the fade-to-black overlay during scene swaps. Use the `triggerKey` pattern if you add more stateful transitions.
- `src/components/Hud.tsx` renders the on-screen controls; scene names flow from the zustand store in `src/store.ts` so any new scene should register there.
- `src/utils/random.ts` houses the deterministic helper used by the floating Zs and other looping particles, helping keep animations stable between reloads.

## Extending the Library
- New props should follow the existing naming (`pose`, `color`, `durationMs`) and default to lightweight primitives so the bundle stays GLTF-free.
- When building an additional vignette, start by reusing one of the room shells, then compose new props beside the existing components to stay consistent with the project’s cosy visual language.


