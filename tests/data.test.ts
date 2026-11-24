import test from "node:test";
import assert from "node:assert/strict";
import { repos, districtCount } from "../src/data";
test("each building maps to one unique fictional repository", () => {
  assert.equal(repos.length, 25);
  assert.equal(new Set(repos.map((r) => r.id)).size, repos.length);
  assert.equal(new Set(repos.map((r) => r.name)).size, repos.length);
  assert.ok(
    repos.every((r) => r.owner === "demo-labs" && r.size > 0 && r.stars >= 0),
  );
});
test("all five language districts have a consistent accent", () => {
  const palette = new Map(repos.map((r) => [r.district, r.color]));
  assert.equal(palette.size, districtCount);
  assert.equal(new Set(palette.values()).size, districtCount);
  assert.ok(repos.every((r) => palette.get(r.district) === r.color));
});
