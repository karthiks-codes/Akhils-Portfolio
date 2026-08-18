import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1366, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
] as const;

for (const viewport of viewports) {
  test(`homepage visual check — ${viewport.name}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath(`home-${viewport.name}.png`), fullPage: true, caret: "initial" });
  });
}

for (const viewport of [viewports[0], viewports[3]]) {
  test(`admin login visual check - ${viewport.name}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "Portfolio insights" })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath(`admin-login-${viewport.name}.png`), fullPage: true, caret: "initial" });
  });
}

test("blueprint mode visual check - wide", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("b");
  await page.keyboard.press("b");
  await page.keyboard.press("b");
  await expect(page.locator("html")).toHaveClass(/blueprint-mode/);
  await page.screenshot({ path: testInfo.outputPath("blueprint-wide.png"), fullPage: false, caret: "initial" });
});

test("colophon visual check - mobile", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Designed & engineered in Hyderabad" }).click();
  await expect(page.getByRole("dialog", { name: "Made with intent." })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("colophon-mobile.png"), fullPage: false, caret: "initial" });
});
