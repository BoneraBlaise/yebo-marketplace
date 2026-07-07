/** YEBO Design System — Phase 8G Enterprise */

/* Legacy exports (backward compatible) */
export { colors, cssVariables } from "./colors";
export { typography } from "./typography";
export { spacing } from "./spacing";
export { motion } from "./motion";

/* Enterprise Design System */
export { designTokens, colorTokens, cssVariables as enterpriseCssVariables } from "./tokens";
export { ThemeEngine, createThemeEngine, THEME_MODE } from "./theme/ThemeEngine";
export { EnterpriseThemeProvider, useEnterpriseTheme } from "./theme/ThemeProvider";
export { BrandEngine, createBrandEngine } from "./brand/BrandEngine";
export { BrandProvider, useBrand } from "./brand/BrandProvider";
export { ResponsiveEngine, createResponsiveEngine } from "./responsive/ResponsiveEngine";
export { useBreakpoint } from "./responsive/useBreakpoint";
export { motionClasses, getMotionDuration, motionStyle } from "./motion/MotionSystem";
export { logDesignSystemDiagnostics } from "./diagnostics/DesignSystemDiagnostics";
export { DesignSystemProvider } from "./DesignSystemProvider";

export * from "./accessibility";
export * from "./layouts";
export * from "./navigation";
export * from "./components";
export * from "./ai";
export * from "./charts";
export * from "./notifications";
export * from "./forms";
export * from "./data";
