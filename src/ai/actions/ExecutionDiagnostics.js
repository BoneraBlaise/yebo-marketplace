/** Development-only execution diagnostics — Phase 8C */

export const logExecutionDiagnostics = ({
  selectedAction = null,
  shouldExecute = false,
  availableActions = 0,
  permissionAllowed = true,
  validationPassed = true,
  elapsedMs = 0,
} = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  // eslint-disable-next-line no-console
  console.info("[Execution]", {
    selectedAction,
    shouldExecute,
    availableActions,
    permissionAllowed,
    validationPassed,
    elapsedMs,
  });
};

export default logExecutionDiagnostics;
