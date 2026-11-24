const districts = [
  {
    name: "Frontend",
    language: "TypeScript",
    color: "#54d7f0",
    projects: [
      "prism-ui",
      "orbital-kit",
      "flux-canvas",
      "quartz-web",
      "signal-view",
    ],
  },
  {
    name: "Systems",
    language: "Rust",
    color: "#ffaf65",
    projects: [
      "neon-core",
      "oxide-cache",
      "delta-store",
      "ember-runtime",
      "vector-db",
    ],
  },
  {
    name: "Intelligence",
    language: "Python",
    color: "#82e1ac",
    projects: [
      "atlas-ml",
      "nova-index",
      "lumen-lab",
      "cosmic-search",
      "tensor-field",
    ],
  },
  {
    name: "Platform",
    language: "Go",
    color: "#8aa8ff",
    projects: [
      "relay-mesh",
      "orbit-proxy",
      "pulse-jobs",
      "beacon-api",
      "ion-stream",
    ],
  },
  {
    name: "Creative",
    language: "JavaScript",
    color: "#bd96ff",
    projects: [
      "shader-garden",
      "pixel-forge",
      "echo-synth",
      "prism-motion",
      "lunar-studio",
    ],
  },
];
const descriptions = [
  "A component library for accessible developer interfaces.",
  "Low-latency primitives for distributed services.",
  "Experiments in machine learning and semantic discovery.",
  "Cloud-native tools for routing events between services.",
  "Creative coding tools for interactive audio and graphics.",
];
export const repos = districts.flatMap((d, i) =>
  d.projects.map((name, j) => ({
    id: i * 5 + j + 1,
    name,
    language: d.language,
    district: d.name,
    color: d.color,
    size: 1400 + (((i + 3) * (j + 7) * 403) % 27000),
    stars: 24 + (((i + 2) * (j + 11) * 37) % 840),
    forks: 3 + ((i * 5 + j * 7) % 41),
    issues: (i + j * 2) % 12,
    description: descriptions[i],
    owner: "demo-labs",
    branch: "main",
    license: "MIT",
  })),
);
export const districtCount = districts.length;
