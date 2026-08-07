/**
 * Sprint 4 Phase 6 — Final auth certification screenshots + smoke checks.
 * Run: npx playwright test tests/auth-final-certification.spec.js
 */
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const API = process.env.PLAYWRIGHT_API_URL || "http://127.0.0.1:5000/api/v2";
const SCREENSHOT_DIR = path.join(__dirname, "..", "audit-screenshots", "auth-final");

const VIEWPORTS = [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-414", width: 414, height: 896 },
  { name: "mobile-390", width: 390, height: 844 },
];

const AUTH_ROUTES = [
  { slug: "login", path: "/login", checks: [/google/i] },
  { slug: "signup", path: "/sign-up", checks: [/Create your account/i] },
  { slug: "forgot-password", path: "/forgot-password", checks: [/Send Code|verification code/i] },
  { slug: "login-success", path: "/login-success", checks: [/Processing your login/i] },
  { slug: "reset-password-legacy", path: "/reset-password/legacy-token", checks: [/verification code/i] },
];

function ensureScreenshotDir() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function captureAuthPage(page, viewport, route) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(route.path, { waitUntil: "domcontentloaded" });

  if (route.slug === "login-success") {
    await page.waitForTimeout(300);
  } else {
    await page.waitForTimeout(500);
    for (const pattern of route.checks) {
      await expect(page.getByText(pattern).first()).toBeVisible({ timeout: 10_000 });
    }
  }

  const fileName = `${route.slug}__${viewport.name}.png`;
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, fileName),
    fullPage: true,
  });
}

test.describe("Sprint 4 Phase 6 — Auth Final Certification", () => {
  test.beforeAll(() => {
    ensureScreenshotDir();
  });

  for (const viewport of VIEWPORTS) {
    test(`screenshots — ${viewport.name}`, async ({ page }) => {
      for (const route of AUTH_ROUTES) {
        await captureAuthPage(page, viewport, route);
      }
    });
  }

  test("API — login generic error", async ({ request }) => {
    const res = await request.post(`${API}/user/login-user`, {
      data: { email: "cert-nonexistent@yebone.test", password: "Wrong1!pass" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toMatch(/Invalid email or password/i);
  });

  test("API — forgot-password generic success", async ({ request }) => {
    const res = await request.post(`${API}/user/forgot-password`, {
      data: { email: "cert-audit@yebone.test" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toMatch(/If an account exists/i);
  });

  test("API — Google OAuth redirect", async ({ request }) => {
    const res = await request.get(`${API}/auth/google?redirect=http://127.0.0.1:3000/login-success`, {
      maxRedirects: 0,
    });
    expect([302, 303]).toContain(res.status());
    const location = res.headers()["location"] || "";
    expect(location).toMatch(/accounts\.google\.com|google/i);
  });

  test("API — login rate limit", async ({ request }) => {
    const email = `cert-ratelimit-${Date.now()}@yebone.test`;
    let lastStatus = 0;

    for (let i = 0; i < 12; i += 1) {
      const res = await request.post(`${API}/user/login-user`, {
        data: { email, password: "Wrong1!pass" },
      });
      lastStatus = res.status();
      if (lastStatus === 429) break;
    }

    expect(lastStatus).toBe(429);
  });

  test("UI — auth pages load without unexpected console errors", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    for (const route of AUTH_ROUTES.filter((r) => r.slug !== "login-success")) {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
    }

    const ignored = consoleErrors.filter(
      (msg) =>
        !/favicon/i.test(msg) &&
        !/404.*\.(png|ico|jpg)/i.test(msg) &&
        !/Failed to load resource.*404/i.test(msg) &&
        !/401 \(Unauthorized\)/i.test(msg) &&
        !/429 \(\)/i.test(msg) &&
        !/\[LoginSuccess\]/i.test(msg)
    );
    expect(ignored).toEqual([]);
  });
});
