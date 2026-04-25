# Home Ink WebGPU Design

## Summary

Homepage background ink effect will be rebuilt around a `three.js` renderer with `WebGPU` as the preferred backend. The primary goal is smoother mouse-driven motion. A secondary goal is to preserve a watercolor-on-paper impression by adding soft bleed, grain, and feathered edges during compositing.

## Goals

- Make the homepage background feel more fluid and alive on desktop.
- Keep interaction source limited to mouse movement.
- Preserve a blue-led palette close to the current site direction.
- Prefer highest-quality rendering on supported browsers.
- Fall back cleanly on unsupported or reduced-motion environments.

## Non-Goals

- No scroll-driven or section-aware reactions.
- No mobile-first heavy simulation on coarse pointers.
- No broad redesign of homepage content structure.

## Current Context

The current [`InkTrailBackground`](/Users/KokiAoyagi/Documents/repos/personal/hukukaich0u.github.io/src/components/InkTrailBackground.astro) uses a fixed 2D canvas and CPU-side fluid approximation. It produces smooth trailing motion, but the visual language is closer to generic fluid dye than ink soaking into paper. The homepage layout, stacking, and readability constraints already work and should remain intact.

## Proposed Architecture

Replace the internals of `InkTrailBackground` with a renderer split into two layers:

1. `interaction layer`
   Captures mouse position and velocity, then converts those values into ink injection data.
2. `renderer layer`
   Runs the simulation and final compositing through `three.js`, preferring `WebGPU` when available.

The page structure stays unchanged: the background remains fixed behind header, main content, and footer.

## Rendering Pipeline

### 1. Input Pass

- Sample mouse position and delta on pointer move.
- Convert motion into localized ink injection strength.
- Keep idle decay so the surface settles naturally.

### 2. Simulation Pass

- Maintain a low-resolution ink field texture for performance.
- Update advection and diffusion on the GPU.
- Favor smooth, viscous motion over turbulent fluid behavior.
- Keep the model intentionally art-directed rather than physically exact.

### 3. Composite Pass

- Upsample the simulation into the viewport.
- Add paper grain so the fill is not perfectly smooth.
- Add edge bleed so boundaries feather unevenly into the paper.
- Add a subtle soft halo to suggest wet pigment spreading through fibers.
- Keep the palette mostly blue, using concentration and transparency shifts instead of many hues.

## Visual Direction

- Primary feel: calm, soft, watery blue ink.
- Motion feel: smooth and premium rather than noisy or explosive.
- Surface feel: paper absorption is visible at the perimeter, not just Gaussian blur.
- Blend behavior should support both light and dark themes without hurting text contrast.

## Fallback Strategy

Use this order:

1. `WebGPU` renderer through `three.js`
2. `WebGL` renderer through `three.js` with reduced effect complexity
3. Existing lightweight 2D canvas behavior or a static paper-like gradient

Heavy rendering is disabled for:

- `prefers-reduced-motion: reduce`
- `pointer: coarse`

In those cases, the site should keep a static atmospheric background only.

## Implementation Notes

- Add `three` as a dependency.
- Encapsulate renderer lifecycle inside the background component so resize, theme changes, and cleanup remain local.
- Avoid leaking renderer concerns into page sections or layout components.
- Structure shader code so the paper/composite stage can be tuned independently from the motion stage.

## Risks

- `WebGPU` support is still uneven, so fallback quality must be intentional.
- Overly strong blend modes can reduce content readability.
- Full-resolution simulation would be wasteful; the effect needs careful low-resolution scaling.

## Validation

Check these before completion:

- Desktop light theme readability remains intact.
- Desktop dark theme readability remains intact.
- Pointer motion feels smoother than the current implementation.
- Unsupported browsers fall back without visual breakage.
- Reduced-motion and coarse-pointer environments avoid the heavy effect.
- Performance stays stable enough for continuous interaction on the homepage.

## Rollout Shape

Implementation should happen in two steps:

1. Land the minimum `three.js` renderer with mouse-driven ink motion and fallback detection.
2. Layer in paper grain, feathered bleed, and composite tuning until the watercolor impression matches the target.
