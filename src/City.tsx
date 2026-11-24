"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { repos } from "./data";

type Props = {
  selected: number;
  onSelect: (id: number) => void;
  resetKey: number;
  zoomSignal: number;
  onError: () => void;
  onReady: () => void;
};

type Block = [
  number,
  number,
  number,
  number,
  number,
  number,
  THREE.ColorRepresentation,
  number?,
];
type Engine = {
  select: (id: number) => void;
  reset: () => void;
  zoom: (direction: number) => void;
};

function seeded(seed: number) {
  let state = seed >>> 0;
  return () =>
    (state = (Math.imul(1664525, state) + 1013904223) >>> 0) / 4294967296;
}

const facades = [
  ["#314964", "#79cfff", "#ceedff"],
  ["#3a344c", "#ffbb76", "#ffedbd"],
  ["#2b4353", "#4de3d0", "#bdffe8"],
  ["#42375d", "#af83ff", "#ffe1ff"],
  ["#354956", "#a4d9ef", "#ffffff"],
  ["#453948", "#fa9d84", "#ffdbc1"],
];

function makeFacade(
  style: number,
  seed: number,
  cols: number,
  rows: number,
  accent: string,
) {
  const canvas = document.createElement("canvas");
  const w = 12,
    h = 12;
  canvas.width = cols * w;
  canvas.height = rows * h;
  const ctx = canvas.getContext("2d")!;
  const [frame, , hot] = facades[style % facades.length];
  const lit = accent;
  const rand = seeded(seed);
  ctx.fillStyle = frame;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    const floorLit = rand() > 0.46;
    for (let x = 0; x < cols; x++) {
      const value = rand();
      ctx.fillStyle =
        value > (floorLit ? 0.5 : 0.79)
          ? value > 0.96
            ? hot
            : lit
          : value > 0.3
            ? "#27374b"
            : "#1c293b";
      ctx.fillRect(x * w + 2, y * h + 2, w - (style % 3 === 0 ? 5 : 3), h - 5);
    }
    ctx.fillStyle = "#18263a";
    ctx.fillRect(0, y * h + h - 2, canvas.width, 2);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

function createWorld(
  host: HTMLDivElement,
  pick: (id: number) => void,
  fail: () => void,
) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
  renderer.setClearColor(0x0b1020, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText =
    "width:100%;height:100%;display:block;touch-action:none";
  canvas.setAttribute(
    "aria-label",
    "Interactive 3D repository city. Drag to orbit and scroll to zoom.",
  );
  canvas.setAttribute("role", "img");
  host.appendChild(canvas);
  const camera = new THREE.OrthographicCamera(-48, 48, 38, -38, 0.1, 650);
  const controls = new OrbitControls(camera, canvas);
  let dirty = true;
  const invalidate = () => {
    dirty = true;
  };
  controls.addEventListener("change", invalidate);
  const reset = () => {
    invalidate();
    camera.position.set(83, 70, 88);
    controls.target.set(0, 7.2, 0);
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    controls.update();
  };
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  controls.enablePan = false;
  controls.minPolarAngle = 0.23;
  controls.maxPolarAngle = Math.PI * 0.425;
  controls.minZoom = 0.58;
  controls.maxZoom = 3.1;
  reset();
  scene.add(new THREE.HemisphereLight(0xe9edff, 0x7996bf, 1.7));
  const sun = new THREE.DirectionalLight(0xe7deff, 1.6);
  sun.position.set(-30, 75, 40);
  scene.add(sun);

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const blocks: Block[] = [],
    lightBlocks: Block[] = [];
  const buildingMeshes: THREE.Object3D[] = [];
  const buildingPositions = new Map<
    number,
    { x: number; z: number; height: number; width: number; depth: number }
  >();
  const topMat = new THREE.MeshStandardMaterial({
    color: "#536176",
    roughness: 0.88,
  });
  const step = 10,
    street = "#293241",
    curb = "#596677";
  blocks.push(
    [0, -1.15, 0, 53, 1.45, 53, "#333e53"],
    [0, -0.48, 0, 53.2, 0.2, 53.2, "#66839a"],
    [0, -0.22, 0, 53, 0.4, 53, street],
  );
  // Outer quay contains a maintenance walkway and inset amber running lights.
  for (const s of [-1, 1]) {
    blocks.push(
      [s * 26.15, 0.04, 0, 0.58, 0.16, 53, curb],
      [0, 0.04, s * 26.15, 53, 0.16, 0.58, curb],
    );
    for (let i = -24; i <= 24; i += 2) {
      lightBlocks.push(
        [s * 26.52, -0.85, i, 0.02, 0.08, 0.75, "#8ab9df"],
        [i, -0.85, s * 26.52, 0.75, 0.08, 0.02, "#e7b580"],
      );
    }
  }
  for (let a = -25; a <= 25; a += step) {
    for (let b = -24; b <= 24; b += 2) {
      if (Math.abs(((b + 25) % 10) - 5) > 3.7) continue;
      blocks.push(
        [a, 0.028, b, 0.085, 0.024, 0.85, "#dcc79a"],
        [b, 0.028, a, 0.85, 0.024, 0.085, "#dcc79a"],
      );
    }
  }
  for (let x = -15; x <= 15; x += step)
    for (let z = -15; z <= 15; z += step) {
      for (let t = -0.85; t <= 0.9; t += 0.32) {
        blocks.push(
          [x + t, 0.034, z + 1.25, 0.15, 0.02, 0.53, "#c1c9cf"],
          [x - 1.25, 0.034, z + t, 0.53, 0.02, 0.15, "#c1c9cf"],
        );
      }
    }

  const foliage: Block[] = [];
  const addTree = (x: number, z: number, r: number) => {
    blocks.push([x, 0.62, z, 0.16, 1.1, 0.16, "#534941"]);
    foliage.push(
      [x, 1.38, z, r, 1.45 * r, r, "#397f72"],
      [x - 0.08, 1.64, z - 0.06, r * 0.8, 1.25 * r, r * 0.8, "#62a78a"],
    );
  };
  repos.slice(0, 25).forEach((repo, index) => {
    const plot =
      ((Math.floor(index / 5) + 2) % 5) * 5 + (((index % 5) + 2) % 5);
    const gx = (plot % 5) - 2,
      gz = Math.floor(plot / 5) - 2;
    const x = gx * step,
      z = gz * step;
    const rand = seeded(repo.id * 3103);
    const palette = (index * 5 + Math.floor(index / 5)) % 6,
      accent = repo.color;
    const width =
      3.6 + Math.min(1.7, Math.log1p(Math.max(0, repo.size)) * 0.15);
    const depth = 3.5 + rand() * 1.5;
    const height =
      3.3 +
      Math.min(5, Math.log1p(Math.max(0, repo.stars)) * 0.56) +
      Math.max(0, 2.7 - Math.hypot(gx, gz)) * 4 +
      rand() * 3.2;
    const baseY = 0.61;
    blocks.push(
      [x, 0.13, z, 7.85, 0.26, 7.85, curb],
      [x, 0.29, z, 7.58, 0.08, 7.58, "#58616b"],
      [x, 0.42, z, width + 0.43, 0.31, depth + 0.43, "#333f50"],
    );
    const tier = (
      cy: number,
      dx: number,
      dy: number,
      dz: number,
      ox = 0,
      oz = 0,
    ) => {
      const texture = makeFacade(
        palette,
        repo.id * 121 + Math.round(cy * 19),
        Math.max(3, Math.round(dx * 2.1)),
        Math.max(2, Math.round(dy * 1.38)),
        accent,
      );
      const wall = new THREE.MeshStandardMaterial({
        map: texture,
        emissiveMap: texture,
        emissive: 0xffffff,
        emissiveIntensity: 0.24,
        roughness: 0.7,
      });
      const mesh = new THREE.Mesh(boxGeometry, [
        wall,
        wall,
        topMat,
        topMat,
        wall,
        wall,
      ]);
      mesh.position.set(x + ox, cy, z + oz);
      mesh.scale.set(dx, dy, dz);
      mesh.userData.repoId = repo.id;
      scene.add(mesh);
      buildingMeshes.push(mesh);
      blocks.push([
        x + ox,
        cy + dy / 2 + 0.08,
        z + oz,
        dx + 0.16,
        0.16,
        dz + 0.16,
        "#657386",
      ]);
    };
    const style = index % 5;
    const setback = [0.71, 0.86, 0.62, 0.76, 0.81][style];
    const lower = height * setback;
    tier(baseY + lower / 2, width, lower, depth);
    const upper = height - lower;
    const upperWidth = width * (style === 1 ? 0.91 : 0.73),
      upperDepth = depth * (style === 3 ? 0.92 : 0.74);
    const shift = style === 2 ? 0.45 : 0;
    tier(baseY + lower + upper / 2, upperWidth, upper, upperDepth, shift);
    const roof = baseY + height + 0.23;
    // Parapets, setbacks, rooftop plant, facade piers and shopfront canopies.
    for (const side of [-1, 1]) {
      blocks.push(
        [
          x + shift + side * (upperWidth / 2 - 0.09),
          roof,
          z,
          0.12,
          0.25,
          upperDepth,
          "#84909d",
        ],
        [
          x + side * (width / 2 - 0.13),
          baseY + lower / 2,
          z + depth / 2,
          0.15,
          lower,
          0.15,
          "#516076",
        ],
      );
      lightBlocks.push([
        x + side * (width / 2 - 0.11),
        baseY + lower / 2,
        z + depth / 2 + 0.09,
        0.052,
        lower,
        0.04,
        accent,
      ]);
    }
    blocks.push(
      [
        x - 0.42,
        roof + 0.27,
        z - 0.35,
        upperWidth * 0.32,
        0.54,
        upperDepth * 0.38,
        "#3f4a58",
      ],
      [x + 0.52, roof + 0.15, z + 0.52, 0.68, 0.3, 0.57, "#73808c"],
      [x, 1.52, z + depth / 2 + 0.24, width * 0.48, 0.16, 0.65, "#8291a2"],
    );
    lightBlocks.push(
      [x, 1.46, z + depth / 2 + 0.55, width * 0.45, 0.085, 0.06, accent],
      [
        x + shift,
        roof - 0.06,
        z + upperDepth / 2 + 0.01,
        upperWidth,
        0.11,
        0.05,
        accent,
      ],
    );
    if (style === 0 || style === 3) {
      blocks.push([x + 0.3, roof + 1.08, z, 0.12, 2.1, 0.12, "#bec6d2"]);
      lightBlocks.push([x + 0.3, roof + 2.17, z, 0.18, 0.14, 0.18, "#ffa181"]);
    }
    if (style === 1 || style === 4)
      for (let level = 2; level < lower; level += 2.1) {
        blocks.push([x, level, z, width + 0.18, 0.12, depth + 0.18, "#79889b"]);
      }
    for (const side of [-1, 1]) {
      const tx = x + side * 3.17,
        tz = z + side * 2.85;
      blocks.push([tx, 0.36, tz, 0.98, 0.12, 1.18, "#344d49"]);
      addTree(tx, tz, 0.76 + rand() * 0.28);
    }
    blocks.push(
      [x + 3.45, 1.05, z - 2.9, 0.085, 1.45, 0.085, "#8b99a4"],
      [x + 3.61, 1.76, z - 2.9, 0.4, 0.08, 0.12, "#647381"],
    );
    lightBlocks.push([x + 3.78, 1.72, z - 2.9, 0.25, 0.065, 0.16, "#ffdc9d"]);
    const carX = x + 1.7,
      carZ = z + 4.42;
    const paint = ["#b36c58", "#93acc2", "#699195", "#b7a481", "#565e79"][
      index % 5
    ];
    blocks.push(
      [carX, 0.2, carZ, 0.99, 0.28, 0.45, paint],
      [carX - 0.03, 0.4, carZ, 0.52, 0.19, 0.37, "#536374"],
    );
    lightBlocks.push([carX + 0.51, 0.2, carZ, 0.04, 0.08, 0.34, "#ffe9ba"]);
    buildingPositions.set(repo.id, {
      x,
      z,
      height: roof + (style === 0 || style === 3 ? 2.2 : 0),
      width,
      depth,
    });
  });
  const matrix = new THREE.Matrix4(),
    color = new THREE.Color();
  const instance = (
    items: Block[],
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
  ) => {
    const mesh = new THREE.InstancedMesh(geometry, material, items.length);
    items.forEach(([x, y, z, w, h, d, c], i) => {
      matrix.makeScale(w, h, d).setPosition(x, y, z);
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, color.set(c));
    });
    scene.add(mesh);
  };
  instance(
    blocks,
    boxGeometry,
    new THREE.MeshStandardMaterial({ roughness: 0.88 }),
  );
  instance(lightBlocks, boxGeometry, new THREE.MeshBasicMaterial());
  instance(
    foliage,
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.MeshStandardMaterial({ flatShading: true }),
  );

  const marker = new THREE.Group();
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xc3a0ff });
  const markerTip = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.69),
    markerMaterial,
  );
  marker.add(markerTip);
  scene.add(marker);
  const halo = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      [
        [-3.4, -3.4],
        [3.4, -3.4],
        [3.4, 3.4],
        [-3.4, 3.4],
      ].map(([x, z]) => new THREE.Vector3(x, 0.35, z)),
    ),
    new THREE.LineBasicMaterial({ color: 0xc99bff }),
  );
  scene.add(halo);
  const select = (id: number) => {
    invalidate();
    const plot = buildingPositions.get(id);
    marker.visible = halo.visible = !!plot;
    if (!plot) return;
    marker.position.set(plot.x, plot.height + 1.8, plot.z);
    halo.position.set(plot.x, 0, plot.z);
  };
  const ray = new THREE.Raycaster(),
    pointer = new THREE.Vector2(),
    start = new THREE.Vector2();
  const hit = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      1 - ((e.clientY - rect.top) / rect.height) * 2,
    );
    ray.setFromCamera(pointer, camera);
    return ray.intersectObjects(buildingMeshes, false)[0]?.object.userData
      .repoId as number | undefined;
  };
  const down = (e: PointerEvent) => {
    start.set(e.clientX, e.clientY);
  };
  const up = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 5) return;
    const id = hit(e);
    if (id !== undefined) pick(id);
  };
  const move = (e: PointerEvent) => {
    canvas.style.cursor = e.buttons
      ? "grabbing"
      : hit(e) !== undefined
        ? "pointer"
        : "grab";
  };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointermove", move);
  const lost = (e: Event) => {
    e.preventDefault();
    fail();
  };
  canvas.addEventListener("webglcontextlost", lost);
  const resize = () => {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    const aspect = w / h,
      half = Math.max(26, 40 / aspect);
    camera.left = -half * aspect;
    camera.right = half * aspect;
    camera.top = half;
    camera.bottom = -half;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    invalidate();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = true;
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    invalidate();
  });
  visibility.observe(host);
  let frame = 0;
  const render = () => {
    controls.update();
    if (visible && !document.hidden) {
      if (!reduced && marker.visible) {
        markerTip.rotation.y = performance.now() * 0.00065;
        invalidate();
      }
      if (dirty) {
        renderer.render(scene, camera);
        dirty = false;
      }
    }
    frame = requestAnimationFrame(render);
  };
  render();
  return {
    select,
    reset,
    zoom: (delta: number) => {
      camera.zoom = THREE.MathUtils.clamp(
        camera.zoom * Math.pow(1.2, delta),
        controls.minZoom,
        controls.maxZoom,
      );
      camera.updateProjectionMatrix();
      invalidate();
    },
    dispose: () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      controls.removeEventListener("change", invalidate);
      controls.dispose();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("webglcontextlost", lost);
      const geometries = new Set<THREE.BufferGeometry>(),
        materials = new Set<THREE.Material>(),
        textures = new Set<THREE.Texture>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          geometries.add(object.geometry);
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((material: THREE.Material) => materials.add(material));
          if (object instanceof THREE.InstancedMesh) object.dispose();
        }
      });
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial && material.map)
          textures.add(material.map);
        material.dispose();
      });
      textures.forEach((texture) => texture.dispose());
      geometries.forEach((geometry) => geometry.dispose());
      renderer.dispose();
      canvas.remove();
    },
  };
}

