# Home Ink WebGPU Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage ink background with a `three.js` renderer that prefers `WebGPU`, falls back safely, and adds paper-like ink bleed.

**Architecture:** Keep [`src/components/InkTrailBackground.astro`](/Users/KokiAoyagi/Documents/repos/personal/hukukaich0u.github.io/src/components/InkTrailBackground.astro) as the mount point, but move runtime logic into focused client modules. Split responsibilities into capability detection, renderer lifecycle, and shader/composite tuning so fallback behavior and watercolor styling can evolve independently.

**Tech Stack:** Astro, `three`, browser `WebGPU`/`WebGL`, Node test runner

---

## File Map

- Modify: [`package.json`](/Users/KokiAoyagi/Documents/repos/personal/hukukaich0u.github.io/package.json)
- Modify: [`src/components/InkTrailBackground.astro`](/Users/KokiAoyagi/Documents/repos/personal/hukukaich0u.github.io/src/components/InkTrailBackground.astro)
- Create: `src/scripts/ink-trail/capabilities.ts`
- Create: `src/scripts/ink-trail/controller.ts`
- Create: `src/scripts/ink-trail/shaders.ts`
- Modify: [`test/ink-trail.test.mjs`](/Users/KokiAoyagi/Documents/repos/personal/hukukaich0u.github.io/test/ink-trail.test.mjs)

## Chunk 1: Dependency And Fallback Boundaries

### Task 1: Add renderer dependency and pure capability helpers

**Files:**
- Modify: [`package.json`](/Users/KokiAoyagi/Documents/repos/personal/hukukaich0u.github.io/package.json)
- Create: `src/scripts/ink-trail/capabilities.ts`
- Test: [`test/ink-trail.test.mjs`](/Users/KokiAoyagi/Documents/repos/personal/hukukaich0u.github.io/test/ink-trail.test.mjs)

- [ ] **Step 1: Write failing tests for capability selection**

Add cases for:

```js
assert.equal(selectInkTrailMode({
  prefersReducedMotion: true,
  coarsePointer: false,
  hasWebGPU: true,
  hasWebGL: true
}), "static");

assert.equal(selectInkTrailMode({
  prefersReducedMotion: false,
  coarsePointer: false,
  hasWebGPU: true,
  hasWebGL: true
}), "webgpu");

assert.equal(selectInkTrailMode({
  prefersReducedMotion: false,
  coarsePointer: false,
  hasWebGPU: false,
  hasWebGL: true
}), "webgl");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- test/ink-trail.test.mjs`
Expected: FAIL because `selectInkTrailMode` does not exist yet.

- [ ] **Step 3: Add dependency and minimal helper implementation**

Implement `capabilities.ts` with:

```ts
export type InkTrailMode = "static" | "webgpu" | "webgl";

export function selectInkTrailMode(input: {
  prefersReducedMotion: boolean;
  coarsePointer: boolean;
  hasWebGPU: boolean;
  hasWebGL: boolean;
}): InkTrailMode {
  if (input.prefersReducedMotion || input.coarsePointer) return "static";
  if (input.hasWebGPU) return "webgpu";
  if (input.hasWebGL) return "webgl";
  return "static";
}
```

Also add `"three"` to dependencies.

- [ ] **Step 4: Run tests to verify capability logic passes**

Run: `npm test -- test/ink-trail.test.mjs`
Expected: PASS for new mode-selection cases.

- [ ] **Step 5: Commit**

```bash
git add package.json test/ink-trail.test.mjs src/scripts/ink-trail/capabilities.ts
git commit -m "feat: add ink trail capability selection"
```

## Chunk 2: Minimum Three.js Renderer

### Task 2: Move mount logic out of inline script and boot the renderer

**Files:**
- Modify: [`src/components/InkTrailBackground.astro`](/Users/KokiAoyagi/Documents/repos/personal/hukukaich0u.github.io/src/components/InkTrailBackground.astro)
- Create: `src/scripts/ink-trail/controller.ts`
- Create: `src/scripts/ink-trail/shaders.ts`
- Modify: [`test/ink-trail.test.mjs`](/Users/KokiAoyagi/Documents/repos/personal/hukukaich0u.github.io/test/ink-trail.test.mjs)

- [ ] **Step 1: Write failing tests for controller lifecycle**

Add a narrow test seam around init/cleanup:

```js
const calls = [];
const renderer = createInkTrailController(fakeCanvas, fakeEnv, {
  onModeResolved: (mode) => calls.push(mode)
});

renderer.start();
renderer.destroy();

assert.deepEqual(calls, ["webgpu"]);
assert.equal(fakeEnv.removeListenerCalls, 1);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- test/ink-trail.test.mjs`
Expected: FAIL because controller module is missing.

