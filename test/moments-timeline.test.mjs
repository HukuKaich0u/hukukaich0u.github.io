import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readStyles = () =>
  readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");

test("moments timeline rail is anchored to each item instead of content height", async () => {
  const styles = await readStyles();

  assert.match(styles, /\.toggle-section-timeline \.history-list \{[\s\S]*position:\s*relative;/);
  assert.match(styles, /\.toggle-section-timeline \.history-list::before \{/);
  assert.doesNotMatch(styles, /\.toggle-section-timeline \.history-period::after \{/);
});
