import { useEffect } from "react";
import { logShellDiagnostics } from "../diagnostics/ShellDiagnostics";
import { ThemeEngine, createThemeEngine } from "../../design-system/theme/ThemeEngine";
import { createBrandEngine } from "../../design-system/brand/BrandEngine";

/** Application bootstrap — initializes shell subsystems — Phase 8H.1 */
export const initializeApplicationShell = ({ themeMode, brand } = {}) => {
  logShellDiagnostics("shell", { action: "bootstrap-start" });

  const themeEngine = createThemeEngine?.() || new ThemeEngine();
  const brandEngine = createBrandEngine?.() || null;

  if (themeMode) {
    themeEngine.setMode?.(themeMode);
    logShellDiagnostics("theme", { action: "loaded", mode: themeMode });
  }

  if (brand && brandEngine) {
    brandEngine.setBrand?.(brand);
    logShellDiagnostics("brand", { action: "loaded", name: brand.name });
  }

  logShellDiagnostics("shell", { action: "bootstrap-complete" });

  return { themeEngine, brandEngine };
};

export const useApplicationBootstrap = ({ themeMode, brand } = {}) => {
  useEffect(() => {
    initializeApplicationShell({ themeMode, brand });
    // brand object intentionally excluded — bootstrap runs once per themeMode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeMode]);
};

export default initializeApplicationShell;
