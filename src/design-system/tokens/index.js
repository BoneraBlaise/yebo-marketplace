import { colors, cssVariables as legacyCssVariables } from "../colors";

/** Centralized design tokens — Phase 8G */
export const colorTokens = {
  ...colors,
  primary: colors.primaryGreen,
  secondary: colors.darkGreen,
  accent: colors.goldAccent,
  background: colors.lightGray,
  foreground: colors.darkText,
  muted: "#6b7280",
  border: "#e5e7eb",
  success: "#16a34a",
  warning: "#ca8a04",
  error: "#dc2626",
  info: "#2563eb",
};

export const typographyTokens = {
  fontFamily: { sans: "Roboto, sans-serif", display: "Poppins, sans-serif" },
  fontSize: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem" },
  fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.625 },
};

export const spacingTokens = { 0: "0", 1: "0.25rem", 2: "0.5rem", 3: "0.75rem", 4: "1rem", 6: "1.5rem", 8: "2rem", 12: "3rem", 16: "4rem" };
export const radiusTokens = { none: "0", sm: "0.25rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" };
export const elevationTokens = { sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.1)", lg: "0 10px 15px rgba(0,0,0,0.1)", xl: "0 20px 25px rgba(0,0,0,0.15)" };
export const borderTokens = { width: { thin: "1px", medium: "2px" }, style: { solid: "solid", dashed: "dashed" } };
export const opacityTokens = { 0: 0, 50: 0.5, 75: 0.75, 100: 1 };
export const animationTokens = { duration: { fast: "150ms", normal: "300ms", slow: "500ms" }, easing: { default: "cubic-bezier(0.4,0,0.2,1)", in: "cubic-bezier(0.4,0,1,1)", out: "cubic-bezier(0,0,0.2,1)" } };
export const breakpointTokens = { mobile: 640, tablet: 768, laptop: 1024, desktop: 1280, wide: 1536 };
export const zIndexTokens = { dropdown: 1000, sticky: 1100, modal: 1300, toast: 1400, tooltip: 1500 };
export const iconSizeTokens = { sm: "1rem", md: "1.25rem", lg: "1.5rem", xl: "2rem" };
export const componentSizeTokens = { sm: "2rem", md: "2.5rem", lg: "3rem" };

export const tailwindTokenMap = {
  "yebone-primary": "var(--yebone-primary)",
  "yebone-secondary": "var(--yebone-secondary)",
  "yebone-accent": "var(--yebone-accent)",
};

export const cssVariables = {
  ...legacyCssVariables,
  "--yebone-primary": colorTokens.primary,
  "--yebone-secondary": colorTokens.secondary,
  "--yebone-accent": colorTokens.accent,
  "--yebone-bg": colorTokens.background,
  "--yebone-fg": colorTokens.foreground,
  "--yebone-radius": radiusTokens.lg,
  "--yebone-shadow": elevationTokens.md,
};

export const designTokens = {
  colors: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  elevation: elevationTokens,
  border: borderTokens,
  opacity: opacityTokens,
  animation: animationTokens,
  breakpoints: breakpointTokens,
  zIndex: zIndexTokens,
  iconSizes: iconSizeTokens,
  componentSizes: componentSizeTokens,
  cssVariables,
  tailwind: tailwindTokenMap,
};

export default designTokens;
