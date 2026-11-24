import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const html = await readFile(path.resolve("delivery/GitVerse.html"), "utf8");
  await page.setContent(html);
  await page.locator("canvas").waitFor();
  await page.waitForFunction(() => !document.querySelector(".loading"));
  await page.screenshot({ path: "docs/images/overview.png" });
  await page.getByRole("link", { name: "Explore demo", exact: true }).click();
  await page.getByRole("button", { name: "Directory", exact: true }).click();
  await page.getByRole("textbox").fill("oxide-cache");
  await page.getByRole("button", { name: "oxide-cache" }).click();
  assert.match(await page.locator(".inspector").innerText(), /Rust/);
  await page.keyboard.press("Escape");
  const before = await page.locator("canvas").screenshot();
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  assert.ok(!before.equals(await page.locator("canvas").screenshot()));
  const bounds = await page.locator("canvas").boundingBox();
  const cx = bounds.x + bounds.width / 2,
    cy = bounds.y + bounds.height / 2;
  const zoomed = await page.locator("canvas").screenshot();
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 80, cy + 20, { steps: 5 });
  await page.mouse.up();
  assert.ok(!zoomed.equals(await page.locator("canvas").screenshot()));
  await page.getByRole("button", { name: "Reset camera" }).click();
  await page.getByRole("button", { name: "Immersive view" }).click();
  await page.locator(".expanded").waitFor();
  await page.keyboard.press("Escape");
  const canvas = page.locator("canvas");
  const rect = await canvas.boundingBox();
  for (const x of [0.5, 0.48, 0.53, 0.46]) {
    await canvas.click({
      position: { x: rect.width * x, y: rect.height * 0.52 },
    });
    if (await page.locator(".inspector").count()) break;
  }
  assert.equal(await page.locator(".inspector").count(), 1);
  await page.screenshot({ path: "docs/images/explorer.png" });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Drive city" }).click();
  await page.keyboard.down("w");
  await page.waitForFunction(
    () =>
      document.querySelector(".instruments strong")?.textContent &&
      parseInt(document.querySelector(".instruments strong").textContent) > 0,
  );
  await page.keyboard.up("w");
  await page.keyboard.press("f");
  assert.equal(
    await page
      .getByRole("button", { name: "Headlights", exact: true })
      .getAttribute("aria-pressed"),
    "false",
  );
  await page.keyboard.press("c");
  assert.match(
    await page
      .getByRole("button", { name: "Change driving camera" })
      .innerText(),
    /Overhead/,
  );
  await page.keyboard.press("m");
  await page
    .locator(".mapgrid")
    .getByRole("button", { name: "oxide-cache", exact: true })
    .click();
  await page.getByRole("button", { name: "Inspect oxide-cache · E" }).waitFor();
  await page.keyboard.press("e");
  assert.match(await page.locator(".inspector").innerText(), /oxide-cache/);
  await page.getByRole("button", { name: "Drive here" }).click();
  await page.keyboard.press("c");
  await page.getByRole("button", { name: "Reset vehicle" }).click();
  await page.getByLabel("Graphics quality").selectOption("low");
  await page.screenshot({ path: "docs/images/driving.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  const pedal = await page
    .getByRole("button", { name: "Accelerate", exact: true })
    .boundingBox();
  await page.mouse.move(pedal.x + pedal.width / 2, pedal.y + pedal.height / 2);
  await page.mouse.down();
  await page.waitForFunction(
    () =>
      parseInt(document.querySelector(".instruments strong").textContent) > 0,
  );
  await page.mouse.up();
  await page.getByRole("button", { name: "Exit vehicle" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    location.hash = "/";
  });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.locator(".menu").getByText("Documentation").click();
  assert.equal(await page.locator("h1").innerText(), "Explorer guide");
  assert.deepEqual(errors, []);
  const fallback = await browser.newPage();
  await fallback.evaluate(() => {
    const old = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
      return kind.startsWith("webgl") ? null : old.call(this, kind, ...args);
    };
  });
  await fallback.setContent(html);
  await fallback
    .getByText("3D rendering unavailable.", { exact: false })
    .waitFor();
  await fallback.getByRole("button", { name: "Browse repositories" }).click();
  assert.equal(await fallback.locator(".results button").count(), 25);
  console.log(
    "Portable app passed desktop, mobile navigation, WebGL picking, directory, camera controls and fallback checks.",
  );
} finally {
  await browser.close();
}
