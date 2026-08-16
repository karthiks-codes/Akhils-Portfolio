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

test("forms fail clearly when production providers are absent", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("A Visitor");
  await page.getByLabel("Email").fill("visitor@example.com");
  await page.getByLabel("Message").fill("A detailed message that passes the minimum validation limit.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/messaging is not active in this environment yet/i)).toBeVisible();
});

for (const route of ["/", "/projects", "/contact"]) {
  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  });
}
