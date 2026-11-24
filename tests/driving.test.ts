import test from "node:test";
import assert from "node:assert/strict";
import {
  near,
  park,
  plots,
  roadSafe,
  spawn,
  stepDrive,
  type Pose,
} from "../src/driving";
function run(p: Pose, keys: string[], frames: number) {
  const input = new Set(keys);
  for (let i = 0; i < frames; i++) {
    stepDrive(p, input);
    assert.ok(roadSafe(p.x, p.z));
  }
}
test("every destination parks safely within range of the selected building", () => {
  for (const { id } of plots) {
    const p = park(id);
    assert.ok(roadSafe(p.x, p.z));
    assert.equal(near(p), id);
  }
});
test("accelerate, brake, reverse and coast to rest", () => {
  const p = spawn();
  run(p, ["KeyW"], 60);
  assert.ok(p.speed > 5 && p.z < 8);
  run(p, ["Space"], 45);
  assert.equal(p.speed, 0);
  const start = p.z;
  run(p, ["ArrowDown"], 80);
  assert.equal(p.speed, -4);
  assert.ok(p.z > start);
  run(p, [], 120);
  assert.equal(Math.abs(p.speed), 0);
});
test("boost cap, steering and continuous collision against plots and island edges", () => {
  const p = { ...spawn(), z: 25 };
  run(p, ["KeyW", "ShiftLeft"], 150);
  assert.equal(p.speed, 13);
  run(p, ["KeyW", "KeyA"], 30);
  assert.ok(p.heading > 0);
  const wall = { ...spawn(), z: 0, heading: Math.PI / 2 };
  run(wall, ["KeyW"], 300);
  assert.ok(wall.x > 4.7);
  const edge = { ...spawn(), z: -25 };
  run(edge, ["KeyW"], 300);
  assert.ok(edge.z >= -25.6);
});
