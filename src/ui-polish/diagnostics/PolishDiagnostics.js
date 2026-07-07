/** Development-only UI polish diagnostics — Phase 8I */

export const logPolishDiagnostics = (category, payload = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  const allowed = new Set(["theme", "navigation", "responsive", "performance", "render", "chrome"]);
  if (!allowed.has(category)) return;

  const sanitized = { ...payload };
  delete sanitized.token;
  delete sanitized.secret;

  // eslint-disable-next-line no-console
  console.info(`[UI Polish ${category}]`, sanitized);
};

export default logPolishDiagnostics;
