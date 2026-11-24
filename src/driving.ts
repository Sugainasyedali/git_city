import { repos } from "./data";

export const plots = repos.map((repo, index) => ({
  id: repo.id,
  x: ((((index % 5) + 2) % 5) - 2) * 10,
  z: (((Math.floor(index / 5) + 2) % 5) - 2) * 10,
}));
export type Pose = { x: number; z: number; heading: number; speed: number };
export const spawn = (): Pose => ({ x: 5, z: 8, heading: 0, speed: 0 });
export const timestep = 1 / 60;
export const keys = [
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "Space",
  "ShiftLeft",
  "ShiftRight",
  "ArrowUp",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
] as const;
export function near(p: Pose) {
  let distance = 6.3,
    id = 0;
  for (const plot of plots) {
    const d = Math.hypot(plot.x - p.x, plot.z - p.z);
    if (d < distance) {
      distance = d;
      id = plot.id;
    }
  }
  return id;
}
export function roadSafe(x: number, z: number) {
  // The vehicle fits inside a .78-unit circle at any steering angle.
  return (
    Math.abs(x) <= 25.6 &&
    Math.abs(z) <= 25.6 &&
    plots.every(
      (p) =>
        Math.hypot(
          Math.max(0, Math.abs(x - p.x) - 3.925),
          Math.max(0, Math.abs(z - p.z) - 3.925),
        ) > 0.78,
    )
  );
}
export function park(id: number): Pose {
  const plot = plots.find((p) => p.id === id);
  return plot ? { x: plot.x + 4.9, z: plot.z, heading: 0, speed: 0 } : spawn();
}
export function stepDrive(p: Pose, pressed: ReadonlySet<string>) {
  const forward = pressed.has("KeyW") || pressed.has("ArrowUp"),
    back = pressed.has("KeyS") || pressed.has("ArrowDown");
  const left = pressed.has("KeyA") || pressed.has("ArrowLeft"),
    right = pressed.has("KeyD") || pressed.has("ArrowRight");
  const push = Number(forward) - Number(back);
  if (pressed.has("Space") || !push) {
    const drag = (pressed.has("Space") ? 23 : 2.7) * timestep;
    p.speed = Math.sign(p.speed) * Math.max(0, Math.abs(p.speed) - drag);
  } else {
    const limit =
      pressed.has("ShiftLeft") || pressed.has("ShiftRight") ? 13 : 9;
    p.speed = Math.max(
      -4,
      Math.min(
        limit,
        p.speed + push * (p.speed * push < 0 ? 18 : 6) * timestep,
      ),
    );
  }
  const turn =
    (Number(left) - Number(right)) *
    Math.sign(p.speed) *
    Math.min(Math.abs(p.speed) * 0.7, 2.8) *
    timestep;
  const heading = p.heading + turn;
  const x = p.x - Math.sin(heading) * p.speed * timestep,
    z = p.z - Math.cos(heading) * p.speed * timestep;
  if (roadSafe(x, z)) {
    p.x = x;
    p.z = z;
    p.heading = heading;
  } else {
    p.speed = 0;
    p.heading = heading;
  }
}