- [ ] **Step 3: Implement minimal renderer boot path**

Build `controller.ts` so it:

- reads `matchMedia("(prefers-reduced-motion: reduce)")`
- reads `matchMedia("(pointer: coarse)")`
- checks `navigator.gpu`
- checks WebGL canvas context for fallback
- creates a `three` renderer for `webgpu`/`webgl`
- attaches pointermove, resize, and teardown handlers

Keep first-pass rendering minimal:

```ts
scene.background = null;
material.uniforms.uPointer.value.set(x, y, strength);
renderer.setAnimationLoop(renderFrame);
```

Update `InkTrailBackground.astro` to:

- keep the same fixed canvas contract
- switch from large inline simulation code to a small bootstrap script
- preserve current z-index and reduced-motion CSS behavior

- [ ] **Step 4: Run tests and local build**

Run: `npm test -- test/ink-trail.test.mjs`
Expected: PASS

Run: `npm run build`
Expected: PASS with no Astro build regression.

- [ ] **Step 5: Commit**

```bash
git add src/components/InkTrailBackground.astro src/scripts/ink-trail/controller.ts src/scripts/ink-trail/shaders.ts test/ink-trail.test.mjs
git commit -m "feat: bootstrap three ink trail renderer"
```

## Chunk 3: Watercolor Composite

### Task 3: Add low-resolution simulation and paper-bleed composite

**Files:**
- Modify: `src/scripts/ink-trail/controller.ts`
- Modify: `src/scripts/ink-trail/shaders.ts`
- Modify: [`test/ink-trail.test.mjs`](/Users/KokiAoyagi/Documents/repos/personal/hukukaich0u.github.io/test/ink-trail.test.mjs)

- [ ] **Step 1: Write failing tests for tuning defaults**

Add pure assertions for exported config:

```js
assert.equal(defaultInkConfig.palette.base, "#8ebdff");
assert.equal(defaultInkConfig.simulationScale, 0.125);
assert.equal(defaultInkConfig.edgeBleed, true);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- test/ink-trail.test.mjs`
Expected: FAIL because config export does not exist yet.

- [ ] **Step 3: Implement the GPU passes**

Add a low-resolution simulation target and a composite shader that includes:

- pointer injection falloff
- advection / diffusion tuned for viscous motion
- blue-led density mapping
- paper grain noise
- edge feather / bleed
- subtle wet halo

Target API shape:

```ts
export const defaultInkConfig = {
  simulationScale: 0.125,
  edgeBleed: true,
  palette: {
    base: "#8ebdff",
    dense: "#3655c9"
  }
};
```

Keep `webgl` fallback simpler by disabling the heaviest composite branches if needed, but do not change the public controller contract.

- [ ] **Step 4: Run tests and build**

Run: `npm test -- test/ink-trail.test.mjs`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/scripts/ink-trail/controller.ts src/scripts/ink-trail/shaders.ts test/ink-trail.test.mjs
git commit -m "feat: add watercolor composite for ink trail"
```

## Chunk 4: Final Verification

### Task 4: Validate fallback, readability, and motion constraints

**Files:**
- Modify: `src/scripts/ink-trail/controller.ts` if fixes are required
- Modify: [`src/components/InkTrailBackground.astro`](/Users/KokiAoyagi/Documents/repos/personal/hukukaich0u.github.io/src/components/InkTrailBackground.astro) if CSS tuning is required

- [ ] **Step 1: Run automated checks**

Run: `npm test`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 2: Manual verification**

Check:

- desktop light theme text remains readable
- desktop dark theme text remains readable
- mouse motion feels smoother than current 2D version
- non-`WebGPU` browser falls back without blank canvas
- `prefers-reduced-motion` disables the heavy effect
- coarse pointer path stays static

- [ ] **Step 3: Make minimal tuning fixes if any check fails**

Focus only on:

- blend opacity
- theme-specific intensity
- fallback selection bugs
- resize / cleanup bugs

- [ ] **Step 4: Re-run checks**

Run: `npm test`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/InkTrailBackground.astro src/scripts/ink-trail/controller.ts src/scripts/ink-trail/shaders.ts test/ink-trail.test.mjs
git commit -m "fix: tune ink trail fallbacks and readability"
```

## Notes

- Keep homepage content files unchanged unless renderer mounting actually requires a page-level hook.
- Do not reintroduce large inline simulation code in the Astro component.
- If `WebGPURenderer` import or browser support is awkward in Astro build output, keep the capability API stable and downgrade the implementation detail to `three` WebGL while preserving the fallback ladder.
- Subagent plan review was not run because this session cannot spawn reviewers without explicit user authorization.
