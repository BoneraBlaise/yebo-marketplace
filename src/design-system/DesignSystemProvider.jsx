import React from "react";
import { EnterpriseThemeProvider } from "./theme/ThemeProvider";
import { BrandProvider } from "./brand/BrandProvider";
import { THEME_MODE } from "./theme/ThemeEngine";

/** Root Design System Provider — Phase 8G */
export const DesignSystemProvider = ({ children, themeMode = THEME_MODE.SYSTEM, brand = {} }) => (
  <EnterpriseThemeProvider defaultMode={themeMode}>
    <BrandProvider brand={brand}>{children}</BrandProvider>
  </EnterpriseThemeProvider>
);

export default DesignSystemProvider;
