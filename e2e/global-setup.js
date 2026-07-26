const fs = require("fs");
const path = require("path");

const BACKEND_URL = process.env.E2E_BACKEND_URL || "http://127.0.0.1:5000";
const API_BASE = `${BACKEND_URL}/api/v2`;

async function waitForBackend(timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BACKEND_URL}/health/liveness`);
      if (res.ok) return true;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

module.exports = async function globalSetup() {
  const stackAvailable = await waitForBackend();
  process.env.E2E_STACK_AVAILABLE = stackAvailable ? "true" : "false";

  if (!stackAvailable) {
    console.warn(`[E2E] Backend not reachable at ${BACKEND_URL}. API-dependent suites will skip.`);
  }

  const required = ["E2E_BUYER_EMAIL", "E2E_BUYER_PASSWORD", "E2E_SELLER_EMAIL", "E2E_SELLER_PASSWORD"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`[E2E] Missing env vars (${missing.join(", ")}). Communication journey suites will skip.`);
  }

  const perfDir = path.join(__dirname, "playwright-report");
  fs.mkdirSync(perfDir, { recursive: true });
  fs.writeFileSync(
    path.join(perfDir, "environment.json"),
    JSON.stringify(
      {
        backendUrl: BACKEND_URL,
        apiBase: API_BASE,
        frontendUrl: process.env.E2E_FRONTEND_URL || "http://127.0.0.1:3000",
        stackAvailable,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );
};
