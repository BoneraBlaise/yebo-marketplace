/** Development-only Action Framework diagnostics — Phase 8B.4 */

export const logActionDiagnostics = ({
  registeredActions = 0,
  selectedAction = null,
  elapsedMs = 0,
} = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  // eslint-disable-next-line no-console
  console.info("[Action]", {
    registeredActions,
    selectedAction,
    elapsedMs,
  });
};

export default logActionDiagnostics;
