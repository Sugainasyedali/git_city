import * as T from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { near, park, plots, spawn, stepDrive, timestep } from "./driving";
export type View = "Chase" | "Overhead";
export type Telemetry = {
  x: number;
  z: number;
  heading: number;
  speed: number;
  nearby: number;
};
export function createVehicle(scene: T.Scene) {
  const car = new T.Group(),
    body = new T.Group();
  car.add(body);
  scene.add(car);
  car.visible = false;
  const part = (
    parent: T.Object3D,
    g: T.BufferGeometry,
    color: number,
    x: number,
    y: number,
    z: number,
    lit = false,
  ) => {
    const material = lit
      ? new T.MeshBasicMaterial({ color })
      : new T.MeshStandardMaterial({ color, metalness: 0.4, roughness: 0.36 });
    const m = new T.Mesh(g, material);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const box = (w: number, h: number, d: number) => new T.BoxGeometry(w, h, d);
  // Cross sections taper the nose, shoulders and glazed fastback canopy.
  function hull(sections: number[][]) {
    const vertices: T.Vector3[] = [];
    for (const [z, width, bottom, top, roofWidth] of sections) {
      for (const side of [-1, 1]) {
        vertices.push(new T.Vector3(side * width, bottom, z));
        vertices.push(new T.Vector3(side * roofWidth, top, z));
      }
    }
    return new ConvexGeometry(vertices);
  }
  part(
    body,
    hull([
      [-0.67, 0.23, 0.13, 0.2, 0.24],
      [-0.43, 0.33, 0.11, 0.26, 0.29],
      [0.23, 0.35, 0.11, 0.31, 0.3],
      [0.62, 0.29, 0.14, 0.25, 0.27],
    ]),
    0x28d6c7,
    0,
    0,
    0,
  );
  part(
    body,
    hull([
      [-0.34, 0.23, 0.24, 0.26, 0.21],
      [-0.06, 0.25, 0.24, 0.425, 0.17],
      [0.14, 0.24, 0.24, 0.412, 0.17],
      [0.4, 0.23, 0.25, 0.28, 0.2],
    ]),
    0x263d53,
    0,
    0,
    0,
  );
  part(body, box(0.63, 0.045, 0.12), 0x203046, 0, 0.36, 0.545);
  for (const side of [-1, 1]) {
    part(body, box(0.035, 0.095, 0.04), 0x324456, side * 0.19, 0.3, 0.54);
    part(body, box(0.065, 0.035, 0.08), 0x27cfc3, side * 0.3, 0.31, -0.15);
    part(
      body,
      box(0.18, 0.022, 0.018),
      0xe44259,
      side * 0.17,
      0.24,
      0.622,
      true,
    );
  }
  part(body, box(0.53, 0.068, 0.09), 0x14202c, 0, 0.149, 0.595);
  const wheels: T.Mesh[] = [],
    lamps: T.Object3D[] = [],
    brakes: T.Mesh[] = [];
  for (const side of [-1, 1]) {
    for (const axle of [-0.39, 0.4]) {
      const wheel = part(
        car,
        new T.CylinderGeometry(0.145, 0.145, 0.1, 12),
        0x161923,
        side * 0.31,
        0.15,
        axle,
      );
      wheel.rotation.z = Math.PI / 2;
      wheels.push(wheel);
      part(
        car,
        new T.CylinderGeometry(0.075, 0.075, 0.106, 8),
        0x8eacc1,
        side * 0.31,
        0.15,
        axle,
      ).rotation.z = Math.PI / 2;
    }
    lamps.push(
      part(
        body,
        box(0.16, 0.026, 0.025),
        0xddffff,
        side * 0.16,
        0.202,
        -0.655,
        true,
      ),
    );
    brakes.push(
      part(
        body,
        box(0.18, 0.02, 0.025),
        0xcc3044,
        side * 0.17,
        0.212,
        0.622,
        true,
      ),
    );
  }
  const light = new T.SpotLight(0xc3f7ff, 26, 9, 0.45, 0.65, 1.3);
  light.position.set(0, 0.28, -0.55);
  light.target.position.set(0, 0, -5);
  car.add(light, light.target);
  lamps.push(light);
  const camera = new T.PerspectiveCamera(54, 1, 0.045, 190);
  const desired = new T.Vector3(),
    target = new T.Vector3(),
    eye = new T.Vector3(),
    look = new T.Vector3();
  let pose = spawn(),
    acc = 0,
    snap = true,
    lastReport = -1,
    previousSpeed = 0;
  return {
    camera,
    get active() {
      return car.visible;
    },
    enable(on: boolean) {
      car.visible = on;
      snap = true;
      acc = 0;
      lastReport = -1;
    },
    park(id: number) {
      pose = id ? park(id) : spawn();
      snap = true;
      acc = 0;
      lastReport = -1;
    },
    tick(
      dt: number,
      input: ReadonlySet<string>,
      view: View,
      headlights: boolean,
      paused: boolean,
      report: (v: Telemetry) => void,
    ) {
      acc = paused ? 0 : acc + Math.min(0.12, dt);
      if (paused) pose.speed = 0;
      while (acc >= timestep) {
        stepDrive(pose, input);
        acc -= timestep;
      }
      const { x, z, heading, speed } = pose,
        s = Math.sin(heading),
        c = Math.cos(heading);
      car.position.set(x, 0.018, z);
      car.rotation.y = heading;
      body.rotation.x = T.MathUtils.lerp(
        body.rotation.x,
        T.MathUtils.clamp((speed - previousSpeed) * 0.06, -0.045, 0.045),
        0.25,
      );
      previousSpeed = speed;
      wheels.forEach((w) => w.rotateY((-speed * dt) / 0.145));
      lamps.forEach((l) => (l.visible = headlights));
      brakes.forEach((b) =>
        (b.material as T.MeshBasicMaterial).color.setHex(
          input.has("Space") || input.has("KeyS") || input.has("ArrowDown")
            ? 0xff445a
            : 0xab263c,
        ),
      );
      if (view === "Overhead") {
        eye.set(x, 16, z + 0.001);
        target.set(x, 0, z);
      } else {
        eye.set(x + s * 2.8, 1.65, z + c * 2.8);
        target.set(x - s * 2, 0.5, z - c * 2);
      }
      // Shorten the follow arm before it intersects a raised lot at a corner.
      if (view === "Chase") {
        desired.copy(eye);
        for (let fraction = 0.1; fraction <= 1; fraction += 0.1) {
          const px = x + (desired.x - x) * fraction,
            pz = z + (desired.z - z) * fraction;
          if (
            plots.some(
              (p) => Math.abs(px - p.x) < 3.95 && Math.abs(pz - p.z) < 3.95,
            )
          ) {
            const t = Math.max(0.12, fraction - 0.1);
            eye.set(
              x + (desired.x - x) * t,
              1.15 + t * 0.5,
              z + (desired.z - z) * t,
            );
            break;
          }
        }
      }
      const blend = snap ? 1 : 1 - Math.exp(-12 * dt);
      camera.position.lerp(eye, blend);
      look.lerp(target, blend);
      camera.lookAt(look);
      snap = false;
      if (performance.now() - lastReport > 95 || lastReport < 0) {
        report({ ...pose, nearby: near(pose) });
        lastReport = performance.now();
      }
    },
  };
}
