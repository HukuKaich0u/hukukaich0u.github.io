import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readComponent = () =>
  readFile(new URL("../src/components/InkTrailBackground.astro", import.meta.url), "utf8");

test("home pages render the ink trail background", async () => {
  const jaPage = await readFile(new URL("../src/pages/index.astro", import.meta.url), "utf8");
  const enPage = await readFile(new URL("../src/pages/en/index.astro", import.meta.url), "utf8");

  assert.match(jaPage, /InkTrailBackground/);
  assert.match(enPage, /InkTrailBackground/);
});

test("ink trail background is passive and motion-aware", async () => {
  const component = await readComponent();

  assert.match(component, /pointer-events:\s*none/);
  assert.match(component, /prefers-reduced-motion:\s*reduce/);
  assert.match(component, /requestAnimationFrame/);
});

test("ink trail uses a low-resolution fluid field inspired by stable fluids", async () => {
  const component = await readComponent();

  assert.match(component, /velocityX/);
  assert.match(component, /velocityY/);
  assert.match(component, /dyeR/);
  assert.match(component, /dyeG/);
  assert.match(component, /dyeB/);
  assert.match(component, /advectField/);
});

test("ink trail injects dye and pointer force separately", async () => {
  const component = await readComponent();

  assert.match(component, /injectDye/);
  assert.match(component, /injectForce/);
  assert.match(component, /forceRadius/);
  assert.match(component, /dyeRadius/);
});

test("ink trail keeps dye amount restrained while preserving blue color balance", async () => {
  const component = await readComponent();

  assert.match(component, /const dyeGain = 0\.42/);
  assert.match(component, /0\.08 \* dyeGain \* falloff/);
  assert.match(component, /0\.2 \* dyeGain \* falloff/);
  assert.match(component, /0\.54 \* dyeGain \* falloff/);
  assert.match(component, /Math\.min\(0\.58, 0\.28 \+ distance \/ 130\)/);
});

test("ink trail simulates water-like motion instead of stamping brush images", async () => {
  const component = await readComponent();

  assert.match(component, /stepFluid/);
  assert.match(component, /velocityDissipation/);
  assert.match(component, /dyeDissipation/);
  assert.match(component, /sampleBilinear/);
  assert.doesNotMatch(component, /createWatercolorBrush/);
  assert.doesNotMatch(component, /drawWatercolorDab/);
});

test("ink trail renders blue ink from density fields", async () => {
  const component = await readComponent();

  assert.match(component, /renderFluid/);
  assert.match(component, /imageData/);
  assert.match(component, /putImageData/);
  assert.match(component, /drawImage\(simCanvas/);
});
