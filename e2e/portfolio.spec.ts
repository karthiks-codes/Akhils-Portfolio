import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage presents the required identity and information architecture", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /software engineer building intelligent systems/i })).toBeVisible();
  await expect(page.getByText("I'm open to opportunities.").first()).toBeVisible();
  await expect(page.getByRole("img", { name: /portrait of akhil/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Featured projects" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ideas still in motion." })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByText("GitHub", { exact: true })).toHaveCount(0);
});

test("project taxonomy filters with accessible controls", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("tab", { name: "Automation" }).click();
  await expect(page.getByText("1 project")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Job Automation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "SmartSkin" })).toHaveCount(0);
});

test("ongoing projects contain a project-specific suggestion form", async ({ page }) => {
  await page.goto("/projects/tripshield");
  await expect(page.getByRole("heading", { level: 1, name: "TripShield" })).toBeVisible();
  await expect(page.getByText("Current implementation is not confirmed.")).toBeVisible();
  await expect(page.getByRole("heading", { name: /have an idea for tripshield/i })).toBeVisible();
  await expect(page.locator('input[name="projectSlug"]')).toHaveValue("tripshield");
});

test("command palette supports keyboard navigation and whoami", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open command menu" }).click();
  await expect(page.getByRole("dialog", { name: /navigate akhil's portfolio/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Control+K");
  await expect(page.getByRole("dialog", { name: /navigate akhil's portfolio/i })).toBeVisible();
  await page.getByPlaceholder(/go anywhere/i).fill("whoami");
  await page.getByRole("option", { name: /whoami/i }).click();
  await expect(page.getByText("Identity resolved")).toBeVisible();
  await expect(page.getByRole("dialog").getByText("Akhil Karthik Boddupalli", { exact: true })).toBeVisible();
});

test("command palette reveals the stack and live application status", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open command menu" }).click();
  await page.getByPlaceholder(/go anywhere/i).fill("stack");
  await page.getByRole("option", { name: "stack", exact: true }).click();
  await expect(page.getByText("Build stack")).toBeVisible();
  await expect(page.getByText(/Next.js 16.*React 19.*TypeScript/)).toBeVisible();

  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Open command menu" }).click();
  await page.getByPlaceholder(/go anywhere/i).fill("status");
  await page.getByRole("option", { name: "status", exact: true }).click();
  await expect(page.getByText("System status")).toBeVisible();
  await expect(page.getByText("Operational", { exact: true })).toBeVisible();
});

test("footer colophon records the design decisions", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Designed & engineered in Hyderabad" }).click();
  await expect(page.getByRole("dialog", { name: "Made with intent." })).toBeVisible();
  await expect(page.getByText(/8px spacing rhythm/i)).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Made with intent." })).toHaveCount(0);
});

test("blueprint mode and the logo interaction respond to their hidden sequences", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("b");
  await page.keyboard.press("b");
  await page.keyboard.press("b");
  await expect(page.locator("html")).toHaveClass(/blueprint-mode/);
  await expect(page.getByText("Blueprint / 8px system")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).not.toHaveClass(/blueprint-mode/);

  const logo = page.getByRole("link", { name: /AK Akhil/i });
  for (let click = 0; click < 5; click += 1) await logo.click();
  await expect(page.getByText(/Built carefully.*Deployed continuously.*Improved relentlessly/i)).toBeVisible();
});

test("smart 404 keyboard recovery recognizes home and projects", async ({ page }) => {
  await page.goto("/a-route-that-does-not-exist");
  await expect(page.getByRole("heading", { name: /does not lead anywhere yet/i })).toBeVisible();
  await page.keyboard.type("projects");
  await expect(page).toHaveURL(/\/projects$/);

  await page.goto("/another-missing-route");
  await page.keyboard.type("home");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1, name: /software engineer building intelligent systems/i })).toBeVisible();
});

test("forms fail clearly when production providers are absent", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("A Visitor");
  await page.getByLabel("Email").fill("visitor@example.com");
  await page.getByLabel("Message").fill("A detailed message that passes the minimum validation limit.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/messaging is not active in this environment yet/i)).toBeVisible();
});

test("health endpoint exposes a minimal liveness response", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toMatchObject({ status: "ok", service: "akhil-portfolio" });
  expect(response.headers()["x-request-id"]).toBeTruthy();
});

test("admin insights require configured Google authentication", async ({ page }) => {
  await page.goto("/admin/insights");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: "Portfolio insights" })).toBeVisible();
  await expect(page.getByText(/setup required/i)).toBeVisible();
});

for (const route of ["/", "/projects", "/contact", "/admin/login", "/a-route-that-does-not-exist"]) {
  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  });
}
