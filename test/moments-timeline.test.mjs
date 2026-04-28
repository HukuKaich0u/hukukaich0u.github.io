import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readStyles = () =>
  readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");
const readMoments = () =>
  readFile(new URL("../src/data/moments.ts", import.meta.url), "utf8");

test("moments timeline rail is anchored to each item instead of content height", async () => {
  const styles = await readStyles();

  assert.match(styles, /\.toggle-section-timeline \.history-list \{[\s\S]*position:\s*relative;/);
  assert.match(styles, /\.toggle-section-timeline \.history-list::before \{/);
  assert.doesNotMatch(styles, /\.toggle-section-timeline \.history-period::after \{/);
});

test("moments are listed in reverse chronological order", async () => {
  const moments = await readMoments();

  const order = [
    'id: "progate-aws-hackathon-award"',
    'id: "joined-atlas"',
    'id: "started-serious-programming-study"',
    'id: "started-university"',
    'id: "hibiya-festival"',
    'id: "entered-hibiya-high-school"'
  ];

  const positions = order.map((entry) => moments.indexOf(entry));

  positions.reduce((previous, current) => {
    assert.notEqual(current, -1);
    assert.ok(current > previous);
    return current;
  }, -1);
});
