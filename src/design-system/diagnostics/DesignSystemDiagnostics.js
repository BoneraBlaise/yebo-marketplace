/** Development-only design system diagnostics — Phase 8G */

export const logDesignSystemDiagnostics = (category, payload = {}) => {
  if (process.env.NODE_ENV !== "development") return;
  if (process.env.NODE_ENV === "production") return;

  const allowed = new Set(["theme", "brand", "component", "layout", "performance", "accessibility"]);
  if (!allowed.has(category)) return;

  const sanitized = { ...payload };
  delete sanitized.apiKey;
  delete sanitized.token;
  delete sanitized.secret;

  // eslint-disable-next-line no-console
  console.info(`[Design System ${category}]`, sanitized);
};

export default logDesignSystemDiagnostics;