export default function City({
  selected,
  onSelect,
  resetKey,
  zoomSignal,
  onError,
  onReady,
}: Props) {
  const host = useRef<HTMLDivElement>(null),
    engine = useRef<Engine | null>(null);
  const callbacks = useRef({ onSelect, onError, onReady, selected });
  useEffect(() => {
    callbacks.current = { onSelect, onError, onReady, selected };
  }, [onSelect, onError, onReady, selected]);
  useEffect(() => {
    if (!host.current) return;
    try {
      const world = createWorld(
        host.current,
        (id) => callbacks.current.onSelect(id),
        () => callbacks.current.onError(),
      );
      engine.current = world;
      world.select(callbacks.current.selected);
      callbacks.current.onReady();
      return () => {
        engine.current = null;
        world.dispose();
      };
    } catch (error) {
      console.error("GitVerse city initialization failed", error);
      callbacks.current.onError();
    }
  }, []);
  useEffect(() => engine.current?.select(selected), [selected]);
  useEffect(() => engine.current?.reset(), [resetKey]);
  const previousZoom = useRef(zoomSignal);
  useEffect(() => {
    engine.current?.zoom(zoomSignal - previousZoom.current);
    previousZoom.current = zoomSignal;
  }, [zoomSignal]);
  return <div ref={host} style={{ position: "absolute", inset: 0 }} />;
}
