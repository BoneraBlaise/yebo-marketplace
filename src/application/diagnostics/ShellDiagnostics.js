/** Development-only shell diagnostics — Phase 8H.1 */

export const logShellDiagnostics = (category, payload = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  const allowed = new Set(["shell", "route", "theme", "brand", "layout"]);
  if (!allowed.has(category)) return;

  const sanitized = { ...payload };
  delete sanitized.apiKey;
  delete sanitized.token;
  delete sanitized.secret;

  // eslint-disable-next-line no-console
  console.info(`[Application Shell ${category}]`, sanitized);
};

export default logShellDiagnostics;
