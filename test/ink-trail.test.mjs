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

test("ink trail dampens velocity quickly to avoid slippery motion", async () => {
  const component = await readComponent();

  assert.match(component, /const velocityDissipation = 0\.92/);
  assert.match(component, /advectField\(velocityX, nextVelocityX, 0\.62, velocityDissipation\)/);
  assert.match(component, /advectField\(velocityY, nextVelocityY, 0\.62, velocityDissipation\)/);
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

test("ink trail limits diffusion and adds dry ink grain", async () => {
  const component = await readComponent();

  assert.match(component, /const forceScale = 10/);
  assert.match(component, /const dyeRadius = 0\.032/);
  assert.match(component, /const renderAlphaScale = 185/);
  assert.match(component, /const dryGrain/);
  assert.match(component, /paperGrain/);
  assert.match(component, /advectField\(dyeR, nextDyeR, 0\.38, dyeDissipation\)/);
});

test("ink trail darkens blue ink as density builds up", async () => {
  const component = await readComponent();

  assert.match(component, /const saturation = Math\.min\(1, density \* 1\.85\)/);
  assert.match(component, /const paleInk = \{ r: 122, g: 154, b: 238 \}/);
  assert.match(component, /const denseInk = \{ r: 58, g: 78, b: 207 \}/);
  assert.match(component, /pixels\[p \+ 2\] = paleInk\.b \* \(1 - saturation\) \+ denseInk\.b \* saturation/);
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
