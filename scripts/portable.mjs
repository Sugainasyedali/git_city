import { build } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
const js = await build({
  entryPoints: ["portable/entry.tsx"],
  bundle: true,
  minify: true,
  write: false,
  alias: { "next/link": path.resolve("portable/Link.tsx") },
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "inline",
});
const css = await readFile("app/style.css", "utf8");
const notices = await Promise.all(["react","react-dom","scheduler","lucide-react","three"].map(async name => name + "\n" + await readFile("node_modules/" + name + "/LICENSE","utf8")));
await mkdir("delivery", { recursive: true });
await writeFile(
  "delivery/GitVerse.html",
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>GitVerse · The Developer Universe</title><style>' +
    css +
    '</style></head><body><div id="app"></div><script>' +
    js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script") +
    "</script><!-- Third-party notices\n" + notices.join("\n\n").replaceAll("-->", "-- >") + "\n--></body></html>",
);
