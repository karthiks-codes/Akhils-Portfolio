import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      ADMIN_EMAILS: "",
      AUTH_GOOGLE_ID: "",
      AUTH_GOOGLE_SECRET: "",
      AUTH_SECRET: "",
      MONGODB_URI: "",
      NEXT_PUBLIC_ASSET_BASE_URL: "",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
      RATE_LIMIT_SALT: "",
      RESEND_API_KEY: "",
      RESEND_FROM_EMAIL: "",
      RESEND_TO_EMAIL: "",
      RESEND_WEBHOOK_SECRET: "",
      TURNSTILE_SECRET_KEY: "",
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
