// @ts-check
const { defineConfig, devices } = require("@playwright/test");

const FRONTEND_URL = process.env.E2E_FRONTEND_URL || "http://127.0.0.1:3000";
const BACKEND_URL = process.env.E2E_BACKEND_URL || "http://127.0.0.1:5000";
const API_BASE = `${BACKEND_URL}/api/v2`;

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["json", { outputFile: "playwright-report/results.json" }],
  ],
  timeout: 90_000,
  expect: { timeout: 15_000 },
  outputDir: "./test-results",
  use: {
    baseURL: FRONTEND_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  globalSetup: require.resolve("./global-setup.js"),
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  metadata: {
    backendUrl: BACKEND_URL,
    apiBase: API_BASE,
  },
});
